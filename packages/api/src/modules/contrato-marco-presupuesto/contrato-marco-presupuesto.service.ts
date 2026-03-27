import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContratoMarcoPresupuestoDto } from './dto/create-contrato-marco-presupuesto.dto';
import { UpdateContratoMarcoPresupuestoDto } from './dto/update-contrato-marco-presupuesto.dto';
import { ContratoMarcoPresupuesto } from './entities/contrato-marco-presupuesto.entity';
import { PresupuestoProduccion } from '@/modules/presupuesto-produccion/entities/presupuesto-produccion.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { PresupuestoItem } from '../presupuesto-item/entities/presupuesto-item.entity';
import { ContratoMarcoPresupuestoItem } from '../contrato-marco-presupuesto-item/entities/contrato-marco-presupuesto-item.entity';
import { RecetaService } from '@/modules/receta/receta.service';
import { PresupuestoService } from '../presupuesto/presupuesto.service';
import { CONTRATO_MARCO_PRESUPUESTO, CONTRATO_MARCO_PRESUPUESTO_TIPO_A_ITEM } from '@/constants/contrato-marco';
import { PROCESO_GENERAL } from '@/constants/proceso-general';
import { OnEvent } from '@nestjs/event-emitter';
import { PRESUPUESTO } from '@/constants/eventos';

@Injectable()
export class ContratoMarcoPresupuestoService {
  constructor(
    @InjectRepository(ContratoMarcoPresupuesto)
    private contratoMarcoPresupuestoRepository: Repository<ContratoMarcoPresupuesto>,
    @InjectRepository(ContratoMarcoPresupuestoItem)
    private contratoMarcoPresupuestoItemRepository: Repository<ContratoMarcoPresupuestoItem>,
    @InjectRepository(PresupuestoProduccion)
    private procesoProduccionRepository: Repository<PresupuestoProduccion>,
    @InjectRepository(Presupuesto)
    private presupuestoRepository: Repository<Presupuesto>,
    @InjectRepository(PresupuestoItem)
    private presupuestoItemRepository: Repository<PresupuestoItem>,
    private recetaService: RecetaService,
    @Inject(forwardRef(() => PresupuestoService))
    private presupuestoService: PresupuestoService,
  ) { }

  // ===== Helpers de negocio (privados) =====
  private async vincularContratoMarcoPresupuestoItems(
    contratoMarcoPresupuestoId: number,
    presupuestoItemId: number,
    contratoMarcoPresupuestoItems: ContratoMarcoPresupuestoItem[],
  ) {
    for (const contratoMarcoPresupuestoItem of contratoMarcoPresupuestoItems) {
      await this.contratoMarcoPresupuestoItemRepository.save({
        ...contratoMarcoPresupuestoItem,
        contratoMarcoPresupuestoId,
        presupuestoItemId,
      });
    }
  }

  private async acumularTrabajosDesdeContratoItems(
    cantidadPresupuestoItem: number,
    contratoMarcoPresupuestoItems: ContratoMarcoPresupuestoItem[],
  ) {
    let acumuladoProducto: any[] = [];
    let acumuladoServicio: any[] = [];
    let totalDeseado = 0;
    let descripcionDetallada = '';

    for (const contratoMarcoPresupuestoItem of contratoMarcoPresupuestoItems) {
      const recetaId = contratoMarcoPresupuestoItem?.contratoMarcoTalonarioItem?.receta?.id;
      const receta = await this.recetaService.findOne(recetaId);
      const factor = Number(cantidadPresupuestoItem) * (Number(contratoMarcoPresupuestoItem.cantidad) || 1);
      const { producto, servicio } =
        this.recetaService.recalcularProduccionTrabajos(receta, factor);
      totalDeseado +=
        Number(contratoMarcoPresupuestoItem?.contratoMarcoTalonarioItem?.precio) * (Number(contratoMarcoPresupuestoItem.cantidad) || 1);
      acumuladoProducto = mergeTrabajos(acumuladoProducto, producto);
      acumuladoServicio = mergeTrabajos(acumuladoServicio, servicio);

      descripcionDetallada += `COD: ${contratoMarcoPresupuestoItem?.contratoMarcoTalonarioItem?.codigo ?? '-'} / ${contratoMarcoPresupuestoItem?.contratoMarcoTalonarioItem?.descripcion ?? '-'} — Cant: ${Number((contratoMarcoPresupuestoItem?.cantidad || cantidadPresupuestoItem) ?? 0)}.\n`;
    }
    return { acumuladoProducto, acumuladoServicio, totalDeseado, descripcionDetallada };
  }

