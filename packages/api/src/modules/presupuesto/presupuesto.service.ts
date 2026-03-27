import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository, SelectQueryBuilder, In, Brackets } from 'typeorm';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { UpdateFechaDto } from './dto/update-fecha.dto';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { PresupuestoItem } from '@/modules/presupuesto-item/entities/presupuesto-item.entity';
import { PresupuestoManoDeObra } from '@/modules/presupuesto-mano-de-obra/entities/presupuesto-mano-de-obra.entity';
import { PresupuestoMateriales } from '@/modules/presupuesto-materiales/entities/presupuesto-materiale.entity';
import { PresupuestoSuministro } from '@/modules/presupuesto-suministros/entities/presupuesto-suministro.entity';
import { PresupuestoProduccion } from '@/modules/presupuesto-produccion/entities/presupuesto-produccion.entity';
import { PresupuestoItemTrabajo } from '@/modules/presupuesto-item/entities/presupuesto-item-trabajo.entity';
import { ProduccionTrabajosService } from '@/modules/produccion-trabajos/produccion-trabajos.service';
import { UpdatePresupuestoItemDto } from '@/modules/presupuesto-item/dto/update-presupuesto-item.dto'
import { hasAccess } from '@/helpers/role-access.helper';
import { ROLE_ADMIN, ROLE_ALMACEN, ROLE_COSTEO, ROLE_FACTURACION, ROLE_VENDEDOR, ROLE_DISENADOR, ROLE_COSTEO_COMERCIAL, ROLE_PRODUCCION, ROLE_ADMIN_VENTAS, ROLE_SERVICIO } from '@/constants/roles';
import { getUser } from '@/helpers/get-user';
import { RecetaService } from '@/modules/receta/receta.service'
import { PresupuestoLeidoService } from '@/modules/presupuesto-leido/presupuesto-leido.service'
import { PROCESO_GENERAL } from '@/constants/proceso-general'
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { formatDate, getToday, getTodayDateTime } from '@/helpers/date';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';
import { InventarioReserva } from '../inventario-reservas/entities/inventario-reserva.entity';
import { InventarioService } from '../inventario/inventario.service';
import { MensajeService } from '../mensaje/mensaje.service';
import { USER_SYSTEM_ID, USER_SYSTEM_NAME } from '@/constants/sistema';
import { NotificacionService } from '../notificacion/notificacion.service';
import { TIPO_NOTIFICACION } from '@/constants/notificaciones';
import { UsuarioService } from '../auth/usuario/usuario.service';
import { COMISIONES } from '@/constants/presupuesto';
import { ContratoMarcoPresupuestoService } from '../contrato-marco-presupuesto/contrato-marco-presupuesto.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PRESUPUESTO, FACTURACION, COBROS } from '@/constants/eventos';
import { PERMISOS } from '@/constants/permisos';
import { hasPermission } from '@/helpers/has-permissions.helper';
import { PermissionsService } from '@/modules/auth/permissions/permissions.service';
import { RoleProcesoGeneralService } from '@/modules/role-proceso-general/role-proceso-general.service';
import { Cobro } from '../cobro/entities/cobro.entity';
import { Factura } from '../factura/entities/factura.entity';
@Injectable()
export class PresupuestoService {
  constructor(
    @InjectRepository(Presupuesto)
    private presupuestoRepository: Repository<Presupuesto>,
    @InjectRepository(PresupuestoItem)
    private presupuestoItemRepository: Repository<PresupuestoItem>,
    @InjectRepository(PresupuestoManoDeObra)
    private presupuestoManoDeObraRepository: Repository<PresupuestoManoDeObra>,
    @InjectRepository(PresupuestoMateriales)
    private presupuestoMaterialesRepository: Repository<PresupuestoMateriales>,
    @InjectRepository(PresupuestoSuministro)
    private presupuestoSuministroRepository: Repository<PresupuestoSuministro>,
    private readonly produccionTrabajosService: ProduccionTrabajosService,
    private readonly recetaService: RecetaService, // Inyección del nuevo servicio
    private readonly presupuestoLeidoService: PresupuestoLeidoService,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(PresupuestoProduccion)
    private presupuestoProduccionRepository: Repository<PresupuestoProduccion>,
    @InjectRepository(InventarioReserva)
    private inventarioReservaRepository: Repository<InventarioReserva>,
    @InjectRepository(PresupuestoItemTrabajo)
    private presupuestoItemTrabajoRepository: Repository<PresupuestoItemTrabajo>,
    private movimientoInventarioService: MovimientoInventarioService,
    private readonly inventarioService: InventarioService,
    private readonly mensajeService: MensajeService,
    private readonly notificacionService: NotificacionService,
    private readonly usuarioService: UsuarioService,
    private readonly contratoMarcoPresupuestoService: ContratoMarcoPresupuestoService,
    private eventEmitter: EventEmitter2,
    private readonly permissionsService: PermissionsService,
    private readonly roleProcesoGeneralService: RoleProcesoGeneralService,

  ) { }

  async create(createPresupuestoDto: CreatePresupuestoDto) {
    const { items, ...presupuestoData } = createPresupuestoDto;
    const presupuesto = await this.presupuestoRepository.save(
      this.presupuestoRepository.create({
        ...presupuestoData,
        disenoEstatus: createPresupuestoDto.disenoSolicitar ? 'pendiente' : "",
        costeoEstatus: createPresupuestoDto.procesoGeneralId === PROCESO_GENERAL.EN_MANTENIMIENTO ? 'completo' : (createPresupuestoDto.procesoGeneralId === PROCESO_GENERAL.COSTEO_TECNICO ? 'pendiente' : ""),
        costeoComercialEstatus: createPresupuestoDto.procesoGeneralId === PROCESO_GENERAL.EN_MANTENIMIENTO ? 'completo' : (createPresupuestoDto.procesoGeneralId === PROCESO_GENERAL.COSTEO_COMERCIAL ? 'pendiente' : ""),
      }),
    );
    // await this.guardarItems(createPresupuestoDto.items, presupuesto.id);

    await this.guardarOActualizarItems(presupuesto.id, items, presupuesto);
    return this.findOne(presupuesto.id);
  }

  private async guardarItems(items, presupuestoId: number) {
    for (const item of items) {
      await this.presupuestoItemRepository.save(this.presupuestoItemRepository.create({ ...item, presupuestoId }));
    }
  }


