


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository, DataSource } from 'typeorm';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento-inventario.dto';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from '../inventario/entities/inventario.entity';
import { PrecioHistorial } from '../inventario/entities/precio-historial.entity';
import { InventarioReserva } from '../inventario-reservas/entities/inventario-reserva.entity';
import { TIPO_MOVIMIENTO } from '@/constants/inventario';
import { CreatePresupuestoDto } from '../presupuesto/dto/create-presupuesto.dto';
import { InventarioConversion } from '../inventario-conversion/entities/inventario-conversion.entity';
import { isPositive, } from 'class-validator';
import { EgresoMasivoDto } from './dto/egreso-masivo.dto';
import { OrdenCompraItem } from '../orden-compra/entities/orden-compra-item.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class MovimientoInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private movimientoInventarioRepository: Repository<MovimientoInventario>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(PrecioHistorial)
    private precioHistorialRepository: Repository<PrecioHistorial>,
    @InjectRepository(InventarioReserva)
    private inventarioReservaRepository: Repository<InventarioReserva>,
    @InjectRepository(InventarioConversion)
    private InventarioConversionRepository: Repository<InventarioConversion>,
    @InjectRepository(OrdenCompraItem)
    private ordenCompraItemRepository: Repository<OrdenCompraItem>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) { }

  async create(dto: CreateMovimientoInventarioDto) {
    const {
      tipoMovimiento,
      productoId,
      presupuestoId,
      trabajoId,
      inventarioReservaId,
      reservaId
    } = dto;
    let { cantidad } = dto;

    // --- Validación y conversión ---
    if (!isPositive(Number(dto.inventarioConversionId))) {
      delete dto.inventarioConversionId;
    }

    if (dto.inventarioConversionId) {
      const conversion = await this.InventarioConversionRepository.findOne({
        where: { id: dto.inventarioConversionId },
      });
      if (!conversion) throw new Error("Conversión no encontrada");

      cantidad = Number(cantidad) / Number(conversion.cantidad);
    }

    // --- Obtener producto ---
    const productoActual = await this.inventarioRepository.findOne({ where: { id: productoId } });
    if (!productoActual) throw new Error(`Producto con ID ${productoId} no encontrado`);

    const cantidadAntes = Number(productoActual.stock);
    let nuevoStock = cantidadAntes;

    dto.cantidadAntes = cantidadAntes;

    // --- Movimiento: ENTRADA ---
    if (tipoMovimiento === TIPO_MOVIMIENTO.IN) {
      nuevoStock = cantidadAntes + Number(cantidad);

      // Si viene con orden de compra, actualizar la recepción y precio unitario
      // La cantidad original (dto.cantidad) viene en la misma unidad que la orden de compra
      if (dto.ordenCompraItemId) {
        //TODO: DESACOPLAR ESTA LOGICA DE LA ORDEN DE COMPRA EN EL MOVIMIENTO DE INVENTARIO
        await this.actualizarRecepcionOrdenCompra(dto.ordenCompraItemId, Number(dto.cantidad));
        await this.actualizarPrecioUnitario(dto.ordenCompraItemId, productoId);
      }
    }

    // --- Movimiento: SALIDA ---
    if (tipoMovimiento === TIPO_MOVIMIENTO.OUT) {
      if (cantidadAntes < Number(cantidad)) {
        throw new Error("No hay suficiente stock para realizar el egreso");
      }

      nuevoStock = Math.max(0, cantidadAntes - Number(cantidad));

      if (inventarioReservaId) {
        const reserva = await this.inventarioReservaRepository.findOne({ where: { id: inventarioReservaId } });
        if (reserva) {
          const cantidadReserva = Number(reserva.cantidad);
          const cantidadAConsumir = Number(cantidad);
          await this.inventarioReservaRepository.update(
            { id: inventarioReservaId },
            { cantidad: cantidadReserva - cantidadAConsumir }
          );
          // TODO: Revisar si es necesario esto
          if (cantidadAConsumir >= cantidadReserva) {
            await this.inventarioReservaRepository.softRemove({ id: inventarioReservaId });
          }
        }
      }
    }

    // --- Movimiento: AJUSTE ---
    if (tipoMovimiento === TIPO_MOVIMIENTO.AJUSTE) {
      nuevoStock = Number(cantidad);
    }

    // --- Movimiento: PRESTAMO ---
    // El stock físico no cambia — la disponibilidad se calcula como stock - prestadas
    if (tipoMovimiento === TIPO_MOVIMIENTO.PRESTAMO) {
      // Validar disponibilidad calculando prestadas activas
      const prestadoResult = await this.movimientoInventarioRepository
        .createQueryBuilder('m')
        .select(
          `SUM(CASE WHEN m.tipo_movimiento = 'PRESTAMO' THEN m.cantidad ELSE -m.cantidad END)`,
          'total'
        )
        .where('m.producto_id = :productoId', { productoId })
        .andWhere('m.tipo_movimiento IN (:...tipos)', { tipos: [TIPO_MOVIMIENTO.PRESTAMO, TIPO_MOVIMIENTO.DEVOLUCION] })
        .getRawOne();

      const prestadas = Math.max(0, Number(prestadoResult?.total ?? 0));
      const disponible = cantidadAntes - prestadas;

      if (disponible < Number(cantidad)) {
        throw new Error(`No hay suficiente stock disponible. Disponibles: ${disponible}`);
      }
      // nuevoStock no cambia — el stock físico permanece igual
    }

    // --- Movimiento: DEVOLUCION ---
    // El stock físico no cambia — la disponibilidad se recalcula al bajar las prestadas
    if (tipoMovimiento === TIPO_MOVIMIENTO.DEVOLUCION) {
      if (!dto.personaId) {
        throw new Error('Se requiere una persona para registrar una devolución');
      }
      // Validar que la persona no devuelva más de lo que tiene prestado
      const prestadoAPersona = await this.movimientoInventarioRepository
        .createQueryBuilder('m')
        .select(
          `SUM(CASE WHEN m.tipo_movimiento = 'PRESTAMO' THEN m.cantidad ELSE -m.cantidad END)`,
          'saldo'
        )
        .where('m.producto_id = :productoId', { productoId })
        .andWhere('m.persona_id = :personaId', { personaId: dto.personaId })
        .andWhere('m.tipo_movimiento IN (:...tipos)', { tipos: [TIPO_MOVIMIENTO.PRESTAMO, TIPO_MOVIMIENTO.DEVOLUCION] })
        .getRawOne();

      const saldoPrestado = Number(prestadoAPersona?.saldo ?? 0);
      if (Number(cantidad) > saldoPrestado) {
        throw new Error(`La persona no tiene suficientes unidades prestadas para devolver. Tiene prestadas: ${saldoPrestado}`);
      }
      // nuevoStock no cambia — el stock físico permanece igual
    }

    // --- Movimiento: RESERVA ---
    if (tipoMovimiento === TIPO_MOVIMIENTO.RESERVA) {
      this.inventarioReservaRepository.save({
        cantidad,
        productoId,
        presupuestoId,
        reservaId,
        trabajoId,
      });
    }

    // --- Guardado final ---
    dto.cantidadDespues = nuevoStock;
    await this.inventarioRepository.update({ id: productoId }, { stock: nuevoStock });

    return await this.movimientoInventarioRepository.save(dto);
  }

  async findAll(conditions: FindManyOptions<MovimientoInventario>): Promise<MovimientoInventario[]> {
    const qb = this.movimientoInventarioRepository.createQueryBuilder('movimiento-inventario').withDeleted();
    const relaciones = ['producto', 'presupuesto', 'trabajo', 'inventarioConversion', 'centroCosto', 'ordenCompraItem', 'persona', 'reserva'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`movimiento-inventario.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'movimiento-inventario')
    const presupuestos = await qb.getMany();


    return presupuestos;
  }
  async findOne(id: number) {
    return await this.movimientoInventarioRepository.findOneBy({ id });
  }

  async update(id: number, updateMovimientoInventarioDto: UpdateMovimientoInventarioDto) {
    await this.movimientoInventarioRepository.update({ id }, updateMovimientoInventarioDto);
    return await this.movimientoInventarioRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const movimientoInventario = await this.findOne(id);

    await this.movimientoInventarioRepository.delete({ id });
    return movimientoInventario
  }


  async reservarStockDePresupuesto(presupuesto: CreatePresupuestoDto) {
    for (const item of presupuesto.items) {
      for (const material of item.materiales) {
        if (material.inventario?.manejaStock) {
          await this.create({
            cantidad: material.cantidad,
            presupuestoId: presupuesto.id,
            productoId: material.inventarioId,
            trabajoId: material.trabajoId,
            motivo: 'Reserva de material para presupuesto',
            tipoMovimiento: TIPO_MOVIMIENTO.RESERVA,
            producto: material.inventario,
          });
        }
      }

      for (const suministro of item.suministros) {
        if (suministro.inventario?.manejaStock) {
          await this.create({
            cantidad: suministro.cantidad,
            presupuestoId: presupuesto.id,
            productoId: suministro.inventarioId,
            trabajoId: suministro.trabajoId,
            motivo: 'Reserva de suministro para presupuesto',
            tipoMovimiento: TIPO_MOVIMIENTO.RESERVA,
            producto: suministro.inventario,
          });
        }
      }
    }
  }

  async egresoMasivo(egresoMasivoDto: EgresoMasivoDto) {
    const { tipo, productos, motivo, observaciones, reservaId } = egresoMasivoDto;
    let { presupuestoId, centroCostoId, personaId } = egresoMasivoDto;
    let trabajoId: number | undefined;

    // Validar según el tipo de egreso
    if (tipo === 'presupuesto' && !presupuestoId) {
      throw new Error('Debe seleccionar un presupuesto');
    }
    if (tipo === 'centro-costo' && !centroCostoId) {
      throw new Error('Debe seleccionar un centro de costo');
    }
    if (tipo === 'reserva' && !reservaId) {
      throw new Error('Debe seleccionar una reserva');
    }

    // Si viene una reservaId (entidad Reserva), usar sus datos como fallback
    if (reservaId) {
      const reserva = await this.reservaRepository.findOne({
        where: { id: reservaId },
        relations: ['persona'],
      });

      if (reserva) {
        // Usar valores de la reserva solo si no vienen en el DTO
        personaId = personaId || reserva.personaId;
        centroCostoId = centroCostoId || reserva.centroCostoId;
        presupuestoId = presupuestoId || reserva.presupuestoId;
        trabajoId = trabajoId || reserva.trabajoId;
      }
    }

    const errores = [];
    // Procesar cada producto usando el método create que ya tiene toda la lógica
    for (const productoEgreso of productos) {
      const { reservaId: inventarioReservaId, productoId, cantidad } = productoEgreso;

      try {
        // Obtener el producto
        const producto = await this.inventarioRepository.findOne({
          where: { id: productoId },
        });

        if (!producto) {
          throw new Error(`Producto con ID ${productoId} no encontrado`);
        }

        // Buscar información de trabajo si tiene reserva de inventario
        const trabajoIdFromInventarioReserva = inventarioReservaId
          ? (await this.inventarioReservaRepository.findOne({ where: { id: inventarioReservaId } }))?.trabajoId
          : undefined;

        // El trabajoId puede venir de la reserva de inventario o de la reserva (entidad Reserva)
        const trabajoIdProducto = trabajoIdFromInventarioReserva || trabajoId;

        await this.create({
          tipoMovimiento: TIPO_MOVIMIENTO.OUT,
          cantidad: Number(cantidad),
          motivo: motivo || presupuestoId ? 'Egreso OT ' + presupuestoId : 'Egreso',
          observaciones,
          productoId,
          producto,
          presupuestoId,
          centroCostoId,
          trabajoId: trabajoIdProducto,
          inventarioReservaId: inventarioReservaId || undefined,
          personaId,
          reservaId: reservaId || undefined,
        });
      } catch (error) {
        errores.push({
          productoId,
          error: error.message,
        });
      }
    }

    // Si hubo errores en algún producto, lanzar excepción
    if (errores.length > 0) {
      throw new Error(`Errores al procesar productos: ${JSON.stringify(errores)}`);
    }

    return { success: true };
  }

  async findByPresupuestoId(presupuestoId: number) {
    return await this.movimientoInventarioRepository.find({
      where: { presupuestoId },
      relations: ['producto', 'producto.reservas'],
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Actualiza la cantidad recepcionada de un item de orden de compra.
   * Acumula recepciones parciales y marca como recepcionado cuando se completa el total.
   *
   * SIMPLIFICADO: El frontend garantiza que la cantidad ingresada viene en la misma
   * unidad de medida que la orden de compra (ya con la conversión aplicada si corresponde).
   * Por lo tanto, simplemente sumamos las cantidades directamente.
   *
   * @param ordenCompraItemId - ID del item de la orden de compra
   * @param cantidadIngresada - Cantidad ingresada en la MISMA unidad que la orden de compra
   *
   * @example
   * // Orden de compra: 100 unidades
   * // Cantidad recepcionada anterior: 30 unidades
   * // Cantidad ingresada ahora: 40 unidades
   * // Cálculo: 30 + 40 = 70
   * // Resultado: cantidadRecepcionada = 70, recepcionado = false (70 < 100)
   *
   * @example
   * // Orden de compra: 10 cajas
   * // Cantidad recepcionada anterior: 3 cajas
   * // Cantidad ingresada ahora: 2 cajas
   * // Cálculo: 3 + 2 = 5
   * // Resultado: cantidadRecepcionada = 5, recepcionado = false (5 < 10)
   */
  private async actualizarRecepcionOrdenCompra(
    ordenCompraItemId: number,
    cantidadIngresada: number
  ) {
    const ordenCompraItem = await this.ordenCompraItemRepository.findOne({
      where: { id: ordenCompraItemId },
    });

    if (!ordenCompraItem) return;

    // Cantidad total del item (en la unidad de la orden de compra)
    const cantidadTotal = Number(ordenCompraItem.cantidad);

    // Cantidad recepcionada anterior (en la misma unidad)
    const cantidadRecepcionadaAnterior = ordenCompraItem.cantidadRecepcionada
      ? Number(ordenCompraItem.cantidadRecepcionada)
      : 0;

    // Nueva cantidad recepcionada total (suma directa, misma unidad)
    const nuevaCantidadRecepcionada = cantidadRecepcionadaAnterior + cantidadIngresada;

    // Actualizar el item
    await this.ordenCompraItemRepository.update(
      { id: ordenCompraItemId },
      {
        cantidadRecepcionada: nuevaCantidadRecepcionada.toString(),
        recepcionado: nuevaCantidadRecepcionada >= cantidadTotal,
      }
    );
  }

  /**
   * Calcula el precio unitario en la unidad base del inventario a partir del item de OC.
   *
   * El campo `precio` de `orden_compra_item` es precio UNITARIO en la unidad de la OC.
   *
   * @param ordenCompraItemId - ID del item de la orden de compra
   * @param productoId - ID del producto en inventario
   *
   * @example
   * // Caso 1: Sin conversión
   * // Item OC: precio = $1,000 por unidad
   * // punit = $1,000
   *
   * @example
   * // Caso 2: Con conversión (1 caja = 10 unidades)
   * // Item OC: precio = $10,000 por caja, factorConversion = 10
   * // punit = $10,000 / 10 = $1,000 por unidad
   */
  async actualizarPrecioUnitario(
    ordenCompraItemId: number,
    productoId: number
  ): Promise<number> {
    const ordenCompraItem = await this.ordenCompraItemRepository.findOne({
      where: { id: ordenCompraItemId },
      relations: ['inventarioConversion']
    });

    if (!ordenCompraItem) return null;

    // El campo precio ya es precio unitario en la unidad de la OC
    let precioUnitario = Number(ordenCompraItem.precio);

    // Si hay conversión, convertir a unidad base del inventario
    if (ordenCompraItem.inventarioConversion) {
      const factorConversion = Number(ordenCompraItem.inventarioConversion.cantidad);
      precioUnitario = precioUnitario / factorConversion;
    }

    const precioUnitarioRedondeado = Number(precioUnitario.toFixed(2));

    await this.inventarioRepository.update(
      { id: productoId },
      { punit: precioUnitarioRedondeado }
    );

    // Registrar en historial de precios
    await this.precioHistorialRepository.save({
      inventarioId: productoId,
      ordenCompraId: ordenCompraItem.ordenCompraId,
      precioUnitario: precioUnitarioRedondeado.toString(),
      motivo: null,
    });

    return precioUnitarioRedondeado;
  }

}
