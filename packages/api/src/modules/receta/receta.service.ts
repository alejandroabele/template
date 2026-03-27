import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions, Not, In } from 'typeorm';
import { Receta } from './entities/receta.entity';
import { RecetaInventario } from './entities/receta-inventario.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecetaService {
  constructor(
    @InjectRepository(Receta) private recetaRepository: Repository<Receta>,
    @InjectRepository(RecetaInventario) private recetaInventarioRepository: Repository<RecetaInventario>,
    @InjectRepository(Inventario) private inventarioRepository: Repository<Inventario>,
    @InjectRepository(ProduccionTrabajo) private produccionTrabajoRepository: Repository<ProduccionTrabajo>,
  ) { }




  // Obtener todas las recetas
  async findAll(conditions: FindManyOptions<Receta>): Promise<any[]> {
    const recetas = await this.recetaRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: {
        productos: {
          inventario: true,
          produccionTrabajo: true
        }
      }
    });

    // Transformar cada receta agregando produccionTrabajos
    return await Promise.all(
      recetas.map(async (receta) => ({
        id: receta.id,
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        produccionTrabajos: await this.mapProduccionTrabajos(receta)
      }))
    );
  }
  // Obtener una receta por ID
  async findOne(id: number) {
    if (!id) return null

    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: {
        productos: {
          inventario: true,
          produccionTrabajo: true
        }
      }
    });

    if (!receta) return null;

    return {
      id: receta.id,
      nombre: receta.nombre,
      descripcion: receta.descripcion,
      produccionTrabajos: await this.mapProduccionTrabajos(receta)
    };
  }


  async mapProduccionTrabajos(receta: Receta) {
    if (!receta) return null;

    const todosProduccionTrabajos = await this.produccionTrabajoRepository.find();

    const produccionTrabajos = {
      producto: [],
      servicio: []
    };

    const produccionTrabajosMap: { [key: number]: any } = {};

    // Inicializamos el mapa con todos los `produccionTrabajo`
    for (const produccionTrabajo of todosProduccionTrabajos) {
      produccionTrabajosMap[produccionTrabajo.id] = {
        id: produccionTrabajo.id,
        nombre: produccionTrabajo.nombre,
        tipo: produccionTrabajo.tipo,
        materiales: [],
        suministros: [],
        manoDeObra: [],
      };
    }

    // Clasificar los productos en los trabajos de producción
    for (const producto of receta.productos) {
      const { produccionTrabajo, tipo, cantidad } = producto;
      if (!producto.inventario) continue;
      const entry = { cantidad, inventario: producto.inventario, inventarioId: producto.inventarioId, punit: producto.inventario?.punit, importe: Number(producto.inventario?.punit) * Number(cantidad) };

      if (produccionTrabajosMap[produccionTrabajo.id]) {
        if (tipo === "MATERIALES") {
          produccionTrabajosMap[produccionTrabajo.id].materiales.push(entry);
        } else if (tipo === "SUMINISTROS") {
          produccionTrabajosMap[produccionTrabajo.id].suministros.push(entry);
        } else if (tipo === "MANO_DE_OBRA") {
          produccionTrabajosMap[produccionTrabajo.id].manoDeObra.push(entry);
        }
      }
    }

    // Separar los trabajos de producción en "productos" y "servicios"
    for (const produccion of Object.values(produccionTrabajosMap)) {
      if (produccion.tipo === "producto") {
        produccionTrabajos.producto.push(produccion);
      } else if (produccion.tipo === "servicio") {
        produccionTrabajos.servicio.push(produccion);
      }
    }

    return produccionTrabajos;
  }


  async create(createRecetaDto: any) {
    const { nombre, descripcion, produccionTrabajos } = createRecetaDto;

    // Crear la receta y guardarla para obtener su ID
    const receta = await this.recetaRepository.save(
      this.recetaRepository.create({ nombre, descripcion })
    );

    // Lista para almacenar los productos de la receta
    const productosParaGuardar: RecetaInventario[] = [];

    for (const tipo of ['producto', 'servicio']) {
      if (!produccionTrabajos && !produccionTrabajos[tipo]) continue;

      for (const produccion of produccionTrabajos[tipo]) {
        const { id: produccionTrabajoId, materiales, suministros, manoDeObra } = produccion;

        // Agrupar los productos en una sola lista
        const productosLista = [
          { lista: materiales, tipo: 'MATERIALES' },
          { lista: suministros, tipo: 'SUMINISTROS' },
          { lista: manoDeObra, tipo: 'MANO_DE_OBRA' }
        ];

        for (const { lista, tipo } of productosLista) {
          for (const item of lista) {
            const { cantidad, inventarioId } = item;

            // Crear instancia de RecetaInventario con recetaId ya definido
            const recetaInventario = this.recetaInventarioRepository.create({
              recetaId: receta.id, // Ahora ya tiene un ID
              inventarioId,
              cantidad,
              produccionTrabajoId,
              tipo,
            });

            productosParaGuardar.push(recetaInventario);
          }
        }
      }
    }
    // Guardar todos los productos en la base de datos
    await this.recetaInventarioRepository.save(productosParaGuardar);

    return receta;
  }
  async update(id: number, updateRecetaDto: any) {
    const { nombre, descripcion, produccionTrabajos } = updateRecetaDto;

    // Actualizar la receta (nombre y descripcion)
    await this.recetaRepository.update({ id }, { nombre, descripcion });

    // Elimino todos los productos de esa receta

    await this.recetaInventarioRepository.delete({
      recetaId: id,
    });
    // Buscar los productos actuales de la receta
    const productosExistentes = await this.recetaInventarioRepository.find({ where: { recetaId: id } });

    // Lista para almacenar los nuevos productos a guardar
    const productosParaGuardar: RecetaInventario[] = [];



    if (produccionTrabajos) {
      for (const tipo of ['producto', 'servicio']) {
        if (!produccionTrabajos[tipo]) continue;

        for (const produccion of produccionTrabajos[tipo]) {
          const { id: produccionTrabajoId, materiales, suministros, manoDeObra } = produccion;

          const productosLista = [
            { lista: materiales, tipo: 'MATERIALES' },
            { lista: suministros, tipo: 'SUMINISTROS' },
            { lista: manoDeObra, tipo: 'MANO_DE_OBRA' }
          ];

          for (const { lista, tipo } of productosLista) {
            for (const item of lista) {
              const productoExistente = productosExistentes.find(
                (producto) =>
                  producto.inventarioId === item.productoId &&
                  producto.tipo === tipo &&
                  producto.produccionTrabajoId === produccionTrabajoId
              );

              if (productoExistente) {
                // Si el producto existe, se actualiza la cantidad
                await this.recetaInventarioRepository.update(
                  { recetaId: id, inventarioId: item.inventarioId, tipo, produccionTrabajoId },
                  { cantidad: item.cantidad }
                );
              } else {
                // Si el producto no existe, se crea uno nuevo
                const recetaInventario = this.recetaInventarioRepository.create({
                  recetaId: id,
                  inventarioId: item.inventarioId,
                  tipo,
                  produccionTrabajoId,
                  cantidad: item.cantidad
                });
                productosParaGuardar.push(recetaInventario);
              }
            }
          }
        }
      }

      // TODO: NO elimina correctamente
      // const productosAEliminar = productosExistentes.filter(
      //   (producto) =>
      //     !produccionTrabajos['producto']?.some(
      //       (produccion) =>
      //         produccion.materiales.some((item) => item.productoId === producto.productoId) ||
      //         produccion.suministros.some((item) => item.productoId === producto.productoId) ||
      //         produccion.manoDeObra.some((item) => item.productoId === producto.productoId)
      //     ) &&
      //     !produccionTrabajos['servicio']?.some(
      //       (produccion) =>
      //         produccion.materiales.some((item) => item.productoId === producto.productoId) ||
      //         produccion.suministros.some((item) => item.productoId === producto.productoId) ||
      //         produccion.manoDeObra.some((item) => item.productoId === producto.productoId)
      //     )
      // );

      // for (const producto of productosAEliminar) {
      //   await this.recetaInventarioRepository.delete({
      //     recetaId: id,
      //     productoId: producto.productoId,
      //     tipo: producto.tipo,
      //     produccionTrabajoId: producto.produccionTrabajoId
      //   });
      // }

      // Guardar los nuevos productos
      if (productosParaGuardar.length) {
        await this.recetaInventarioRepository.save(productosParaGuardar);
      }
    }
    // Retornar la receta actualizada
    return this.findOne(id);
  }


  // Eliminar receta
  async remove(id: number) {
    // Primero, obtenemos la receta con sus productos asociados para verificar que existe.
    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: ['productos'], // Cargamos los productos asociados para asegurarnos de que existan.
    });

    if (!receta) {
      throw new Error('Receta no encontrada');
    }

    // Luego, eliminamos los productos asociados a la receta (esto se maneja con 'CASCADE' en la relación).
    await this.recetaRepository.remove(receta);

    // Devolvemos un mensaje de confirmación o la receta eliminada, según lo que necesites.
    return `Receta con id ${id} ha sido eliminada exitosamente.`;
  }

  recalcularProduccionTrabajos = (receta: any, cantidad: number) => {
    const base = receta?.produccionTrabajos || { producto: [], servicio: [] }

    const escalar = (trabajos: any[]) =>
      trabajos.map((trabajo: any) => ({
        ...trabajo,
        materiales: trabajo.materiales.map((m: any) => ({
          ...m,
          cantidad: m.cantidad * cantidad,
          importe: m.cantidad * cantidad * m.punit,
        })),
        suministros: trabajo.suministros.map((s: any) => ({
          ...s,
          cantidad: s.cantidad * cantidad,
          importe: s.cantidad * cantidad * s.punit,
        })),
        manoDeObra: trabajo.manoDeObra.map((mo: any) => ({
          ...mo,
          cantidad: mo.cantidad * cantidad,
          importe: mo.cantidad * cantidad * mo.punit,
        })),
      }))

    return {
      producto: escalar(base.producto),
      servicio: escalar(base.servicio),
    }
  }
}