  private armarItemPresupuestoAjustado(
    presupuestoItemId: number,
    cantidad: number,
    acumuladoProducto: any[],
    acumuladoServicio: any[],
    totalDeseado: number,
    descripcionDetallada?: string,
    descripcion?: string
  ) {
    const ajuste = this.presupuestoService.ajustarItemPorNuevoTotal(
      { producto: acumuladoProducto, servicio: acumuladoServicio },
      totalDeseado * Number(cantidad),
    );

    return {
      id: presupuestoItemId,
      cantidad: Number(cantidad) || 0,
      produccionTrabajos: { producto: acumuladoProducto, servicio: acumuladoServicio },
      ...(descripcionDetallada ? { detalles: descripcionDetallada } : {}),
      descripcion,
      ...ajuste,
    };
  }

  private async sincronizarServiciosDeProduccion(
    presupuestoId: number,
    serviciosDeseados: number[],
  ) {
    const procesosActuales = await this.procesoProduccionRepository.find({ where: { presupuestoId } });
    const actualesIds = procesosActuales.map(p => p.trabajoId);

    const procesosAEliminar = procesosActuales.filter(p => !serviciosDeseados.includes(p.trabajoId));
    if (procesosAEliminar.length) await this.procesoProduccionRepository.remove(procesosAEliminar);

    const serviciosANuevos = serviciosDeseados.filter(id => !actualesIds.includes(id));
    if (serviciosANuevos.length) {
      const nuevos = serviciosANuevos.map(trabajoId => ({ presupuestoId, trabajoId }));
      await this.procesoProduccionRepository.save(nuevos);
    }
  }

  private async actualizarEstadoPorPresupuestoId(presupuestoId: number, estado: string) {
    const orden = await this.contratoMarcoPresupuestoRepository.findOne({ where: { presupuestoId } });
    if (!orden || orden.estado === 'finalizado') return;
    await this.contratoMarcoPresupuestoRepository.update(orden.id, { estado });
  }

  async create(dto: CreateContratoMarcoPresupuestoDto) {
    if (dto.tipo === 'producto') {
      const { presupuesto: { items = [], ...pres }, ...datosContrato } = dto as any;
      const nuevoPresupuesto = await this.presupuestoRepository.save({ ...pres, costeoEstatus: 'completo' });
      const contrato = await this.contratoMarcoPresupuestoRepository.save({
        ...datosContrato, presupuestoId: nuevoPresupuesto.id,
        estado: 'finalizado'
      });

      const itemsCalculados = await Promise.all(items.map(async (item) => {
        const { contratoMarcoPresupuestoItems = [], ...datosItem } = item;
        const presupuestoItem = await this.presupuestoItemRepository.save({ ...datosItem, presupuestoId: nuevoPresupuesto.id, tipo: CONTRATO_MARCO_PRESUPUESTO_TIPO_A_ITEM[dto.tipo] });
        await this.vincularContratoMarcoPresupuestoItems(contrato.id, presupuestoItem.id, contratoMarcoPresupuestoItems);
        const cantidad = Number(item.cantidad);
        const a = await this.acumularTrabajosDesdeContratoItems(cantidad, contratoMarcoPresupuestoItems);
        return this.armarItemPresupuestoAjustado(
          presupuestoItem.id, cantidad, a.acumuladoProducto, a.acumuladoServicio, a.totalDeseado, a.descripcionDetallada, item.descripcion
        );
      }));

      await this.presupuestoService.actualizarItemsPresupuesto(
        nuevoPresupuesto.id, itemsCalculados, { ...pres, items, costeoEstatus: 'completo' }
      );
      return contrato;
    }

    const { presupuesto, servicios = [], ...datosContrato } = dto;
    const nuevoPresupuesto = await this.presupuestoRepository.save(presupuesto);
    const contrato = await this.contratoMarcoPresupuestoRepository.save({ ...datosContrato, presupuestoId: nuevoPresupuesto.id });
    if (servicios.length) await this.procesoProduccionRepository.save(servicios.map((trabajoId: number) => ({ presupuestoId: nuevoPresupuesto.id, trabajoId })));
    return contrato;
  }


  // ===== Read =====
  async findAll(conditions: FindManyOptions<ContratoMarcoPresupuesto>): Promise<ContratoMarcoPresupuesto[]> {
    const qb = this.contratoMarcoPresupuestoRepository.createQueryBuilder('contrato-marco-presupuesto');
    const relaciones = [
      'contratoMarco',
      'presupuesto',
      'presupuesto.procesoGeneral',
    ];

    for (const relation of relaciones) {
      const path = relation.includes('.')
        ? relation
        : `contrato-marco-presupuesto.${relation}`;
      qb.leftJoinAndSelect(path, relation.split('.').pop());
    }

    buildWhereAndOrderQuery(qb, conditions, 'contrato-marco-presupuesto');
    return qb.getMany();
  }