  async findAll(conditions: FindManyOptions<Presupuesto>): Promise<Presupuesto[]> {
    const qb = this.presupuestoRepository.createQueryBuilder('presupuesto');

    const relaciones = ['cliente', 'vendedor', 'procesoGeneral', 'area', 'producciones', 'items'];

    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`presupuesto.${relation}`, relation.split('.').pop());
    }

    buildWhereAndOrderQuery(qb, conditions);
    await this.aplicarCondicionesPorPermisos(qb);
    const presupuestos = await qb.getMany();
    if (presupuestos.length > 0) {
      const lecturas = await this.presupuestoLeidoService.verificarLecturasUsuario(
        presupuestos.map(p => p.id)
      );

      presupuestos.forEach(p => {
        (p as any).presupuestoLeido = lecturas.get(p.id) || false;

        // if (p.producciones && p.producciones.length > 0) {
        //   const completadas = p.producciones.filter(prod => prod.fechaTerminado !== null).length;
        //   (p as any).produccionesPorcentaje = Math.round((completadas / p.producciones.length) * 100);
        // } else {
        //   (p as any).produccionesPorcentaje = 0;
        // }
      });
    }

    return presupuestos;
  }

  async listar(conditions: FindManyOptions<Presupuesto>): Promise<Presupuesto[]> {
    const qb = this.presupuestoRepository.createQueryBuilder('presupuesto');

    const relaciones = ['cliente', 'vendedor', 'procesoGeneral', 'area', 'producciones'];

    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`presupuesto.${relation}`, relation.split('.').pop());
    }

    buildWhereAndOrderQuery(qb, conditions);
    const presupuestos = await qb.getMany();

    return presupuestos;
  }

  private obtenerRelacionesPresupuesto() {
    return {
      cliente: true,
      area: true,
      vendedor: true,
      procesoGeneral: true,
      producciones: true,
      alquilerRecurso: true,
    };
  }

  async findOne(id: number) {
    const presupuesto = await this.presupuestoRepository.findOne({
      where: { id },
      relations: this.obtenerRelacionesPresupuesto(),
    });

    if (!presupuesto) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    const items = await this.obtenerItemsPresupuesto(id);
    const presupuestoLeido = await this.presupuestoLeidoService.verificarLecturaUsuario(id);

    // Obtener archivos para cada ítem
    const itemsConArchivos = await Promise.all(
      items.map(async (item) => {
        const archivo = await this.archivoRepository.findOne({
          where: {
            modelo: 'presupuesto_item',
            modeloId: item.id,
            tipo: null // Como especificaste
          },
          order: {
            id: 'DESC'
          }
        });
        return {
          ...item,
          archivo: archivo || null,
          archivos: []
        };
      })
    );

    return {
      ...presupuesto,
      items: itemsConArchivos,
      presupuestoLeido
    };
  }

  private async obtenerItemsPresupuesto(id: number) {
    const items = await this.presupuestoItemRepository.find({
      where: { presupuestoId: id }, relations: {
        receta: true
      }
    });
    for (const item of items) {
      item.produccionTrabajos = await this.produccionTrabajosService.initProduccionTrabajos();
      item.receta = await this.recetaService.findOne(item.recetaId);

      const trabajosSeleccionados = await this.presupuestoItemTrabajoRepository.find({
        where: { presupuestoItemId: item.id },
      });
      (item as any).trabajosSeleccionados = trabajosSeleccionados.map(t => t.trabajoId);

      await this.cargarDetallesItem(item);
    }
    return items;
  }

  private async cargarDetallesItem(item: PresupuestoItem) {
    const [materiales, suministros, manoDeObra] = await Promise.all([
      this.presupuestoMaterialesRepository.find({ where: { presupuestoItemId: item.id }, relations: { inventario: { reservas: true }, trabajo: true, inventarioConversion: true }, withDeleted: true }),
      this.presupuestoSuministroRepository.find({ where: { presupuestoItemId: item.id }, relations: { inventario: { reservas: true }, trabajo: true, inventarioConversion: true }, withDeleted: true }),
      this.presupuestoManoDeObraRepository.find({ where: { presupuestoItemId: item.id }, relations: { inventario: { reservas: true }, trabajo: true, inventarioConversion: true }, withDeleted: true }),
    ]);

    item.materiales = materiales
    item.suministros = suministros
    item.manoDeObra = manoDeObra

    for (const trabajo of item.produccionTrabajos.producto.concat(item.produccionTrabajos.servicio)) {
      this.agregarDetallesTrabajo(trabajo, materiales, suministros, manoDeObra);
    }
  }

  private agregarDetallesTrabajo(trabajo, materiales, suministros, manoDeObra) {
    if (!trabajo.materiales) trabajo.materiales = [];
    if (!trabajo.suministros) trabajo.suministros = [];
    if (!trabajo.manoDeObra) trabajo.manoDeObra = [];

    trabajo.materiales.push(...this.mapearMateriales(materiales, trabajo));
    trabajo.suministros.push(...this.mapearSuministros(suministros, trabajo));
    trabajo.manoDeObra.push(...this.mapearManoDeObra(manoDeObra, trabajo));
  }

  private mapearItems(items, trabajo) {
    return items.filter(item => item.trabajo?.id === trabajo.id).map(item => ({
      cantidad: item.cantidad,
      inventario: item.inventario,
      inventarioId: item.inventario?.id ?? null,
      id: item.id,
      punit: item.punit,
      importe: item.importe,
      concepto: item.concepto,
      inventarioConversion: item.inventarioConversion,
      inventarioConversionId: item.inventarioConversionId

    }));
  }

  private mapearMateriales(materiales, trabajo) {
    return this.mapearItems(materiales, trabajo);
  }

  private mapearSuministros(suministros, trabajo) {
    return this.mapearItems(suministros, trabajo);
  }

  private mapearManoDeObra(manoDeObra, trabajo) {
    return this.mapearItems(manoDeObra, trabajo);
  }

  async verificarAlmacen(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
    const presupuesto = await this.findOne(id);

    // Verificar stock disponible antes de reservar
    const productosSinStock = await this.verificarStockDisponible(presupuesto);

    // Si ignorarStock es false y hay productos sin stock, retornar error con detalle
    if (!updatePresupuestoDto.ignorarStock && productosSinStock.length > 0) {
      return {
        success: false,
        productosSinStock,
      };
    }

    // TODO: VER
    await this.actualizarPresupuesto(id, updatePresupuestoDto);
    await this.movimientoInventarioService.reservarStockDePresupuesto(presupuesto);

    return {
      success: true,
      productosSinStock: [],
    };
  }

  /**
   * Verifica si hay stock disponible para todos los productos del presupuesto
   * Consolida TODOS los productos del presupuesto (sin importar trabajo ni item)
   * Retorna información detallada: stock actual, reservado, disponible y faltante
   */
  private async verificarStockDisponible(presupuesto: any) {
    // Consolidar TODOS los productos del presupuesto usando Map para agrupar por productoId
    const productosConsolidados = new Map<number, {
      productoId: number;
      productoNombre: string;
      cantidadTotal: number;
    }>();

    // Recorrer todos los items del presupuesto
    for (const item of presupuesto.items) {
      // Procesar materiales y suministros de todos los trabajos (producto + servicio)
      for (const trabajo of item.produccionTrabajos.producto.concat(item.produccionTrabajos.servicio)) {
        // Procesar materiales
        for (const material of trabajo.materiales || []) {
          if (material.inventarioId) {
            const existing = productosConsolidados.get(material.inventarioId);

            if (existing) {
              // Sumar al existente
              existing.cantidadTotal += Number(material.cantidad);
            } else {
              // Crear nuevo
              productosConsolidados.set(material.inventarioId, {
                productoId: material.inventarioId,
                productoNombre: material.inventario?.nombre || 'Sin nombre',
                cantidadTotal: Number(material.cantidad),
              });
            }
          }
        }

        // Procesar suministros
        for (const suministro of trabajo.suministros || []) {
          if (suministro.inventarioId) {
            const existing = productosConsolidados.get(suministro.inventarioId);

            if (existing) {
              // Sumar al existente
              existing.cantidadTotal += Number(suministro.cantidad);
            } else {
              // Crear nuevo
              productosConsolidados.set(suministro.inventarioId, {
                productoId: suministro.inventarioId,
                productoNombre: suministro.inventario?.nombre || 'Sin nombre',
                cantidadTotal: Number(suministro.cantidad),
              });
            }
          }
        }
      }
    }

    // Preparar items consolidados para validar
    const itemsParaValidar = Array.from(productosConsolidados.values()).map(p => ({
      productoId: p.productoId,
      cantidad: p.cantidadTotal,
    }));

    // Validar stock disponible usando el servicio de inventario
    const validaciones = await this.inventarioService.validarDisponibilidadConReservas(itemsParaValidar);

    // Filtrar y mapear solo los productos sin stock suficiente
    const productosSinStock = validaciones
      .filter(validacion => !validacion.disponible)
      .map(validacion => {
        const producto = productosConsolidados.get(validacion.productoId);

        return {
          productoId: validacion.productoId,
          productoNombre: validacion.nombre || producto?.productoNombre || 'Sin nombre',
          cantidadNecesaria: validacion.cantidadSolicitada,
          stockActual: validacion.stockActual,
          stockReservado: validacion.stockReservado,
          stockDisponible: validacion.stockDisponible,
          faltante: Math.max(0, validacion.cantidadSolicitada - validacion.stockDisponible),
        };
      });

    return productosSinStock;
  }

  async verificarServicio(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
    updatePresupuestoDto.procesoGeneralId = PROCESO_GENERAL.EN_SERVICIO
    await this.actualizarPresupuesto(id, updatePresupuestoDto);
    const presupuesto = await this.findOne(id);


    this.eventEmitter.emit(
      PRESUPUESTO.SERVICIO_VERIFICADO,
      {
        id
      }
    );
    return presupuesto;
  }



  async confirmarEntrega(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {

    updatePresupuestoDto.procesoGeneralId = PROCESO_GENERAL.ENTREGADO
    await this.actualizarPresupuesto(id, updatePresupuestoDto);
    // const presupuesto = await this.findOne(id);
    // await this.movimientoInventarioService.reservarStockDePresupuesto(presupuesto)

    this.eventEmitter.emit(
      PRESUPUESTO.ENTREGA_CONFIRMADA,
      {
        id
      }
    );
    // return presupuesto;
  }

  async certificar(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {

    updatePresupuestoDto.procesoGeneralId = PROCESO_GENERAL.FACTURACION_HABILITADA
    await this.actualizarPresupuesto(id, updatePresupuestoDto);
    // const presupuesto = await this.findOne(id);
    // await this.movimientoInventarioService.reservarStockDePresupuesto(presupuesto)

    this.eventEmitter.emit(
      PRESUPUESTO.CERTIFICADO_CARGADO,
      {
        id
      }
    );
    // return presupuesto;
  }



  async registrarFecha(id: number, updateFechaDto: UpdateFechaDto) {
    const { observaciones, vendedorId, ...presupuestoData } = updateFechaDto
    const fechaEntregaEstimada = presupuestoData.fechaEntregaEstimada
    const fechaFabricacionEstimada = presupuestoData.fechaFabricacionEstimada
    const tipoFecha = fechaEntregaEstimada ? 'entrega' : 'fabricación';
    const fecha = fechaEntregaEstimada || fechaFabricacionEstimada;

    const user = getUser()
    await this.mensajeService.create({
      tipo: 'presupuesto',
      usuarioOrigenId: USER_SYSTEM_ID,
      usuarioOrigenNombre: USER_SYSTEM_NAME,
      mensaje: `El usuario ${user.nombre} modificó la fecha de ${tipoFecha} a ${formatDate(fecha)} por el siguiente motivo: ${observaciones}`,
      tipoId: id
    })

    const rolesNotificacion = [
      ROLE_ADMIN,
      ...(fechaFabricacionEstimada ? [ROLE_PRODUCCION] : []),
      ...(fechaEntregaEstimada ? [ROLE_ADMIN_VENTAS, ROLE_COSTEO_COMERCIAL, ROLE_PRODUCCION] : [])

    ];

    await this.notificacionService.notificarPorRoles(
      rolesNotificacion,
      {
        tipoUsuario: 0,
        tipoNotificacion: TIPO_NOTIFICACION.PRESUPUESTO_FECHA,
        usuarioOrigenId: USER_SYSTEM_ID,
        tipo: TIPO_NOTIFICACION.PRESUPUESTO,
        fecha: getTodayDateTime(),
        tipoId: id,
        nota: `Se modificó la fecha de ${tipoFecha} en el presupuesto (#${id})`
      }
    )
    if (vendedorId) {
      await this.notificacionService.notificarAUsuario(vendedorId, {
        tipoUsuario: 0,
        tipoNotificacion: TIPO_NOTIFICACION.PRESUPUESTO_FECHA,
        usuarioOrigenId: USER_SYSTEM_ID,
        tipo: TIPO_NOTIFICACION.PRESUPUESTO,
        fecha: getTodayDateTime(),
        tipoId: id,
        nota: `Se modificó la fecha de ${tipoFecha} en el presupuesto (#${id})`

      });
    }

    await this.actualizarPresupuesto(id, presupuestoData)
    const presupuesto = await this.findOne(id)
    this.eventEmitter.emit(PRESUPUESTO.FECHA_ENTREGA_ESTIMADA, presupuesto)
  }



  async update(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
    const {
      procesoGeneral,
      items,
      ...presupuestoData } = updatePresupuestoDto;
    await this.manejarProcesoGeneral(presupuestoData);
    await this.actualizarPresupuesto(id, presupuestoData);
    // TODO: Mejorar esto

    if (items) {
      await this.actualizarItems(id, items, presupuestoData);
    }
    return await this.findOne(id);
  }

  private async manejarProcesoGeneral(presupuestoData: Partial<Presupuesto>) {

    const presupuesto = await this.findOne(presupuestoData.id);

    if (presupuestoData.procesoGeneralId === PROCESO_GENERAL.COSTEO_TECNICO) {
      presupuestoData.costeoEstatus = 'pendiente';
      presupuestoData.costeoComercialEstatus = 'pendiente';
    } else if (presupuestoData.procesoGeneralId === PROCESO_GENERAL.COSTEO_COMERCIAL) {
      presupuestoData.costeoComercialEstatus = 'pendiente';
    } else if (presupuestoData.procesoGeneralId === PROCESO_GENERAL.ENVIADO_A_PRODUCCION && !presupuesto.fechaRecepcionAlmacen) {
      presupuestoData.fechaRecepcionAlmacen = getToday();
    } else if (presupuestoData.procesoGeneralId === PROCESO_GENERAL.TRABAJO_TERMINADO) {
      presupuestoData.produccionEstatus = 'completo';
    } else if (presupuestoData.procesoGeneralId === PROCESO_GENERAL.EN_MANTENIMIENTO) {
      presupuestoData.produccionEstatus = 'pendiente';
    } else if
      (
      presupuestoData.procesoGeneralId === PROCESO_GENERAL.ENVIADO_A_PRODUCCION ||
      presupuestoData.procesoGeneralId === PROCESO_GENERAL.EN_PRODUCCION ||
      presupuestoData.procesoGeneralId === PROCESO_GENERAL.EN_SERVICIO ||
      presupuestoData.procesoGeneralId === PROCESO_GENERAL.ENVIADO_A_SERVICIO
    ) {
      presupuestoData.produccionEstatus = 'pendiente';

    }
    if (!presupuesto.fechaEntregado && presupuestoData.procesoGeneralId === PROCESO_GENERAL.ENTREGADO) {
      presupuestoData.fechaEntregado = getToday();
    }

  }
  private async actualizarPresupuesto(id: number, presupuestoData: Partial<Presupuesto>) {
    await this.presupuestoRepository.save({ id, ...presupuestoData });
  }

  private async actualizarItems(presupuestoId: number, items: UpdatePresupuestoItemDto[] = [], presupuesto: any) {
    const existingItems = await this.presupuestoItemRepository.find({ where: { presupuestoId } });

    if (items.length > 0) {
      await this.guardarOActualizarItems(presupuestoId, items, presupuesto);
      await this.eliminarItemsNoEnviados(existingItems, items);
    } else {
      await this.presupuestoItemRepository.delete({ presupuestoId });
    }
  }
  private calcularCostosPorTrabajo(produccionTrabajos): { materialesCosto: number, suministrosCosto: number, manoDeObraCosto: number } {
    let materialesCosto = 0;
    let suministrosCosto = 0;
    let manoDeObraCosto = 0;

    if (produccionTrabajos) {
      const trabajos = [
        ...(produccionTrabajos.producto || []),
        ...(produccionTrabajos.servicio || []),
        ...(produccionTrabajos.mantenimiento || []),
      ];

      for (const trabajo of trabajos) {
        materialesCosto += (trabajo.materiales || []).reduce(
          (sum, m) => sum + (Number(m.importe)),
          0,
        );
        suministrosCosto += (trabajo.suministros || []).reduce(
          (sum, s) => sum + (Number(s.importe)),
          0,
        );
        manoDeObraCosto += (trabajo.manoDeObra || []).reduce(
          (sum, mo) => sum + (Number(mo.importe)),
          0,
        );
      }

    }

    return { materialesCosto, suministrosCosto, manoDeObraCosto };
  }


  async guardarOActualizarItems(
    presupuestoId: number,
    items: UpdatePresupuestoItemDto[],
    presupuesto: Presupuesto
  ) {
    const resumen = await this.actualizarItemsPresupuesto(presupuestoId, items, presupuesto);
    await this.actualizarPresupuestoProduccion(items as PresupuestoItem[], presupuestoId);
    return resumen;
  }
  // Este método será responsable de cargar los trabajos en el ítem nuevo o actualizado.
  async guardarTrabajosEnItem(itemId: number, produccionTrabajos) {
    // Cargar trabajos existentes
    const trabajosExistentes = await this.cargarTrabajosExistentes(itemId);
    // Guardar y comparar trabajos
    console.log({ trabajosExistentes })
    for (const trabajo of (produccionTrabajos.producto || []).concat(produccionTrabajos.servicio || [])) {
      // Comparar y decidir si es necesario crear, actualizar o eliminar
      await this.guardarMaterialesEnTrabajo(itemId, trabajo.materiales, trabajo.id, trabajosExistentes.materiales);
      await this.guardarSuministrosEnTrabajo(itemId, trabajo.suministros, trabajo.id, trabajosExistentes.suministros);
      await this.guardarManoDeObraEnTrabajo(itemId, trabajo.manoDeObra, trabajo.id, trabajosExistentes.manoDeObra);
    }

    // Eliminar trabajos que ya no existen
    await this.eliminarTrabajosNoExistentes(itemId, trabajosExistentes, produccionTrabajos);

    if (produccionTrabajos.trabajosSeleccionados !== undefined) {
      await this.presupuestoItemTrabajoRepository.delete({ presupuestoItemId: itemId });
      for (const trabajoId of produccionTrabajos.trabajosSeleccionados) {
        await this.presupuestoItemTrabajoRepository.save({ presupuestoItemId: itemId, trabajoId });
      }
    }
  }

  private async actualizarPresupuestoProduccion(items: PresupuestoItem[], presupuestoId: number) {
    // 1. Obtener todos los registros existentes para este presupuesto
    const produccionExistente = await this.presupuestoProduccionRepository.find({
      where: { presupuestoId },
    });

    // 2. Procesar y consolidar trabajos (tu lógica actual)
    const trabajosAgrupados = items.reduce((acumulador, item) => {
      if (item.produccionTrabajos) {
        const trabajosItem = [
          ...(item.produccionTrabajos.producto || []),
          ...(item.produccionTrabajos.servicio || []),
          ...(item.produccionTrabajos.mantenimiento || []),
        ];

        trabajosItem.forEach((trabajo) => {
          if (!acumulador[trabajo.id]) {
            acumulador[trabajo.id] = {
              ...trabajo,
              suministros: [...(trabajo.suministros || [])],
              manoDeObra: [...(trabajo.manoDeObra || [])],
              materiales: [...(trabajo.materiales || [])],
            };
          } else {
            acumulador[trabajo.id].suministros.push(...(trabajo.suministros || []));
            acumulador[trabajo.id].manoDeObra.push(...(trabajo.manoDeObra || []));
            acumulador[trabajo.id].materiales.push(...(trabajo.materiales || []));
          }
        });
      }
      return acumulador;
    }, {} as Record<number, any>);

    const trabajosConsolidados = Object.values(trabajosAgrupados);
    const trabajosAProcesarIds = new Set<number>();

    const itemsDelPresupuesto = await this.presupuestoItemRepository.find({ where: { presupuestoId } });
    const itemIds = itemsDelPresupuesto.map(i => i.id);
    const trabajosExplicitosRegistros = itemIds.length > 0
      ? await this.presupuestoItemTrabajoRepository.find({ where: { presupuestoItemId: In(itemIds) } })
      : [];
    const idsSeleccionadosExplicitos = new Set<number>(trabajosExplicitosRegistros.map(r => r.trabajoId));

    // 3. Procesar trabajos consolidados y recolectar IDs válidos
    for (const trabajo of trabajosConsolidados) {
      const tieneElementos =
        trabajo.manoDeObra?.length > 0 ||
        trabajo.suministros?.length > 0 ||
        trabajo.materiales?.length > 0;

      const estaSeleccionado = idsSeleccionadosExplicitos.has(trabajo.id);

      if (!tieneElementos && !estaSeleccionado) {
        continue;
      }
      trabajosAProcesarIds.add(trabajo.id); // Registrar ID válido

      const existeProduccion = await this.presupuestoProduccionRepository.findOne({
        where: { presupuestoId, trabajoId: trabajo.id },
      });

      if (!existeProduccion) {
        const nuevaProduccion = this.presupuestoProduccionRepository.create({
          presupuestoId,
          trabajoId: trabajo.id,
        });
        await this.presupuestoProduccionRepository.save(nuevaProduccion);
      }
    }

    // 3b. Procesar trabajos seleccionados explícitamente que no tienen inventario
    for (const trabajoId of idsSeleccionadosExplicitos) {
      if (trabajosAProcesarIds.has(trabajoId)) continue;
      trabajosAProcesarIds.add(trabajoId);
      const existeProduccion = await this.presupuestoProduccionRepository.findOne({
        where: { presupuestoId, trabajoId },
      });
      if (!existeProduccion) {
        await this.presupuestoProduccionRepository.save(
          this.presupuestoProduccionRepository.create({ presupuestoId, trabajoId })
        );
      }
    }

    // 4. Eliminar registros existentes que no están en trabajosAProcesarIds
    const idsParaEliminar = produccionExistente
      .filter((item) => !trabajosAProcesarIds.has(item.trabajoId))
      .map((item) => item.id);

    if (idsParaEliminar.length > 0) {
      await this.presupuestoProduccionRepository.delete(idsParaEliminar);

    }
    const produccionesActuales = await this.presupuestoProduccionRepository.find({
      where: { presupuestoId },
    });

    const totalTrabajos = produccionesActuales.length;
    const trabajosTerminados = produccionesActuales.filter(p => p.terminado).length;
    const nuevoProgreso = totalTrabajos > 0
      ? Math.round((trabajosTerminados / totalTrabajos) * 100)
      : 0;

    await this.presupuestoRepository.save({
      id: presupuestoId,
      progreso: nuevoProgreso
    });
  }

  // Cargar trabajos existentes asociados al ítem
  private async cargarTrabajosExistentes(itemId: number) {
    const materiales = await this.presupuestoMaterialesRepository.find({ where: { presupuestoItemId: itemId } });
    const suministros = await this.presupuestoSuministroRepository.find({ where: { presupuestoItemId: itemId } });
    const manoDeObra = await this.presupuestoManoDeObraRepository.find({ where: { presupuestoItemId: itemId } });
    return {
      materiales,
      suministros,
      manoDeObra
    };
  }

  // Eliminar los trabajos que ya no existen
  private async eliminarTrabajosNoExistentes(itemId: number, trabajosExistentes, trabajosNuevos) {

    const nuevosMateriales = (trabajosNuevos.producto || []).flatMap(p => p.materiales || [])
      .concat((trabajosNuevos.servicio || []).flatMap(s => s.materiales || []));
    const nuevosSuministros = (trabajosNuevos.producto || []).flatMap(p => p.suministros || [])
      .concat((trabajosNuevos.servicio || []).flatMap(s => s.suministros || []));
    const nuevaManoDeObra = (trabajosNuevos.producto || []).flatMap(p => p.manoDeObra || [])
      .concat((trabajosNuevos.servicio || []).flatMap(s => s.manoDeObra || []));

    const trabajosACerrar = [
      { lista: trabajosExistentes.materiales, nuevos: nuevosMateriales, repo: this.presupuestoMaterialesRepository },
      { lista: trabajosExistentes.suministros, nuevos: nuevosSuministros, repo: this.presupuestoSuministroRepository },
      { lista: trabajosExistentes.manoDeObra, nuevos: nuevaManoDeObra, repo: this.presupuestoManoDeObraRepository },
    ];


    for (const { lista, nuevos, repo } of trabajosACerrar) {
      // Filtrar los trabajos existentes que no están en los nuevos datos
      const trabajosAEliminar = lista.filter(trabajoExistente => {
        // Verificar si el trabajo no está presente en los nuevos datos
        return !nuevos.some(trabajoNuevo => trabajoNuevo.id === trabajoExistente.id);
      });

      // Eliminar los trabajos que no están en los nuevos datos
      for (const trabajoAEliminar of trabajosAEliminar) {
        //TODO: Colocar un softdelete pero verificar implicaciones
        await repo.delete(trabajoAEliminar.id);
      }
    }
  }

  // Guardar los materiales relacionados al trabajo
  private async guardarMaterialesEnTrabajo(itemId: number, materiales, trabajoId: number, trabajosExistentes) {


    for (const material of materiales) {
      if (material.id) {
        // Si ya tiene un id, lo actualizamos
        const materialExistente = trabajosExistentes.find(m => m.id === material.id);
        if (materialExistente) {
          await this.presupuestoMaterialesRepository.update(material.id, {
            cantidad: material.cantidad,
            punit: material.punit,
            importe: Number(material.punit) * Number(material.cantidad),
            inventarioId: material.inventarioId,
            concepto: material.concepto,
            inventarioConversionId: material.inventarioConversionId
          });
        }
      } else {
        // Si no tiene id, lo creamos

        const materialNuevo = this.presupuestoMaterialesRepository.create({
          presupuestoItemId: itemId,
          cantidad: material.cantidad,
          inventarioId: material.inventarioId,
          trabajoId,
          punit: material.punit,
          importe: Number(material.punit) * Number(material.cantidad),
          concepto: material.concepto,
          inventarioConversionId: material.inventarioConversionId
        });
        await this.presupuestoMaterialesRepository.save(materialNuevo);
      }
    }
  }

  // Guardar los suministros relacionados al trabajo
  private async guardarSuministrosEnTrabajo(itemId: number, suministros, trabajoId: number, trabajosExistentes) {
    for (const suministro of suministros) {
      if (suministro.id) {
        // Si ya tiene un id, lo actualizamos
        const suministroExistente = trabajosExistentes.find(s => s.id === suministro.id);

        if (suministroExistente) {
          await this.presupuestoSuministroRepository.update(suministro.id, {
            cantidad: suministro.cantidad,
            punit: suministro.punit,
            importe: Number(suministro.punit) * Number(suministro.cantidad),
            inventarioId: suministro.inventarioId,
            concepto: suministro.concepto,
            inventarioConversionId: suministro.inventarioConversionId
          });
        }
      } else {
        // Si no tiene id, lo creamos

        const suministroNuevo = this.presupuestoSuministroRepository.create({
          presupuestoItemId: itemId,
          cantidad: suministro.cantidad,
          inventarioId: suministro.inventarioId,
          trabajoId,
          punit: suministro.punit,
          importe: Number(suministro.punit) * Number(suministro.cantidad),
          concepto: suministro.concepto,
          inventarioConversionId: suministro.inventarioConversionId

        });
        await this.presupuestoSuministroRepository.save(suministroNuevo);
      }
    }
  }

  // Guardar la mano de obra relacionada al trabajo
  private async guardarManoDeObraEnTrabajo(itemId: number, manoDeObra, trabajoId: number, trabajosExistentes) {
    for (const trabajo of manoDeObra) {
      if (trabajo.id) {
        // Si ya tiene un id, lo actualizamos
        const manoDeObraExistente = trabajosExistentes.find(m => m.id === trabajo.id);

        if (manoDeObraExistente) {

          await this.presupuestoManoDeObraRepository.update(trabajo.id, {
            cantidad: trabajo.cantidad,
            punit: trabajo.punit,
            importe: Number(trabajo.punit) * Number(trabajo.cantidad),
            inventarioId: trabajo.inventarioId,
            concepto: trabajo.concepto,
            inventarioConversionId: trabajo.inventarioConversionId

          });
        }
      } else {
        // Si no tiene id, lo creamos

        const manoDeObraNuevo = this.presupuestoManoDeObraRepository.create({
          presupuestoItemId: itemId,
          cantidad: trabajo.cantidad,
          inventarioId: trabajo.inventarioId,
          trabajoId,
          punit: trabajo.punit,
          importe: Number(trabajo.punit) * Number(trabajo.cantidad),
          concepto: trabajo.concepto,
          inventarioConversionId: trabajo.inventarioConversionId

        });
        await this.presupuestoManoDeObraRepository.save(manoDeObraNuevo);
      }
    }
  }


  private async eliminarItemsNoEnviados(existingItems: PresupuestoItem[], items: UpdatePresupuestoItemDto[]) {

    const itemIdsInRequest = items.map(item => item.id).filter(Boolean); // Excluye `null` o `undefined`
    const itemsToDelete = existingItems.filter(existingItem => !itemIdsInRequest.includes(existingItem.id));

    if (itemsToDelete.length > 0) {
      await this.presupuestoItemRepository.remove(itemsToDelete);
    }
  }



  async remove(id: number) {
    // 1. Obtener todos los items del presupuesto
    // const items = await this.presupuestoItemRepository.find({
    //   where: { presupuestoId: id },
    //   select: ['id']
    // });

    // const itemIds = items.map(item => item.id);

    // // 2. Eliminar registros relacionados en las tablas dependientes
    // await Promise.all([
    //   // Eliminar relaciones de items (si existen items)
    //   ...(itemIds.length > 0 ? [
    //     this.presupuestoManoDeObraRepository.delete({ presupuestoItemId: In(itemIds) }),
    //     this.presupuestoMaterialesRepository.delete({ presupuestoItemId: In(itemIds) }),
    //     this.presupuestoSuministroRepository.delete({ presupuestoItemId: In(itemIds) })
    //   ] : []),

    //   // Eliminar producciones asociadas directamente al presupuesto
    //   this.presupuestoProduccionRepository.delete({ presupuestoId: id })
    // ]);

    // await this.presupuestoLeidoService.remove(id)
    // // 3. Eliminar los items del presupuesto
    // await this.presupuestoItemRepository.delete({ presupuestoId: id });

    // 4. Finalmente eliminar el presupuesto
    const result = await this.presupuestoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Presupuesto con ID #${id} no encontrado`);
    }
  }
  async aplicarCondicionesPorRol(qb: SelectQueryBuilder<Presupuesto>) {
    const user = getUser()


    // Si el usuario tiene acceso como diseñador
    if (hasAccess(ROLE_DISENADOR)) {
      qb.andWhere('presupuesto.diseno_solicitar = :disenoSolicitar', {
        disenoSolicitar: true, // O 1 dependiendo de cómo esté configurado en la base de datos
      });
    }

    if (hasAccess(ROLE_DISENADOR)) {
      qb.andWhere('presupuesto.diseno_solicitar = :disenoSolicitar', {
        disenoSolicitar: true, // O 1 dependiendo de cómo esté configurado en la base de datos
      });
    }

    // Si el usuario tiene acceso como admin
    if (hasAccess(ROLE_COSTEO)) {
      qb.andWhere(
        '(presupuesto.procesoGeneralId = :procesoId OR presupuesto.costeo_estatus = :costeoEstatus)',
        { procesoId: PROCESO_GENERAL.COSTEO_TECNICO, costeoEstatus: 'completo' }
      );
    }

    // Si el usuario tiene acceso como vendedor
    if (hasAccess(ROLE_VENDEDOR)) {

      qb.andWhere('presupuesto.vendedorId = :vendedorId', {
        vendedorId: user.uid,
      });
      // Agrega condiciones específicas para el rol VENDEDOR si es necesario
    }
    // Si el usuario tiene acceso como admin
    if (hasAccess(ROLE_COSTEO_COMERCIAL)) {
      qb.andWhere(
        '(presupuesto.procesoGeneralId = :procesoId OR presupuesto.costeo_comercial_estatus = :costeoComercialEstatus)',
        { procesoId: PROCESO_GENERAL.COSTEO_COMERCIAL, costeoComercialEstatus: 'completo' }
      );
    }
    // Si el usuario tiene acceso como admin
    if (hasAccess(ROLE_PRODUCCION)) {
      const procesosIds = [
        PROCESO_GENERAL.ENVIADO_A_PRODUCCION,
        PROCESO_GENERAL.EN_PRODUCCION,
        PROCESO_GENERAL.ENTREGADO,
        PROCESO_GENERAL.TRABAJO_TERMINADO,
        PROCESO_GENERAL.ENVIADO_A_SERVICIO,
        PROCESO_GENERAL.EN_SERVICIO,
        PROCESO_GENERAL.ENVIADO_A_ALMACEN
      ];
      qb.andWhere(
        '(presupuesto.procesoGeneralId IN (:...procesosIds) OR presupuesto.produccion_estatus = :produccionEstatus)',
        { procesosIds, produccionEstatus: 'completo' }
      );
    }
    // Si el usuario tiene acceso como admin
    if (hasAccess(ROLE_SERVICIO)) {
      const procesosIds = [
        PROCESO_GENERAL.ENVIADO_A_SERVICIO,
        PROCESO_GENERAL.EN_SERVICIO,
        PROCESO_GENERAL.ENTREGADO,
        PROCESO_GENERAL.TRABAJO_TERMINADO,
        PROCESO_GENERAL.ENVIADO_A_PRODUCCION,
        PROCESO_GENERAL.EN_PRODUCCION,
        PROCESO_GENERAL.ENVIADO_A_ALMACEN
      ];
      qb.andWhere(
        '(presupuesto.procesoGeneralId IN (:...procesosIds) OR presupuesto.produccion_estatus = :produccionEstatus)',
        { procesosIds, produccionEstatus: 'completo' }
      );
    }
    if (hasAccess(ROLE_FACTURACION)) {
      const procesosIds = [
        PROCESO_GENERAL.ENTREGADO,
        PROCESO_GENERAL.EN_PRODUCCION,
        PROCESO_GENERAL.FACTURADO,
        PROCESO_GENERAL.CERTIFICACION_PENDIENTE,
        PROCESO_GENERAL.COBRADO,
        PROCESO_GENERAL.FACTURACION_HABILITADA,
      ];
      qb.andWhere('presupuesto.procesoGeneralId IN (:...procesosIds)', { procesosIds });
    }
    if (hasAccess(ROLE_ALMACEN)) {
      qb.andWhere(
        '(presupuesto.procesoGeneralId = :procesoId OR presupuesto.fechaVerificacionAlmacen IS NOT NULL)',
        { procesoId: PROCESO_GENERAL.ENVIADO_A_ALMACEN }
      );
    }
    // Más roles si es necesario
  }

  async aplicarCondicionesPorPermisos(qb: SelectQueryBuilder<Presupuesto>) {
    const user = getUser();

    // Obtener procesos generales del rol
    const procesosGeneralesPermitidos = await this.roleProcesoGeneralService.findByRoleId(user.role);

    // Obtener todos los permisos de filtros
    const [
      verTodos,
      verPropios,
      verMisProcesos,
      verDisenoCompleto,
      verCosteoCompleto,
      verCosteoComercialCompleto,
      verProduccionCompleto
    ] = await Promise.all([
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_TODOS),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_PROPIOS),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_MIS_PROCESOS),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_DISENO_COMPLETO),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_COSTEO_COMPLETO),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_COSTEO_COMERCIAL_COMPLETO),
      hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_PRODUCCION_COMPLETO)
    ]);

    // Si tiene permiso de ver todos, no aplicar ningún filtro
    if (verTodos) {
      return;
    }

    // Por defecto no se ve nada, cada permiso agrega un OR
    qb.andWhere(new Brackets((whereQb) => {
      let tieneAlgunaCondicion = false;

      // Ver mis propios presupuestos (vendedorId)
      if (verPropios) {
        whereQb.orWhere('presupuesto.vendedorId = :vendedorId', { vendedorId: user.uid });
        tieneAlgunaCondicion = true;
      }

      // Ver presupuestos en mis procesos generales
      if (verMisProcesos && procesosGeneralesPermitidos.length > 0) {
        whereQb.orWhere('presupuesto.procesoGeneralId IN (:...procesosPermitidos)', {
          procesosPermitidos: procesosGeneralesPermitidos
        });
        tieneAlgunaCondicion = true;
      }

      // Ver presupuestos con diseño completo
      if (verDisenoCompleto) {
        whereQb.orWhere('presupuesto.diseno_estatus = :completo', { completo: 'completo' });
        tieneAlgunaCondicion = true;
      }

      // Ver presupuestos con costeo técnico completo
      if (verCosteoCompleto) {
        whereQb.orWhere('presupuesto.costeo_estatus = :completo', { completo: 'completo' });
        tieneAlgunaCondicion = true;
      }

      // Ver presupuestos con costeo comercial completo
      if (verCosteoComercialCompleto) {
        whereQb.orWhere('presupuesto.costeo_comercial_estatus = :completo', { completo: 'completo' });
        tieneAlgunaCondicion = true;
      }

      // Ver presupuestos con producción completa
      if (verProduccionCompleto) {
        whereQb.orWhere('presupuesto.produccion_estatus = :completo', { completo: 'completo' });
        tieneAlgunaCondicion = true;
      }

      // Si no tiene ningún permiso, agregar condición imposible (no ve nada)
      if (!tieneAlgunaCondicion) {
        whereQb.where('1 = 0');
      }
    }));
  }



  ajustarItemPorNuevoTotal(
    produccionTrabajos: { producto: any[]; servicio: any[] },
    nuevoTotal: number,
    comisionesPorDefecto = { materiales: 180, suministros: 80, manoDeObra: 180 }
  ) {
    const { producto, servicio } = produccionTrabajos;

    // Nuevo Total 600000
    // materialesComision: 287.22435068818055,
    // suministrosComision: 187.2243506881806,
    // manoDeObraComision: 287.22435068818066,

    // Deberian ser

    // materialesComision: 287.2243349273268
    // suministrosComision: 187.22433492732682
    // manoDeObraComision: 287.22433492732694
    const sumImportes = (arr: any[] = []) =>
      arr.reduce(
        (s, x) =>
          s +
          (Number(x.importe) ||
            (Number(x.punit) * Number(x.cantidad)) ||
            0),
        0
      );

    // 66.57863637394983
    // 66.57863756047009
    const materialesCosto =
      sumImportes(producto.flatMap((t: any) => t.materiales || [])) +
      sumImportes(servicio.flatMap((t: any) => t.materiales || []));

    const suministrosCosto =
      sumImportes(producto.flatMap((t: any) => t.suministros || [])) +
      sumImportes(servicio.flatMap((t: any) => t.suministros || []));

    const manoDeObraCosto =
      sumImportes(producto.flatMap((t: any) => t.manoDeObra || [])) +
      sumImportes(servicio.flatMap((t: any) => t.manoDeObra || []));

    const costos = {
      materiales: Number(materialesCosto) || 0,
      suministros: Number(suministrosCosto) || 0,
      manoDeObra: Number(manoDeObraCosto) || 0,
    };

    const comisiones = {
      materiales: Number(comisionesPorDefecto.materiales) || 0,
      suministros: Number(comisionesPorDefecto.suministros) || 0,
      manoDeObra: Number(comisionesPorDefecto.manoDeObra) || 0,
    };

    const baseVenta =
      costos.materiales * (1 + comisiones.materiales / 100) +
      costos.suministros * (1 + comisiones.suministros / 100) +
      costos.manoDeObra * (1 + comisiones.manoDeObra / 100);

    const diferencia = nuevoTotal - baseVenta;
    const totalCostos = costos.materiales + costos.suministros + costos.manoDeObra;

    if (totalCostos === 0) {
      return {
        materialesComision: comisiones.materiales,
        suministrosComision: comisiones.suministros,
        manoDeObraComision: comisiones.manoDeObra,
        materialesVenta: 0,
        suministrosVenta: 0,
        manoDeObraVenta: 0,
        ivaComision: diferencia,
        venta: nuevoTotal,
      };
    }

    const proporcion = {
      materiales: costos.materiales / totalCostos,
      suministros: costos.suministros / totalCostos,
      manoDeObra: costos.manoDeObra / totalCostos,
    };

    // Calcular nueva venta con mismo orden que front
    const nuevaVenta = {
      materiales:
        costos.materiales * (1 + comisiones.materiales / 100) +
        (diferencia * proporcion.materiales),
      suministros:
        costos.suministros * (1 + comisiones.suministros / 100) +
        (diferencia * proporcion.suministros),
      manoDeObra:
        costos.manoDeObra * (1 + comisiones.manoDeObra / 100) +
        (diferencia * proporcion.manoDeObra),
    };

    // Misma fórmula de comisión del front
    const nuevaComision = (venta: number, costo: number) =>
      costo === 0 ? 0 : ((venta / costo) - 1) * 100;

    return {
      materialesComision: String(nuevaComision(nuevaVenta.materiales, costos.materiales)),
      suministrosComision: String(nuevaComision(nuevaVenta.suministros, costos.suministros)),
      manoDeObraComision: String(nuevaComision(nuevaVenta.manoDeObra, costos.manoDeObra)),
      materialesVenta: nuevaVenta.materiales,
      suministrosVenta: nuevaVenta.suministros,
      manoDeObraVenta: nuevaVenta.manoDeObra,
      ivaComision: 0,
      venta: String(nuevoTotal),
    };
  }


  // ✅ Nuevo método con nombre mejorado
  async actualizarItemsPresupuesto(
    presupuestoId: number,
    items: UpdatePresupuestoItemDto[],
    presupuesto: Presupuesto
  ) {
    let itemGuardado;
    let ventaTotal = 0;
    let costoTotal = 0;

    for (const { produccionTrabajos, trabajosSeleccionados, materiales, suministros, manoDeObra, archivo, ...item } of items as any[]) {
      const { materialesCosto, suministrosCosto, manoDeObraCosto } =
        this.calcularCostosPorTrabajo(produccionTrabajos);

      if (item.id) {
        const materialesVenta = (Number(materialesCosto) || 0) * (1 + (Number(item.materialesComision) || 0) / 100);
        const suministrosVenta = (Number(suministrosCosto) || 0) * (1 + (Number(item.suministrosComision) || 0) / 100);
        const manoDeObraVenta = (Number(manoDeObraCosto) || 0) * (1 + (Number(item.manoDeObraComision) || 0) / 100);
        const ivaComision = Number(item.ivaComision) || 0;

        const venta = materialesVenta + suministrosVenta + manoDeObraVenta + ivaComision;

        ventaTotal += venta;
        costoTotal += (materialesCosto || 0) + (suministrosCosto || 0) + (manoDeObraCosto || 0);

        await this.presupuestoItemRepository.save({
          ...item,
          materialesCosto,
          suministrosCosto,
          manoDeObraCosto,
          venta
        });

        itemGuardado = item;
      } else {
        const materialesVenta = (Number(materialesCosto) || 0) * (1 + 100 / 100);
        const suministrosVenta = (Number(suministrosCosto) || 0) * (1 + 50 / 100);
        const manoDeObraVenta = (Number(manoDeObraCosto) || 0) * (1 + 100 / 100);
        const ivaComision = Number(item.ivaComision) || 0;

        const venta = materialesVenta + suministrosVenta + manoDeObraVenta + ivaComision;

        ventaTotal += venta;
        costoTotal += (materialesCosto || 0) + (suministrosCosto || 0) + (manoDeObraCosto || 0);

        const newItem = this.presupuestoItemRepository.create({
          ...item,
          materialesCosto,
          suministrosCosto,
          manoDeObraCosto,
          presupuestoId,
          manoDeObraComision: COMISIONES.MANO_DE_OBRA,
          suministrosComision: COMISIONES.SUMINISTROS,
          materialesComision: COMISIONES.MATERIALES,
          venta
        });

        itemGuardado = await this.presupuestoItemRepository.save(newItem);
      }

      if (produccionTrabajos || trabajosSeleccionados) {
        await this.guardarTrabajosEnItem(itemGuardado.id, {
          ...(produccionTrabajos || {}),
          trabajosSeleccionados,
        });
      }
    }

    // Costos administrativos
    const estructuraCosto = (ventaTotal * (presupuesto.estructuraComision || 0)) / 100;
    const vendedorCosto = (ventaTotal * (presupuesto.vendedorComision || 0)) / 100;
    const directorCosto = (ventaTotal * (presupuesto.directorComision || 0)) / 100;
    const costoAdminTotal = estructuraCosto + vendedorCosto + directorCosto;

    // Impuestos
    const taxIngresosCosto = (ventaTotal * (presupuesto.taxIngresosComision || 0)) / 100;
    const taxTransfCosto = (ventaTotal * (presupuesto.taxTransfComision || 0)) / 100;
    const taxGananciasCosto = ((ventaTotal - costoTotal - costoAdminTotal) * (presupuesto.taxGananciasComision || 0)) / 100;
    const taxTotal = taxIngresosCosto + taxTransfCosto + taxGananciasCosto;

    // Contribución y márgenes
    const contribucionMarginal = ventaTotal - costoTotal;
    const margenTotal = (contribucionMarginal - costoAdminTotal);
    const bab = (margenTotal - taxTotal);

    await this.presupuestoRepository.save({
      id: presupuestoId,
      ventaTotal,
      costoTotal,
      estructuraCosto,
      vendedorCosto,
      directorCosto,
      costoAdminTotal,
      taxIngresosCosto,
      taxTransfCosto,
      taxGananciasCosto,
      taxTotal,
      contribucionMarginal,
      margenTotal,
      bab
    });

    // 👉 No llama a actualizarPresupuestoProduccion
    return {
      ventaTotal,
      costoTotal,
      estructuraCosto,
      vendedorCosto,
      directorCosto,
      costoAdminTotal,
      taxIngresosCosto,
      taxTransfCosto,
      taxGananciasCosto,
      taxTotal,
      contribucionMarginal,
      margenTotal,
      bab
    };
  }

  // async getAnalisisCostos(presupuestoId: number) {
  //   // Obtener todos los materiales, suministros y mano de obra costeados
  //   const materiales = await this.presupuestoMaterialesRepository.find({
  //     where: { presupuestoItem: { presupuestoId } },
  //     relations: ['inventario', 'inventario.reservas'],
  //   });

  //   const suministros = await this.presupuestoSuministroRepository.find({
  //     where: { presupuestoItem: { presupuestoId } },
  //     relations: ['inventario', 'inventario.reservas'],
  //   });

  //   const manoDeObra = await this.presupuestoManoDeObraRepository.find({
  //     where: { presupuestoItem: { presupuestoId } },
  //     relations: ['inventario', 'inventario.reservas'],
  //   });

  //   // Obtener todos los movimientos de inventario relacionados a este presupuesto
  //   const movimientos = await this.movimientoInventarioService.findByPresupuestoId(presupuestoId);

  //   // Agrupar movimientos por productoId (solo OUT y RESERVA_USADA)
  //   const movimientosPorProducto = movimientos.reduce((acc, mov) => {
  //     if (mov.tipoMovimiento === 'OUT' || mov.tipoMovimiento === 'RESERVA_USADA') {
  //       const key = mov.productoId;
  //       if (!acc[key]) {
  //         acc[key] = {
  //           productoId: mov.productoId,
  //           productoNombre: mov.producto?.nombre || 'Producto desconocido',
  //           precioUnitario: Number(mov.producto?.punit || 0),
  //           cantidadTotal: 0,
  //         };
  //       }
  //       acc[key].cantidadTotal += Math.abs(Number(mov.cantidad));
  //     }
  //     return acc;
  //   }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadTotal: number }>);

  //   // MATERIALES: agrupar por productoId
  //   const materialesAgrupados = materiales.reduce((acc, mat) => {
  //     const key = mat.inventarioId;
  //     if (!acc[key]) {
  //       acc[key] = {
  //         productoId: mat.inventarioId,
  //         productoNombre: mat.inventario?.nombre || mat.concepto || 'Sin nombre',
  //         precioUnitario: Number(mat.inventario?.punit || 0),
  //         cantidadCosteada: 0,
  //       };
  //     }
  //     acc[key].cantidadCosteada += Number(mat.cantidad || 0);
  //     return acc;
  //   }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadCosteada: number }>);

  //   const materialesAnalisis = Object.values(materialesAgrupados).map((matGrupo) => {
  //     const cantidadReal = movimientosPorProducto[matGrupo.productoId]?.cantidadTotal || 0;
  //     const diferencia = cantidadReal - matGrupo.cantidadCosteada;

  //     return {
  //       productoId: matGrupo.productoId,
  //       producto: matGrupo.productoNombre,
  //       precioUnitario: matGrupo.precioUnitario,
  //       cantidadCosteada: matGrupo.cantidadCosteada,
  //       cantidadReal,
  //       diferencia,
  //       esExtra: false,
  //     };
  //   });

  //   // Agregar materiales EXTRAS (movimientos sin costeo)
  //   Object.keys(movimientosPorProducto).forEach((productoIdStr) => {
  //     const productoId = Number(productoIdStr);
  //     const yaExiste = materialesAgrupados[productoId];
  //     if (!yaExiste) {
  //       const mov = movimientosPorProducto[productoId];
  //       materialesAnalisis.push({
  //         productoId: mov.productoId,
  //         producto: mov.productoNombre + ' (No planificado)',
  //         precioUnitario: mov.precioUnitario,
  //         cantidadCosteada: 0,
  //         cantidadReal: mov.cantidadTotal,
  //         diferencia: mov.cantidadTotal,
  //         esExtra: true,
  //       });
  //     }
  //   });

  //   // SUMINISTROS: agrupar por productoId
  //   const suministrosAgrupados = suministros.reduce((acc, sum) => {
  //     const key = sum.inventarioId;
  //     if (!acc[key]) {
  //       acc[key] = {
  //         productoId: sum.inventarioId,
  //         productoNombre: sum.inventario?.nombre || sum.concepto || 'Sin nombre',
  //         precioUnitario: Number(sum.inventario?.punit || 0),
  //         cantidadCosteada: 0,
  //       };
  //     }
  //     acc[key].cantidadCosteada += Number(sum.cantidad || 0);
  //     return acc;
  //   }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadCosteada: number }>);

  //   const suministrosAnalisis = Object.values(suministrosAgrupados).map((sumGrupo) => {
  //     const cantidadReal = movimientosPorProducto[sumGrupo.productoId]?.cantidadTotal || 0;
  //     const diferencia = cantidadReal - sumGrupo.cantidadCosteada;

  //     return {
  //       productoId: sumGrupo.productoId,
  //       producto: sumGrupo.productoNombre,
  //       precioUnitario: sumGrupo.precioUnitario,
  //       cantidadCosteada: sumGrupo.cantidadCosteada,
  //       cantidadReal,
  //       diferencia,
  //       esExtra: false,
  //     };
  //   });

  //   // Agregar suministros EXTRAS
  //   Object.keys(movimientosPorProducto).forEach((productoIdStr) => {
  //     const productoId = Number(productoIdStr);
  //     const yaExisteMaterial = materialesAgrupados[productoId];
  //     const yaExisteSuministro = suministrosAgrupados[productoId];

  //     // Solo agregar si no está en materiales ni en suministros
  //     if (!yaExisteMaterial && !yaExisteSuministro) {
  //       const mov = movimientosPorProducto[productoId];
  //       suministrosAnalisis.push({
  //         productoId: mov.productoId,
  //         producto: mov.productoNombre + ' (No planificado)',
  //         precioUnitario: mov.precioUnitario,
  //         cantidadCosteada: 0,
  //         cantidadReal: mov.cantidadTotal,
  //         diferencia: mov.cantidadTotal,
  //         esExtra: true,
  //       });
  //     }
  //   });

  //   // MANO DE OBRA: agrupar por inventarioId (o concepto)
  //   const manoDeObraAgrupados = manoDeObra.reduce((acc, mo) => {
  //     const key = mo.inventarioId || mo.concepto;
  //     if (!acc[key]) {
  //       acc[key] = {
  //         productoId: mo.inventarioId,
  //         productoNombre: mo.inventario?.nombre || mo.concepto || 'Sin nombre',
  //         precioUnitario: Number(mo.inventario?.punit || 0),
  //         cantidadCosteada: 0,
  //         cantidadReal: 0,
  //       };
  //     }
  //     acc[key].cantidadCosteada += Number(mo.cantidad || 0);
  //     acc[key].cantidadReal += Number(mo.cantidadReal || 0);
  //     return acc;
  //   }, {} as Record<string | number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadCosteada: number; cantidadReal: number }>);

  //   const manoDeObraAnalisis = Object.values(manoDeObraAgrupados).map((moGrupo) => {
  //     const diferencia = moGrupo.cantidadReal - moGrupo.cantidadCosteada;

  //     return {
  //       productoId: moGrupo.productoId,
  //       producto: moGrupo.productoNombre,
  //       precioUnitario: moGrupo.precioUnitario,
  //       cantidadCosteada: moGrupo.cantidadCosteada,
  //       cantidadReal: moGrupo.cantidadReal,
  //       diferencia,
  //       esExtra: false,
  //     };
  //   });

  //   return {
  //     materiales: materialesAnalisis,
  //     suministros: suministrosAnalisis,
  //     manoDeObra: manoDeObraAnalisis,
  //   };
  // }

  // Helper: calcular stockReservado dinámicamente para múltiples productos
  private async calcularStockReservadoParaProductos(productosIds: number[], presupuestoIdExcluir?: number): Promise<Record<number, number>> {
    if (!productosIds || productosIds.length === 0) {
      return {};
    }

    const queryBuilder = this.inventarioReservaRepository
      .createQueryBuilder('reserva')
      .select('reserva.productoId', 'productoId')
      .addSelect('SUM(reserva.cantidad)', 'totalReservado')
      .where('reserva.productoId IN (:...ids)', { ids: productosIds })
      .andWhere('reserva.deletedAt IS NULL');

    // Si se especifica un presupuestoId, excluir sus reservas del cálculo
    if (presupuestoIdExcluir) {
      queryBuilder.andWhere('reserva.presupuestoId != :presupuestoId', { presupuestoId: presupuestoIdExcluir });
    }

    const reservas = await queryBuilder
      .groupBy('reserva.productoId')
      .getRawMany();

    return reservas.reduce((acc, r) => {
      acc[r.productoId] = Number(r.totalReservado || 0);
      return acc;
    }, {} as Record<number, number>);
  }

  async getMaterialesAnalisis(presupuestoId: number) {
    const materiales = await this.presupuestoMaterialesRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      relations: ['inventario', 'inventario.reservas'],
    });

    const movimientos = await this.movimientoInventarioService.findByPresupuestoId(presupuestoId);

    const movimientosPorProducto = movimientos.reduce((acc, mov) => {
      if (mov.tipoMovimiento === 'OUT' || mov.tipoMovimiento === 'RESERVA_USADA') {
        const key = mov.productoId
        if (!acc[key]) {
          acc[key] = {
            productoId: mov.productoId,
            productoNombre: mov.producto?.nombre || 'Producto desconocido',
            precioUnitario: Number(mov.producto?.punit || 0),
            cantidadTotal: 0,
          };
        }
        acc[key].cantidadTotal += Math.abs(Number(mov.cantidad));
      }
      return acc;
    }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadTotal: number }>);

    // Calcular stockReservado para todos los productos únicos
    // Excluir las reservas de este presupuesto del cálculo
    const productosIds = [...new Set(materiales.map(m => m.inventarioId).filter(id => id))];
    const stockReservadoPorProducto = await this.calcularStockReservadoParaProductos(productosIds, presupuestoId);

    const materialesAgrupados = materiales.reduce((acc, mat) => {
      const key = mat.inventarioId || mat.concepto
      if (!acc[key]) {
        acc[key] = {
          productoId: mat.inventarioId,
          productoNombre: mat.inventario?.nombre || mat.concepto || 'Sin nombre',
          precioUnitario: Number(mat.inventario?.punit || 0),
          stock: Number(mat.inventario?.stock || 0),
          stockReservado: stockReservadoPorProducto[mat.inventarioId] || 0,
          cantidadCosteada: 0,
        };
      }
      acc[key].cantidadCosteada += Number(mat.cantidad || 0);
      return acc;
    }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; stock: number; stockReservado: number; cantidadCosteada: number }>);

    const materialesAnalisis = Object.values(materialesAgrupados).map((matGrupo) => {
      const cantidadReal = movimientosPorProducto[matGrupo.productoId]?.cantidadTotal || 0;
      const diferencia = cantidadReal - matGrupo.cantidadCosteada;
      const stockDisponible = matGrupo.stock - matGrupo.stockReservado;

      return {
        productoId: matGrupo.productoId,
        producto: matGrupo.productoNombre,
        precioUnitario: matGrupo.precioUnitario,
        stock: matGrupo.stock,
        stockReservado: matGrupo.stockReservado,
        stockDisponible,
        cantidadCosteada: matGrupo.cantidadCosteada,
        cantidadReal,
        diferencia,
        esExtra: false,
      };
    });

    return materialesAnalisis;
  }

  async getSuministrosAnalisis(presupuestoId: number) {
    const suministros = await this.presupuestoSuministroRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      relations: ['inventario', 'inventario.reservas'],
    });

    const movimientos = await this.movimientoInventarioService.findByPresupuestoId(presupuestoId);

    const movimientosPorProducto = movimientos.reduce((acc, mov) => {
      if (mov.tipoMovimiento === 'OUT' || mov.tipoMovimiento === 'RESERVA_USADA') {
        const key = mov.productoId;
        if (!acc[key]) {
          acc[key] = {
            productoId: mov.productoId,
            productoNombre: mov.producto?.nombre || 'Producto desconocido',
            precioUnitario: Number(mov.producto?.punit || 0),
            cantidadTotal: 0,
          };
        }
        acc[key].cantidadTotal += Math.abs(Number(mov.cantidad));
      }
      return acc;
    }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadTotal: number }>);

    // Calcular stockReservado para todos los productos únicos
    // Excluir las reservas de este presupuesto del cálculo
    const productosIds = [...new Set(suministros.map(s => s.inventarioId).filter(id => id))];
    const stockReservadoPorProducto = await this.calcularStockReservadoParaProductos(productosIds, presupuestoId);

    const suministrosAgrupados = suministros.reduce((acc, sum) => {
      const key = sum.inventarioId || sum.concepto
      if (!acc[key]) {
        acc[key] = {
          productoId: sum.inventarioId,
          productoNombre: sum.inventario?.nombre || sum.concepto || 'Sin nombre',
          precioUnitario: Number(sum.inventario?.punit || 0),
          stock: Number(sum.inventario?.stock || 0),
          stockReservado: stockReservadoPorProducto[sum.inventarioId] || 0,
          cantidadCosteada: 0,
        };
      }
      acc[key].cantidadCosteada += Number(sum.cantidad || 0);
      return acc;
    }, {} as Record<number, { productoId: number; productoNombre: string; precioUnitario: number; stock: number; stockReservado: number; cantidadCosteada: number }>);

    const suministrosAnalisis = Object.values(suministrosAgrupados).map((sumGrupo) => {
      const cantidadReal = movimientosPorProducto[sumGrupo.productoId]?.cantidadTotal || 0;
      const diferencia = cantidadReal - sumGrupo.cantidadCosteada;
      const stockDisponible = sumGrupo.stock - sumGrupo.stockReservado;

      return {
        productoId: sumGrupo.productoId,
        producto: sumGrupo.productoNombre,
        precioUnitario: sumGrupo.precioUnitario,
        stock: sumGrupo.stock,
        stockReservado: sumGrupo.stockReservado,
        stockDisponible,
        cantidadCosteada: sumGrupo.cantidadCosteada,
        cantidadReal,
        diferencia,
        esExtra: false,
      };
    });

    return suministrosAnalisis;
  }

  async getManoDeObraAnalisis(presupuestoId: number) {
    const manoDeObra = await this.presupuestoManoDeObraRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      relations: ['inventario', 'inventario.reservas'],
    });

    const manoDeObraAgrupados = manoDeObra.reduce((acc, mo) => {
      const key = mo.inventarioId || mo.concepto;
      if (!acc[key]) {
        acc[key] = {
          productoId: mo.inventarioId,
          productoNombre: mo.inventario?.nombre || mo.concepto || 'Sin nombre',
          precioUnitario: Number(mo.inventario?.punit || 0),
          cantidadCosteada: 0,
          cantidadReal: 0,
        };
      }
      acc[key].cantidadCosteada += Number(mo.cantidad || 0);
      acc[key].cantidadReal += Number(mo.cantidadReal || 0);
      return acc;
    }, {} as Record<string | number, { productoId: number; productoNombre: string; precioUnitario: number; cantidadCosteada: number; cantidadReal: number }>);

    const manoDeObraAnalisis = Object.values(manoDeObraAgrupados).map((moGrupo) => {
      const diferencia = moGrupo.cantidadReal - moGrupo.cantidadCosteada;

      return {
        productoId: moGrupo.productoId,
        producto: moGrupo.productoNombre,
        precioUnitario: moGrupo.precioUnitario,
        cantidadCosteada: moGrupo.cantidadCosteada,
        cantidadReal: moGrupo.cantidadReal,
        diferencia,
        esExtra: false,
      };
    });

    return manoDeObraAnalisis;
  }

  async getProductosExtrasAnalisis(presupuestoId: number) {
    // Obtener todas las categorías planificadas
    const materiales = await this.presupuestoMaterialesRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      select: ['inventarioId'],
    });

    const suministros = await this.presupuestoSuministroRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      select: ['inventarioId'],
    });

    const manoDeObra = await this.presupuestoManoDeObraRepository.find({
      where: { presupuestoItem: { presupuestoId } },
      select: ['inventarioId'],
    });

    // Crear Set de IDs de productos planificados
    const productosPlaneados = new Set<number>();
    materiales.forEach(m => m.inventarioId && productosPlaneados.add(m.inventarioId));
    suministros.forEach(s => s.inventarioId && productosPlaneados.add(s.inventarioId));
    manoDeObra.forEach(mo => mo.inventarioId && productosPlaneados.add(mo.inventarioId));

    // Obtener movimientos
    const movimientos = await this.movimientoInventarioService.findByPresupuestoId(presupuestoId);

    // Agrupar movimientos de productos NO planeados
    const movimientosPorProducto = movimientos.reduce((acc, mov) => {
      if ((mov.tipoMovimiento === 'OUT' || mov.tipoMovimiento === 'RESERVA_USADA') &&
        mov.productoId &&
        !productosPlaneados.has(mov.productoId)) {
        const key = mov.productoId
        if (!acc[key]) {
          acc[key] = {
            productoId: mov.productoId,
            productoNombre: mov.producto?.nombre || 'Producto desconocido',
            precioUnitario: Number(mov.producto?.punit || 0),
            stock: Number(mov.producto?.stock || 0),
            cantidadTotal: 0,
          };
        }
        acc[key].cantidadTotal += Math.abs(Number(mov.cantidad));
      }
      return acc;
    }, {} as Record<number, {
      productoId: number;
      productoNombre: string;
      precioUnitario: number;
      stock: number;
      cantidadTotal: number
    }>);

    // Calcular stockReservado para todos los productos extras
    // Excluir las reservas de este presupuesto del cálculo
    const productosExtrasIds = Object.keys(movimientosPorProducto).map(id => Number(id));
    const stockReservadoPorProducto = await this.calcularStockReservadoParaProductos(productosExtrasIds, presupuestoId);

    // Convertir a array y calcular stockDisponible
    const productosExtrasAnalisis = Object.values(movimientosPorProducto).map((prod) => {
      const stockReservado = stockReservadoPorProducto[prod.productoId] || 0;
      const stockDisponible = prod.stock - stockReservado;

      return {
        productoId: prod.productoId,
        producto: prod.productoNombre + ' (No planificado)',
        precioUnitario: prod.precioUnitario,
        stock: prod.stock,
        stockReservado,
        stockDisponible,
        cantidadCosteada: 0,
        cantidadReal: prod.cantidadTotal,
        diferencia: prod.cantidadTotal,
        esExtra: true,
      };
    });

    return productosExtrasAnalisis;
  }

  // ============================================
  // Event Listeners - Facturación y Cobranza
  // ============================================

  /**
   * Listener que se ejecuta cuando se crea una factura
   */
  @OnEvent(FACTURACION.FACTURA_CREADA)
  async handleFacturaCreada(factura: Factura) {
    if (factura.modelo === 'presupuesto') {
      await this.recalcularMontoFacturado(factura.modeloId);
    }
  }

  /**
   * Listener que se ejecuta cuando se crea un cobro
   */
  @OnEvent(COBROS.COBRO_CREADA)
  async handleCobroCreado(cobro: Cobro) {
    if (cobro.modelo === 'presupuesto') {
      await this.recalcularMontoCobrado(cobro.modeloId);
    }
  }

  /**
   * Listener que se ejecuta cuando se crea un cobro masivo
   */
  @OnEvent(COBROS.COBRO_MASIVO_CREADO)
  async handleCobroMasivoCreado(payload: any) {
    const { cobros } = payload;
    if (!cobros || cobros.length === 0) return;

    // Recalcular monto cobrado para cada presupuesto afectado
    const presupuestosIds = new Set<number>();
    for (const cobro of cobros) {
      if (cobro.modelo === 'presupuesto') {
        presupuestosIds.add(cobro.modeloId);
      }
    }

    for (const presupuestoId of presupuestosIds) {
      await this.recalcularMontoCobrado(presupuestoId);
    }
  }

  /**
   * Listener que se ejecuta cuando se actualiza un cobro
   */
  /**
   * Recalcula el monto total facturado del presupuesto
   * sumando todas las facturas relacionadas
   */
  private async recalcularMontoFacturado(presupuestoId: number) {
    // Buscar todas las facturas del presupuesto
    const facturas = await this.presupuestoRepository.manager
      .getRepository('Factura')
      .createQueryBuilder('factura')
      .where('factura.modelo = :modelo', { modelo: 'presupuesto' })
      .andWhere('factura.modelo_id = :modeloId', { modeloId: presupuestoId })
      .getMany();


    // Calcular el monto total facturado
    const montoFacturado = facturas.reduce((sum, factura) => {
      return sum + Number(factura.monto || 0);
    }, 0);

    // Obtener el presupuesto para comparar con ventaTotal
    const presupuesto = await this.presupuestoRepository.findOne({
      where: { id: presupuestoId },
      select: ['id', 'ventaTotal', 'procesoGeneralId']
    });


    if (!presupuesto) return;

    // Determinar el estado de facturación
    let facturacionEstatus = 'pendiente';

    if (montoFacturado === 0) {
      facturacionEstatus = 'pendiente';
    } else if (Number(montoFacturado.toFixed(2)) >= Number(Number(presupuesto.ventaTotal).toFixed(2))) {
      facturacionEstatus = 'total';
      // Si la facturación está completa, actualizar proceso general a FACTURADO
    } else {
      facturacionEstatus = 'parcial';
    }
    // Actualizar el presupuesto
    await this.presupuestoRepository.save({
      id: presupuestoId,
      montoFacturado,
      facturacionEstatus,
      procesoGeneralId: PROCESO_GENERAL.FACTURADO
    });
  }

  /**
   * Recalcula el monto total cobrado del presupuesto
   * sumando todos los cobros relacionados
   */
  private async recalcularMontoCobrado(presupuestoId: number) {
    // Buscar todos los cobros del presupuesto
    const cobros = await this.presupuestoRepository.manager
      .getRepository('Cobro')
      .createQueryBuilder('cobro')
      .where('cobro.modelo = :modelo', { modelo: 'presupuesto' })
      .andWhere('cobro.modelo_id = :modeloId', { modeloId: presupuestoId })
      .getMany();

    // Calcular el monto total cobrado y retenciones
    let montoCobrado = 0;
    let montoRetenciones = 0;

    cobros.forEach(cobro => {
      montoCobrado += Number(cobro.monto || 0);
      montoRetenciones += Number(cobro.retenciones || 0);
    });

    // Obtener el presupuesto para comparar con montoFacturado
    const presupuesto = await this.presupuestoRepository.findOne({
      where: { id: presupuestoId },
      select: ['id', 'montoFacturado', 'procesoGeneralId']
    });

    if (!presupuesto) return;

    // Determinar el estado de cobranza
    let cobranzaEstatus = 'pendiente';

    if (montoCobrado === 0) {
      cobranzaEstatus = 'pendiente';
    } else if (montoCobrado >= presupuesto.montoFacturado) {
      cobranzaEstatus = 'total';
    } else {
      cobranzaEstatus = 'parcial';
    }

    // Actualizar el presupuesto
    await this.presupuestoRepository.save({
      id: presupuestoId,
      montoCobrado,
      montoRetenciones,
      cobranzaEstatus,
      procesoGeneralId: PROCESO_GENERAL.COBRADO
    });
  }

}




