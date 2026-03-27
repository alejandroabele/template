import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, FindManyOptions, In, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateSolcomDto } from './dto/create-solcom.dto';
import { UpdateSolcomDto } from './dto/update-solcom.dto';
import { Solcom } from './entities/solcom.entity';
import { SolcomItem } from './entities/solcom-item.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { Archivo } from '../archivo/entities/archivo.entity';
import { RegistroLeidoService } from '../registro-leido/registro-leido.service';
import { ESTADO_SOLCOM_CODIGOS } from '@/constants/compras';
import { PERMISOS } from '@/constants/permisos';
import { hasPermission } from '@/helpers/has-permissions.helper';
import { getUser } from '@/helpers/get-user';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';

@Injectable()
export class SolcomService {
  constructor(
    @InjectRepository(Solcom)
    private solcomRepository: Repository<Solcom>,
    @InjectRepository(SolcomItem)
    private solcomItemRepository: Repository<SolcomItem>,
    @InjectRepository(EstadoCompras)
    private estadoComprasRepository: Repository<EstadoCompras>,
    @InjectRepository(Archivo)
    private archivoRepository: Repository<Archivo>,
    private readonly registroLeidoService: RegistroLeidoService,
    private pdfExportService: PdfExportService,
  ) { }

  async create(createSolcomDto: CreateSolcomDto) {
    // Buscar el estado SOLC_ING
    const estadoInicial = await this.estadoComprasRepository.findOne({
      where: { codigo: ESTADO_SOLCOM_CODIGOS.SOLC_INI, tipo: 'SOLCOM' }
    });

    // Establecer usuario solicitante y estado inicial
    const solcomData = {
      ...createSolcomDto,
      estadoId: estadoInicial?.id,
      usuarioSolicitanteId: getUser().uid,
    };


    // Separar items del resto de datos
    const { items, ...solcomMainData } = solcomData;

    // Crear la solcom
    const solcom = this.solcomRepository.create(solcomMainData);
    const savedSolcom = await this.solcomRepository.save(solcom);

    // Si hay items, crearlos
    if (items && items.length > 0) {
      const solcomItems = items.map(item =>
        this.solcomItemRepository.create({
          ...item,
          solcomId: savedSolcom.id,
        })
      );
      await this.solcomItemRepository.save(solcomItems);
    }

    // Retornar la solcom completa con sus items
    return this.findOne(savedSolcom.id);
  }