  async findOne(id: number) {
    // Optimización: usar query builder con leftJoin para hacer una sola query SQL
    const contrato = await this.contratoMarcoPresupuestoRepository
      .createQueryBuilder('cmp')
      .leftJoinAndSelect('cmp.contratoMarco', 'contratoMarco')
      .leftJoinAndSelect('contratoMarco.cliente', 'cliente')
      .leftJoinAndSelect('contratoMarco.talonarios', 'talonarios')
      .leftJoinAndSelect('talonarios.items', 'talonarioItems')
      .leftJoinAndSelect('talonarioItems.contratoMarcoTalonario', 'contratoMarcoTalonario')
      .leftJoinAndSelect('cmp.presupuesto', 'presupuesto')
      .leftJoinAndSelect('presupuesto.items', 'presupuestoItems')
      .leftJoinAndSelect('presupuestoItems.contratoMarcoPresupuestoItems', 'contratoMarcoPresupuestoItems')
      .leftJoinAndSelect('contratoMarcoPresupuestoItems.contratoMarcoTalonarioItem', 'contratoMarcoTalonarioItem')
      .leftJoinAndSelect('contratoMarcoPresupuestoItems.presupuestoItem', 'presupuestoItem')
      .leftJoinAndSelect('presupuesto.procesoGeneral', 'procesoGeneral')
      .where('cmp.id = :id', { id })
      .getOne();


    if (!contrato) return null;

    const procesos = await this.procesoProduccionRepository.find({
      where: { presupuestoId: contrato.presupuestoId },
      relations: ['trabajo'],
    });

    return {
      ...contrato,
      servicios: procesos.map((p) => p.trabajoId),
    };
  }