// ajustarItemPorNuevoTotal(
//     produccionTrabajos: { producto: any[]; servicio: any[] },
//     nuevoTotal: number,
//     comisionesPorDefecto = { materiales: 180, suministros: 80, manoDeObra: 180 }
//   ) {
//     const { producto, servicio } = produccionTrabajos;

//     // ✅ El front llega con costos a 2 decimales (strings como "126024.89").
//     // Para ser consistentes, sumamos y redondeamos a 2 decimales SOLO los costos.
//     const to2 = (n: number) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

//     const sumImportes = (arr: any[] = []) =>
//       arr.reduce(
//         (s, x) => s + (Number(x.importe) || (Number(x.punit) * Number(x.cantidad)) || 0),
//         0
//       );

//     const materialesCosto = to2(
//       sumImportes(producto.flatMap((t: any) => t.materiales || [])) +
//       sumImportes(servicio.flatMap((t: any) => t.materiales || []))
//     );

//     const suministrosCosto = to2(
//       sumImportes(producto.flatMap((t: any) => t.suministros || [])) +
//       sumImportes(servicio.flatMap((t: any) => t.suministros || []))
//     );

//     const manoDeObraCosto = to2(
//       sumImportes(producto.flatMap((t: any) => t.manoDeObra || [])) +
//       sumImportes(servicio.flatMap((t: any) => t.manoDeObra || []))
//     );

