import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository, } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { CreateIngresoMercaderiaDto } from './dto/create-ingreso-mercaderia.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';
import { PrecioHistorial } from './entities/precio-historial.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { } from '@/types';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { TIPO_MOVIMIENTO, UNIDADES } from '@/constants/inventario';
import { ExcelReaderService } from '@/services/excel-reader/excel-reader.service';
import { Categoria } from '../categoria/entities/categoria.entity';
import { InventarioCategoria } from '../inventario-categoria/entities/inventario-categoria.entity';
import { InventarioSubcategoria } from '../inventario-subcategoria/entities/inventario-subcategoria.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INVENTARIO } from '@/constants/eventos';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(PrecioHistorial)
    private precioHistorialRepository: Repository<PrecioHistorial>,
    private readonly movimientoInventarioService: MovimientoInventarioService,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    private readonly excelReaderService: ExcelReaderService,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(InventarioCategoria)
    private readonly inventarioCategoriaRepository: Repository<InventarioCategoria>,
    @InjectRepository(InventarioSubcategoria)
    private readonly inventarioSubcategoriaRepository: Repository<InventarioSubcategoria>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(createClienteDto: CreateInventarioDto) {
    return await this.inventarioRepository.save(createClienteDto);
  }

  async findAll(conditions: FindManyOptions<Inventario>): Promise<Inventario[]> {
    const qb = this.inventarioRepository.createQueryBuilder('inventario');

    const relaciones = ['categoria', 'inventarioCategoria', 'inventarioSubcategoria', 'reservas'];

    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario.${relation}`, relation.split('.').pop());
    }

    buildWhereAndOrderQuery(qb, conditions, 'inventario');

    return await qb.getMany();
  }

  async findOne(id: number) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['reservas'], // 👈 acá agregás las relaciones que quieras
    });
    inventario['adjuntos'] = await this.archivoRepository.find({
      where: {
        modelo: 'inventario',
        modeloId: inventario.id,
        tipo: 'imagenes',
      },
      order: {
        id: 'DESC',
      },
    });
    return inventario
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { stockReservado, ...rest } = updateInventarioDto
    await this.inventarioRepository.update({ id }, rest);
    return await this.inventarioRepository.findOneBy({ id });
  }
  async remove(id: number) {

    await this.inventarioRepository.softRemove({ id });

  }
  async createIngreso(createIngreso: CreateIngresoMercaderiaDto) {
    const productos = createIngreso.productos;

    for (const producto of productos) {
      await this.movimientoInventarioService.create({
        tipoMovimiento: TIPO_MOVIMIENTO.IN,
        motivo: "Ingreso Mercaderia",
        cantidad: producto.cantidad,
        productoId: producto.productoId,
        producto: producto.producto,
        inventarioConversionId: producto.inventarioConversionId,
        ordenCompraItemId: producto.ordenCompraItemId,
      })
    }

    // Emitir evento si hay ordenCompraId
    if (createIngreso.ordenCompraId) {
      this.eventEmitter.emit(INVENTARIO.INGRESO_MERCADERIA, {
        ordenCompraId: createIngreso.ordenCompraId
      });
    }

    return productos;
  }

  async procesarMigracionExcel(fileBuffer: any, manejaStock: boolean = true) {
    try {
      const datosExcel = await this.excelReaderService.leerExcel(fileBuffer, {
        hoja: 0,
        filaEncabezados: 1,
        filaInicioDatos: 2,
      });

      const resultados = [];
      const totalFilas = datosExcel.filas.length;

      for (let index = 0; index < datosExcel.filas.length; index++) {
        const fila = datosExcel.filas[index];
        const numeroFila = index + 1;
        const resultadoFila = {
          fila: numeroFila,
          datos: {
            sku: fila.sku,
            nombre: fila.nombre,
            categoria: fila['categoria.nombre'],
            inventarioCategoria: fila['inventarioCategoria.nombre'],
            inventarioSubcategoria: fila['inventarioSubcategoria.nombre']
          },
          estado: '',
          acciones: [],
          errores: [],
          inventarioId: null,
          esNuevo: false
        };

        try {
          // 1. Procesar categoría
          const resultadoCategoria = await this.buscarOCrearCategoriaConDetalle(fila['categoria.nombre']);
          if (resultadoCategoria.creada) {
            resultadoFila.acciones.push(`✅ Categoría creada: ${resultadoCategoria.categoria.nombre}`);
          } else if (resultadoCategoria.categoria) {
            resultadoFila.acciones.push(`🔍 Categoría encontrada: ${resultadoCategoria.categoria.nombre}`);
          }
          const categoria = resultadoCategoria.categoria;

          // 2. Procesar inventario categoría
          const resultadoInventarioCategoria = await this.buscarOCrearInventarioCategoriaConDetalle(
            fila['inventarioCategoria.nombre'],
            categoria.id
          );
          if (resultadoInventarioCategoria.creada) {
            resultadoFila.acciones.push(`✅ Inventario Categoría creada: ${resultadoInventarioCategoria.inventarioCategoria.nombre}`);
          } else if (resultadoInventarioCategoria.inventarioCategoria) {
            resultadoFila.acciones.push(`🔍 Inventario Categoría encontrada: ${resultadoInventarioCategoria.inventarioCategoria.nombre}`);
          }
          const inventarioCategoria = resultadoInventarioCategoria.inventarioCategoria;

          // 3. Procesar subcategoría (opcional)
          let inventarioSubcategoria = null;
          if (fila['inventarioSubcategoria.nombre'] && fila['inventarioSubcategoria.nombre'] !== '-') {
            const resultadoSubcategoria = await this.buscarOCrearInventarioSubCategoriaConDetalle(
              fila['inventarioSubcategoria.nombre'],
              inventarioCategoria.id
            );
            if (resultadoSubcategoria.creada) {
              resultadoFila.acciones.push(`✅ Subcategoría creada: ${resultadoSubcategoria.inventarioSubcategoria.nombre}`);
            } else if (resultadoSubcategoria.inventarioSubcategoria) {
              resultadoFila.acciones.push(`🔍 Subcategoría encontrada: ${resultadoSubcategoria.inventarioSubcategoria.nombre}`);
            }
            inventarioSubcategoria = resultadoSubcategoria.inventarioSubcategoria;
          }

          // 4. Buscar inventario existente
          const inventarioExistente = await this.buscarInventarioExistente(fila);
          resultadoFila.esNuevo = !inventarioExistente;

          if (inventarioExistente) {
            resultadoFila.acciones.push(`🔄 Inventario existente encontrado - ID: ${inventarioExistente.id}`);
          } else {
            resultadoFila.acciones.push(`🆕 Nuevo inventario será creado`);
          }
          // 5. Preparar y guardar datos del inventario
          const datosInventario: CreateInventarioDto = {
            ...inventarioExistente,
            sku: fila.sku || inventarioExistente?.sku || `AUTO-${Date.now()}`,
            nombre: fila.nombre || inventarioExistente?.nombre || '',
            punit: Number(fila.punit) || inventarioExistente?.punit || 0,
            stock: Number(fila.stock) || inventarioExistente?.stock || 0,
            unidadMedida: this.validarUnidadMedida(fila.unidadMedida) || inventarioExistente?.unidadMedida || 'UN',
            descripcion: fila.descripcion || null,
            manejaStock: manejaStock,
            categoriaId: categoria.id || inventarioExistente?.categoriaId || null,
            inventarioCategoriaId: inventarioCategoria.id || inventarioExistente?.inventarioCategoriaId || null,
            inventarioSubcategoriaId: inventarioSubcategoria?.id || inventarioExistente?.inventarioSubcategoriaId || null,
            deletedAt: null,
            deletedBy: null
          };

          if (inventarioExistente) {
            datosInventario.id = inventarioExistente.id;
          }

          const inventario = await this.inventarioRepository.save(datosInventario);
          resultadoFila.inventarioId = inventario.id;

          if (inventarioExistente) {
            resultadoFila.acciones.push(`💾 Inventario actualizado - ID: ${inventario.id}`);
          } else {
            resultadoFila.acciones.push(`💾 Inventario creado - ID: ${inventario.id}`);
          }

          // 6. Crear movimiento de inventario tipo AJUSTE si hay cambio de stock
          const stockAnterior = inventarioExistente?.stock || 0;
          const stockNuevo = Number(fila.stock) || 0;

          if (stockAnterior !== stockNuevo) {
            await this.movimientoInventarioService.create({
              tipoMovimiento: TIPO_MOVIMIENTO.AJUSTE,
              motivo: "Migración Excel",
              cantidad: stockNuevo,
              productoId: inventario.id,
              producto: inventario,
            });
            resultadoFila.acciones.push(`📊 Movimiento de stock: ${stockAnterior} → ${stockNuevo}`);
          } else {
            resultadoFila.acciones.push(`📊 Sin cambio de stock: ${stockAnterior}`);
          }

          resultadoFila.estado = 'exitoso';

        } catch (error) {
          resultadoFila.estado = 'error';
          resultadoFila.errores.push(error.message || 'Error desconocido');
        }

        resultados.push(resultadoFila);
      }

      // Resumen final
      const exitosos = resultados.filter(r => r.estado === 'exitoso').length;
      const errores = resultados.filter(r => r.estado === 'error').length;
      const nuevos = resultados.filter(r => r.esNuevo).length;
      const actualizados = resultados.filter(r => !r.esNuevo && r.estado === 'exitoso').length;

      return {
        mensaje: 'Migración completada',
        resumen: {
          totalFilas,
          exitosos,
          errores,
          nuevos,
          actualizados
        },
        resultados
      };

    } catch (error) {
      throw new Error(`Error al procesar el archivo: ${error.message}`);
    }
  }

  private async buscarInventarioExistente(fila: any): Promise<Inventario | null> {
    const criterios = [];

    if (fila.id) criterios.push({ id: Number(fila.id) });
    if (fila.sku) criterios.push({ sku: String(fila.sku).trim() });
    if (fila.nombre) criterios.push({ nombre: String(fila.nombre).trim() });

    if (criterios.length === 0) return null;

    return await this.inventarioRepository.findOne({
      where: criterios,
      withDeleted: true
    });
  }

  private async buscarOCrearCategoria(nombreCategoria: string) {
    if (!nombreCategoria || nombreCategoria.trim() === '') {
      return null;
    }

    let categoria = await this.categoriaRepository.findOne({
      where: { nombre: nombreCategoria }
    });

    if (!categoria) {
      categoria = await this.categoriaRepository.save({
        nombre: nombreCategoria
      });
    }

    return categoria;
  }

  private async buscarOCrearCategoriaConDetalle(nombreCategoria: string) {
    if (!nombreCategoria || nombreCategoria.trim() === '') {
      return { categoria: null, creada: false };
    }

    let categoria = await this.categoriaRepository.findOne({
      where: { nombre: nombreCategoria }
    });

    const creada = !categoria;

    if (!categoria) {
      categoria = await this.categoriaRepository.save({
        nombre: nombreCategoria
      });
    }

    return { categoria, creada };
  }



  private async buscarOCrearInventarioCategoriaConDetalle(
    nombre: string,
    categoriaId: number
  ) {
    if (!nombre || !categoriaId) {
      return { inventarioCategoria: null, creada: false };
    }

    let inventarioCategoria = await this.inventarioCategoriaRepository.findOne({
      where: {
        nombre: nombre,
        inventarioFamiliaId: categoriaId
      }
    });

    const creada = !inventarioCategoria;

    if (!inventarioCategoria) {
      inventarioCategoria = await this.inventarioCategoriaRepository.save({
        nombre: nombre,
        inventarioFamiliaId: categoriaId
      });
    }

    return { inventarioCategoria, creada };
  }

  private async buscarOCrearInventarioSubCategoria(
    nombre: string,
    inventarioCategoriaId: number
  ) {
    if (!nombre || !inventarioCategoriaId) {
      return null;
    }

    let inventarioSubcategoria = await this.inventarioSubcategoriaRepository.findOne({
      where: {
        nombre: nombre,
        inventarioCategoriaId: inventarioCategoriaId
      }
    });

    if (!inventarioSubcategoria) {
      inventarioSubcategoria = await this.inventarioSubcategoriaRepository.save({
        nombre: nombre,
        inventarioCategoriaId: inventarioCategoriaId
      });
    }

    return inventarioSubcategoria;
  }

  private async buscarOCrearInventarioSubCategoriaConDetalle(
    nombre: string,
    inventarioCategoriaId: number
  ) {
    if (!nombre || !inventarioCategoriaId) {
      return { inventarioSubcategoria: null, creada: false };
    }

    let inventarioSubcategoria = await this.inventarioSubcategoriaRepository.findOne({
      where: {
        nombre: nombre,
        inventarioCategoriaId: inventarioCategoriaId
      }
    });

    const creada = !inventarioSubcategoria;

    if (!inventarioSubcategoria) {
      inventarioSubcategoria = await this.inventarioSubcategoriaRepository.save({
        nombre: nombre,
        inventarioCategoriaId: inventarioCategoriaId
      });
    }

    return { inventarioSubcategoria, creada };
  }

  async actualizarPrecioManual(inventarioId: number, precio: string, motivo: string, userId: number | null) {
    await this.inventarioRepository.update({ id: inventarioId }, { punit: Number(precio) });

    await this.precioHistorialRepository.save({
      inventarioId,
      ordenCompraId: null,
      precioUnitario: precio,
      motivo,
      createdBy: userId,
    });

    return await this.inventarioRepository.findOneBy({ id: inventarioId });
  }

  async getPrecioHistorial(inventarioId: number): Promise<PrecioHistorial[]> {
    return await this.precioHistorialRepository.find({
      where: { inventarioId },
      relations: ['ordenCompra', 'ordenCompra.oferta', 'ordenCompra.oferta.proveedor', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  private validarUnidadMedida(unidadMedida: string): string | null {
    if (!unidadMedida) return null;

    const unidadLimpia = unidadMedida.toString().trim().toUpperCase();

    // Verificar si la unidad existe en las constantes
    if (Object.keys(UNIDADES).includes(unidadLimpia)) {
      return unidadLimpia;
    }

    // Si no existe, retornar null para usar el valor por defecto
    return null;
  }

  /**
   * Valida disponibilidad de stock físico (sin considerar reservas)
   * Usado para egresos/movimientos que consumen stock físico directamente
   */
  async validarStockFisico(items: { productoId: number; cantidad: number }[]) {
    const validaciones = [];

    for (const item of items) {
      const producto = await this.inventarioRepository.findOne({
        where: { id: item.productoId },
      });

      if (!producto) {
        validaciones.push({
          productoId: item.productoId,
          nombre: 'Producto no encontrado',
          cantidadSolicitada: item.cantidad,
          stockActual: 0,
          disponible: false,
        });
        continue;
      }

      const stockActual = Number(producto.stock);
      const disponible = stockActual >= item.cantidad;

      validaciones.push({
        productoId: item.productoId,
        nombre: producto.nombre,
        sku: producto.sku,
        unidadMedida: producto.unidadMedida,
        cantidadSolicitada: item.cantidad,
        stockActual,
        disponible,
      });
    }

    return validaciones;
  }

  /**
   * Valida disponibilidad considerando reservas existentes
   * Usado para crear reservas que necesitan saber stock disponible
   */
  async validarDisponibilidadConReservas(
    items: { productoId: number; cantidad: number }[]
  ) {
    const validaciones = [];

    for (const item of items) {
      const producto = await this.inventarioRepository.findOne({
        where: { id: item.productoId },
        relations: ['reservas'],
      });

      if (!producto) {
        validaciones.push({
          productoId: item.productoId,
          nombre: 'Producto no encontrado',
          cantidadSolicitada: item.cantidad,
          stockActual: 0,
          stockReservado: 0,
          stockDisponible: 0,
          disponible: false,
        });
        continue;
      }

      const stockActual = Number(producto.stock);
      const stockReservado = producto.stockReservado || 0;
      const stockDisponible = stockActual - stockReservado;
      const disponible = stockDisponible >= item.cantidad;

      validaciones.push({
        productoId: item.productoId,
        nombre: producto.nombre,
        sku: producto.sku,
        unidadMedida: producto.unidadMedida,
        cantidadSolicitada: item.cantidad,
        stockActual,
        stockReservado,
        stockDisponible,
        disponible,
      });
    }

    return validaciones;
  }

}