  // ===== Update =====
  async update(id: number, dto: UpdateContratoMarcoPresupuestoDto) {
    try {
      const { presupuesto, servicios = [], items = [], ...datosContrato } = dto;

      const contratoMarcoPresupuesto = await this.contratoMarcoPresupuestoRepository.findOneOrFail({
        where: { id },
      });

      if (dto.estado === CONTRATO_MARCO_PRESUPUESTO.ESTADO.VALORIZACION) {
        if (presupuesto) {
          presupuesto.costeoEstatus = 'completo';
          presupuesto.costeoComercialEstatus = 'completo';
          presupuesto.procesoGeneralId = PROCESO_GENERAL.CERTIFICACION_PENDIENTE;
        }
      }

      // 1) Actualizar contrato marco presupuesto (sin items en cascada)
      await this.contratoMarcoPresupuestoRepository.save({
        id,
        ...datosContrato,
        presupuesto: {
          ...presupuesto,
        },
      });



      // 2) Guardar/actualizar presupuesto items y contrato-marco-presupuesto-items
      const itemsCalculados: any[] = [];
      for (const item of presupuesto.items ?? []) {
        // 2.a) guardar presupuestoItem
        const savedPresupuestoItem = await this.presupuestoItemRepository.save({
          ...item,
          presupuestoId: contratoMarcoPresupuesto.presupuestoId,
          tipo: CONTRATO_MARCO_PRESUPUESTO_TIPO_A_ITEM[contratoMarcoPresupuesto.tipo],
        });

        // 2.b) guardar contratoMarcoPresupuestoItems vinculados
        for (const cpi of item.contratoMarcoPresupuestoItems ?? []) {
          await this.contratoMarcoPresupuestoItemRepository.save({
            ...cpi,
            contratoMarcoPresupuestoId: contratoMarcoPresupuesto.id,
            presupuestoItemId: savedPresupuestoItem.id,
          });
        }
        // 2.c) recalcular acumulados y armar item ajustado
        const {
          acumuladoProducto,
          acumuladoServicio,
          totalDeseado,
          descripcionDetallada,

        } = await this.acumularTrabajosDesdeContratoItems(
          Number(item.cantidad),
          item.contratoMarcoPresupuestoItems ?? [],
        );

        const itemAjustado = this.armarItemPresupuestoAjustado(
          savedPresupuestoItem.id,
          Number(item.cantidad),
          acumuladoProducto,
          acumuladoServicio,
          totalDeseado,
          descripcionDetallada,
          item.descripcion,
        );

        if (!item.deletedAt) {
          itemsCalculados.push(itemAjustado);
        }
      }

      // 3) actualizar costeo de items
      if (presupuesto && contratoMarcoPresupuesto.presupuestoId) {
        await this.presupuestoService.actualizarItemsPresupuesto(
          contratoMarcoPresupuesto.presupuestoId,
          itemsCalculados,
          presupuesto,
        );
      }

      // 4) sincronizar procesos de producción
      await this.sincronizarServiciosDeProduccion(
        contratoMarcoPresupuesto.presupuestoId,
        servicios,
      );

      // 5) devolver entidad actualizada
      const actualizado = await this.contratoMarcoPresupuestoRepository.findOne({
        where: { id },
        relations: {
          contratoMarco: { cliente: true },
          presupuesto: {
            items: { contratoMarcoPresupuestoItems: true },
          },
        },
      });

      return {
        ...actualizado,
        servicios,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  // ===== Delete =====
  async remove(id: number) {
    const entidad = await this.findOne(id);
    await this.contratoMarcoPresupuestoRepository.delete({ id });
    return entidad;
  }

  async updateByPresupuestoId(
    presupuestoId: number,
    dto: UpdateContratoMarcoPresupuestoDto,
  ) {
    const orden = await this.contratoMarcoPresupuestoRepository.findOne({
      where: { presupuestoId },
    });
    if (!orden) return;
    return this.contratoMarcoPresupuestoRepository.update(orden.id, dto);
  }

  // ===== Eventos =====
  @OnEvent(PRESUPUESTO.CERTIFICADO_CARGADO, { async: true })
  async handlePresupuestoCertificadoCargado(payload: any) {
    await this.actualizarEstadoPorPresupuestoId(payload.id, 'finalizado');
  }

  @OnEvent(PRESUPUESTO.ENTREGA_CONFIRMADA, { async: true })
  async handlePresupuestoEntregaConfirmada(payload: any) {

    await this.actualizarEstadoPorPresupuestoId(payload.id, 'valorizacion');
  }

  @OnEvent(PRESUPUESTO.SERVICIO_VERIFICADO, { async: true })
  async handlePresupuestoServicioVerificado(payload: any) {
    await this.actualizarEstadoPorPresupuestoId(payload.id, 'servicio');
  }
}

// ===== Utilidad fuera de la clase (sin cambios de firma, solo nombres claros en comentarios) =====
const mergeTrabajos = (acumulado: any[] = [], actuales: any[] = []) => {
  const claveTrabajo = (t: any) => (t?.trabajoId ?? t?.id);

  const mergeArraysPorId = (arrA: any[] = [], arrB: any[] = []) => {
    // 🔑 ahora usamos inventarioId como clave principal
    const key = (x: any) =>
      x?.inventarioId ?? x?.id ?? x?.trabajoId ?? JSON.stringify(x);

    const mapa = new Map(arrA.map(x => [key(x), { ...x }]));

    for (const elemento of arrB) {
      const k = key(elemento);
      const previo = mapa.get(k);

      if (previo) {
        // caso especial: materiales con inventarioId
        if (elemento.inventarioId) {
          previo.cantidad = (previo.cantidad ?? 0) + (elemento.cantidad ?? 0);
          // mantenemos el punit del previo (no lo sumamos)
          previo.punit = previo.punit ?? elemento.punit;
          // recalculamos el importe
          previo.importe = (previo.cantidad ?? 0) * (previo.punit ?? 0);
          continue;
        }

        // comportamiento genérico (servicios u otros)
        for (const [propiedad, valor] of Object.entries(elemento)) {
          if (propiedad === 'id' || propiedad === 'trabajoId') continue;
          if (typeof valor === 'number') {
            (previo as any)[propiedad] = ((previo as any)[propiedad] ?? 0) + valor;
          } else if (Array.isArray(valor)) {
            (previo as any)[propiedad] = mergeArraysPorId((previo as any)[propiedad] ?? [], valor);
          } else if (valor && typeof valor === 'object') {
            (previo as any)[propiedad] = { ...(previo as any)[propiedad], ...valor };
          } else if ((previo as any)[propiedad] == null) {
            (previo as any)[propiedad] = valor;
          }
        }
      } else {
        mapa.set(k, { ...elemento });
      }
    }
    return Array.from(mapa.values());
  };

  const mapa = new Map(acumulado.map(t => [claveTrabajo(t), { ...t }]));

  for (const trabajo of actuales) {
    const k = claveTrabajo(trabajo);
    const previo = mapa.get(k);
    if (previo) {
      for (const [propiedad, valor] of Object.entries(trabajo)) {
        if (propiedad === 'id' || propiedad === 'trabajoId') continue;
        if (Array.isArray(valor)) {
          (previo as any)[propiedad] = mergeArraysPorId((previo as any)[propiedad] ?? [], valor);
        } else if (typeof valor === 'number') {
          (previo as any)[propiedad] = ((previo as any)[propiedad] ?? 0) + valor;
        } else if (valor && typeof valor === 'object') {
          (previo as any)[propiedad] = { ...(previo as any)[propiedad], ...valor };
        } else if ((previo as any)[propiedad] == null) {
          (previo as any)[propiedad] = valor;
        }
      }
    } else {
      mapa.set(k, { ...trabajo });
    }
  }

  return Array.from(mapa.values());
};