//     const costos = {
//       materiales: Number(materialesCosto) || 0,
//       suministros: Number(suministrosCosto) || 0,
//       manoDeObra: Number(manoDeObraCosto) || 0,
//     };

//     // mismas comisiones por defecto que usa el front para partir
//     const comisiones = {
//       materiales: Number(comisionesPorDefecto.materiales) || 0,
//       suministros: Number(comisionesPorDefecto.suministros) || 0,
//       manoDeObra: Number(comisionesPorDefecto.manoDeObra) || 0,
//     };

//     const baseVenta =
//       costos.materiales * (1 + comisiones.materiales / 100) +
//       costos.suministros * (1 + comisiones.suministros / 100) +
//       costos.manoDeObra * (1 + comisiones.manoDeObra / 100);

//     const diferencia = Number(nuevoTotal) - baseVenta;

//     const totalCostos = costos.materiales + costos.suministros + costos.manoDeObra;

//     if (totalCostos === 0) {
//       // mismo fallback que el front: todo a ivaComision
//       return {
//         materialesComision: comisiones.materiales,
//         suministrosComision: comisiones.suministros,
//         manoDeObraComision: comisiones.manoDeObra,
//         materialesVenta: 0,
//         suministrosVenta: 0,
//         manoDeObraVenta: 0,
//         ivaComision: diferencia,
//         venta: Number(nuevoTotal),
//       };
//     }