  async findAll(conditions: FindManyOptions<Solcom>): Promise<Solcom[]> {
    const qb = this.solcomRepository.createQueryBuilder('solcom');

    const relaciones = ['items', 'estado', 'usuarioSolicitante', 'presupuesto', 'centro'];

    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`solcom.${relation}`, relation.split('.').pop());
    }


    // Cargar también el comprador, inventario y conversión de cada item
    qb.leftJoinAndSelect('items.comprador', 'comprador');
    qb.leftJoinAndSelect('items.inventario', 'inventario');
    qb.leftJoinAndSelect('items.inventarioConversion', 'inventarioConversion');

    // Cargar las ofertas y órdenes de compra asociadas a cada item
    qb.leftJoinAndSelect('items.ofertaItems', 'ofertaItems');
    qb.leftJoinAndSelect('ofertaItems.oferta', 'oferta');
    qb.leftJoinAndSelect('oferta.estado', 'ofertaEstado');
    qb.leftJoinAndSelect('oferta.ordenCompra', 'ordenCompra');
    qb.leftJoinAndSelect('ordenCompra.estado', 'ordenCompraEstado');

    buildWhereAndOrderQuery(qb, conditions, 'solcom');
    await this.aplicarCondicionesPorPermisos(qb);

    const solcoms = await qb.getMany();

    // Agregar estado de lectura
    if (solcoms.length > 0) {
      const lecturas = await this.registroLeidoService.verificarLecturasUsuario(
        'solcom',
        solcoms.map(s => s.id)
      );

      solcoms.forEach(s => {
        (s as any).registroLeido = lecturas.get(s.id) || false;
      });
    }

    return solcoms;
  }

  async findOne(id: number) {
    const qb = this.solcomRepository
      .createQueryBuilder('solcom')
      .where('solcom.id = :id', { id })

      // items de la solcom
      .leftJoinAndSelect('solcom.items', 'items')
      .leftJoinAndSelect('items.inventario', 'inventario')
      .leftJoinAndSelect('items.inventarioConversion', 'inventarioConversion')
      .leftJoinAndSelect('items.comprador', 'comprador')

      // oferta asociada a los items
      .leftJoinAndSelect('items.ofertaItems', 'ofertaItems')
      .leftJoinAndSelect('ofertaItems.oferta', 'oferta')
      .leftJoinAndSelect('oferta.ordenCompra', 'ordenCompra')
      .leftJoinAndSelect('ordenCompra.estado', 'ordenCompraEstado')

      // relaciones directas de solcom
      .leftJoinAndSelect('solcom.estado', 'estado')
      .leftJoinAndSelect('solcom.usuarioSolicitante', 'usuarioSolicitante')
      .leftJoinAndSelect('solcom.presupuesto', 'presupuesto')
      .leftJoinAndSelect('solcom.centro', 'centro')
      .orderBy('items.id', 'DESC')


    const solcom = await qb.getOne();

    if (solcom) {
      solcom['registroLeido'] =
        await this.registroLeidoService.verificarLecturaUsuario('solcom', id);

      // Cargar adjuntos (imágenes) de cada inventario de los items
      if (solcom.items?.length) {
        const inventarioIds = solcom.items
          .map(item => item.inventario?.id)
          .filter(Boolean) as number[];

        if (inventarioIds.length) {
          const adjuntos = await this.archivoRepository.find({
            where: {
              modelo: 'inventario',
              modeloId: In(inventarioIds),
              tipo: 'imagenes',
            },
          });

          solcom.items.forEach(item => {
            if (item.inventario) {
              item.inventario['adjuntos'] = adjuntos.filter(
                a => a.modeloId === item.inventario.id
              );
            }
          });
        }
      }
    }

    return solcom;
  }


  async findItems(id: number) {
    const items = await this.solcomItemRepository.find({
      where: { solcomId: id },
      relations: [
        'inventario',
        'inventarioConversion',
        'comprador',
        'ofertaItems',
        'ofertaItems.oferta',
        'ofertaItems.oferta.ordenCompra',
        'ofertaItems.oferta.ordenCompra.estado',
      ],
    });

    return items;
  }

  async findAllItems(conditions: FindManyOptions<SolcomItem>): Promise<SolcomItem[]> {
    const qb = this.solcomItemRepository.createQueryBuilder('item');

    qb.leftJoinAndSelect('item.inventario', 'inventario');
    qb.leftJoinAndSelect('item.inventarioConversion', 'inventarioConversion');
    qb.leftJoinAndSelect('item.comprador', 'comprador');
    qb.leftJoinAndSelect('item.solcom', 'solcom');
    qb.leftJoinAndSelect('solcom.estado', 'solcomEstado');

    qb.leftJoinAndSelect('item.ofertaItems', 'ofertaItems');
    qb.leftJoinAndSelect('ofertaItems.oferta', 'oferta');
    qb.leftJoinAndSelect('oferta.ordenCompra', 'ordenCompra');
    qb.leftJoinAndSelect('ordenCompra.estado', 'ordenCompraEstado');

    buildWhereAndOrderQuery(qb, conditions, 'item');


    return qb.getMany();
  }


  async update(id: number, updateSolcomDto: UpdateSolcomDto) {
    const { items, ...solcomMainData } = updateSolcomDto;

    // Actualizar datos principales de solcom
    await this.solcomRepository.update({ id }, solcomMainData);

    // Si hay items, eliminar los anteriores y crear los nuevos
    if (items !== undefined) {
      // Eliminar items anteriores
      await this.solcomItemRepository.delete({ solcomId: id });

      // Crear nuevos items
      if (items && items.length > 0) {
        const solcomItems = items.map(item =>
          this.solcomItemRepository.create({
            ...item,
            solcomId: id,
          })
        );
        await this.solcomItemRepository.save(solcomItems);
      }
    }

    // Retornar la solcom actualizada
    return this.findOne(id);
  }

  async remove(id: number) {
    const solcom = await this.findOne(id);
    await this.solcomRepository.delete({ id });
    return solcom;
  }

  async finalizar(id: number) {
    // Buscar el estado SOLC_FIN
    const estadoFinalizado = await this.estadoComprasRepository.findOne({
      where: { codigo: ESTADO_SOLCOM_CODIGOS.SOLC_FIN, tipo: 'SOLCOM' }
    });

    if (!estadoFinalizado) {
      throw new Error('No se encontró el estado SOLC_FIN');
    }

    // Actualizar el estado de la solcom
    await this.solcomRepository.update({ id }, { estadoId: estadoFinalizado.id });

    // Retornar la solcom actualizada
    return this.findOne(id);
  }

  /**
   * Asigna el usuario actual como comprador de todos los items de una SOLCOM
   */
  async asignar(id: number) {
    const user = getUser();

    // Obtener todos los items de la SOLCOM
    const items = await this.solcomItemRepository.find({
      where: { solcomId: id }
    });

    if (!items || items.length === 0) {
      throw new Error('La SOLCOM no tiene items');
    }

    // Asignar el usuario actual como comprador de todos los items
    const itemIds = items.map(item => item.id);
    await this.solcomItemRepository.update(
      { id: In(itemIds) },
      { compradorId: user.uid }
    );

    return this.findOne(id);
  }

  /**
   * Asigna el usuario actual como comprador de múltiples items de SOLCOM
   */
  async asignarItems(itemIds: number[]) {
    const user = getUser();

    // Verificar que todos los items existan
    const items = await this.solcomItemRepository.findByIds(itemIds);

    if (items.length !== itemIds.length) {
      throw new Error('Algunos items de SOLCOM no fueron encontrados');
    }

    // Asignar el usuario actual como comprador de todos los items
    await this.solcomItemRepository.update(
      { id: In(itemIds) },
      { compradorId: user.uid }
    );

    // Retornar los items actualizados
    return this.solcomItemRepository.find({
      where: { id: In(itemIds) },
      relations: ['inventario', 'comprador', 'solcom']
    });
  }

  async modificarEstado(id: number, estadoId: number) {
    // Verificar que el estado exista
    const estado = await this.estadoComprasRepository.findOne({
      where: { id: estadoId, tipo: 'SOLCOM' }
    });

    if (!estado) {
      throw new Error('Estado no encontrado o no es válido para SOLCOM');
    }

    // Actualizar el estado de la solcom
    await this.solcomRepository.update({ id }, { estadoId });

    // Retornar la solcom actualizada
    return this.findOne(id);
  }

  /**
   * Aplica condiciones de filtrado según los permisos del usuario
   * Por defecto no se ve nada, cada permiso agrega un filtro OR
   */
  private async aplicarCondicionesPorPermisos(qb: SelectQueryBuilder<Solcom>) {
    const user = getUser();

    // Obtener todos los permisos de filtros
    const [
      verTodas,
      verPropias,
      verPendientes,
      verAprobadas,
      verRechazadas,
      verFinalizadas
    ] = await Promise.all([
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_TODAS),
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_PROPIAS),
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_PENDIENTES),
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_APROBADAS),
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_RECHAZADAS),
      hasPermission(PERMISOS.SOLCOM_FILTRO_VER_FINALIZADAS)
    ]);

    // Si tiene permiso de ver todas, no aplicar ningún filtro
    if (verTodas) {
      return;
    }

    // Obtener los IDs de los estados
    const estados = await this.estadoComprasRepository.find({
      where: { tipo: 'SOLCOM' }
    });

    const estadoMap = new Map(estados.map(e => [e.codigo, e.id]));

    // Por defecto no se ve nada, cada permiso agrega un OR
    qb.andWhere(new Brackets((whereQb) => {
      let tieneAlgunaCondicion = false;

      // Ver mis propias SOLCOM (usuarioSolicitanteId)
      if (verPropias) {
        whereQb.orWhere('solcom.usuario_solicitante = :usuarioId', { usuarioId: user.uid });
        tieneAlgunaCondicion = true;
      }

      // Ver SOLCOM pendientes (estado SOLC_INI)
      if (verPendientes) {
        const estadoId = estadoMap.get(ESTADO_SOLCOM_CODIGOS.SOLC_INI);
        if (estadoId) {
          whereQb.orWhere('solcom.estadoId = :estadoPendiente', { estadoPendiente: estadoId });
          tieneAlgunaCondicion = true;
        }
      }

      // Ver SOLCOM aprobadas (estado SOLC_AP)
      if (verAprobadas) {
        const estadoId = estadoMap.get(ESTADO_SOLCOM_CODIGOS.SOLC_AP);
        if (estadoId) {
          whereQb.orWhere('solcom.estadoId = :estadoAprobada', { estadoAprobada: estadoId });
          tieneAlgunaCondicion = true;
        }
      }

      // Ver SOLCOM rechazadas (estado SOLC_RECH)
      if (verRechazadas) {
        const estadoId = estadoMap.get(ESTADO_SOLCOM_CODIGOS.SOLC_RECH);
        if (estadoId) {
          whereQb.orWhere('solcom.estadoId = :estadoRechazada', { estadoRechazada: estadoId });
          tieneAlgunaCondicion = true;
        }
      }

      // Ver SOLCOM finalizadas (estado SOLC_FIN)
      if (verFinalizadas) {
        const estadoId = estadoMap.get(ESTADO_SOLCOM_CODIGOS.SOLC_FIN);
        if (estadoId) {
          whereQb.orWhere('solcom.estadoId = :estadoFinalizada', { estadoFinalizada: estadoId });
          tieneAlgunaCondicion = true;
        }
      }

      // Si no tiene ningún permiso, agregar condición imposible (no ve nada)
      if (!tieneAlgunaCondicion) {
        whereQb.where('1 = 0');
      }
    }));
  }

  async generatePdf(id: number, descripcionPdf: string): Promise<Buffer> {
    const solcom = await this.solcomRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.inventario',
        'items.inventarioConversion',
        'estado',
        'usuarioSolicitante',
      ],
    });

    if (!solcom) {
      throw new NotFoundException(`SOLCOM con ID ${id} no encontrada`);
    }

    // Preparar items para el PDF
    const items = solcom.items?.map(item => {
      const cantidad = parseFloat(item.cantidad || '0');
      // Determinar la presentación (unidad de medida)
      let presentacion = item.inventario?.unidadMedida || '';
      if (item.inventarioConversion?.unidadOrigen) {
        presentacion = item.inventarioConversion.unidadOrigen;
      }

      return {
        nombre: item.inventario?.nombre || '',
        presentacion: presentacion,
        cantidad: cantidad.toFixed(2),
        descripcion: item.descripcion || '',
      };
    }) || [];

    // Construir nombre del presupuesto con el formato apropiado

    const data = {
      id: solcom.id,
      numeroSolcom: String(solcom.id).padStart(11, '0'),
      fechaCreacion: solcom.fechaCreacion || '',
      usuarioSolicitante: solcom.usuarioSolicitante?.nombre || '',
      descripcionPdf: descripcionPdf || '',
      items,
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
    };

    return await this.pdfExportService.generatePdf('solcom', data);
  }
}