//     // proporción por costo (tal cual front)
//     const proporcion = {
//       materiales: costos.materiales / totalCostos,
//       suministros: costos.suministros / totalCostos,
//       manoDeObra: costos.manoDeObra / totalCostos,
//     };

//     // nueva venta por rubro = venta base + ajuste proporcional
//     const nuevaVenta = {
//       materiales:
//         costos.materiales * (1 + comisiones.materiales / 100) +
//         diferencia * proporcion.materiales,
//       suministros:
//         costos.suministros * (1 + comisiones.suministros / 100) +
//         diferencia * proporcion.suministros,
//       manoDeObra:
//         costos.manoDeObra * (1 + comisiones.manoDeObra / 100) +
//         diferencia * proporcion.manoDeObra,
//     };

//     // misma fórmula del front para recomputar % comisión
//     const nuevaComision = (venta: number, costo: number) =>
//       costo === 0 ? 0 : ((venta / costo) - 1) * 100;

//     return {
//       materialesComision: nuevaComision(nuevaVenta.materiales, costos.materiales),
//       suministrosComision: nuevaComision(nuevaVenta.suministros, costos.suministros),
//       manoDeObraComision: nuevaComision(nuevaVenta.manoDeObra, costos.manoDeObra),
//       materialesVenta: nuevaVenta.materiales,
//       suministrosVenta: nuevaVenta.suministros,
//       manoDeObraVenta: nuevaVenta.manoDeObra,
//       ivaComision: 0,
//       venta: Number(nuevoTotal),
//     };
//   }