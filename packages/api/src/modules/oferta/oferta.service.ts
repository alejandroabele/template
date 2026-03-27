import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { Oferta } from './entities/oferta.entity';
import { OfertaItem } from './entities/oferta-item.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { OfertaAprobacionService } from '../oferta-aprobacion/oferta-aprobacion.service';
import { AprobacionOfertaTipo } from '../oferta-aprobacion/entities/aprobacion-oferta-tipo.entity';
import { ESTADO_OFERTA_CODIGOS } from '@/constants/compras';
import { ConfigService } from '../config/config.service';
import { CONFIGURACIONES } from '@/constants/config';
import { SolcomItem } from '../solcom/entities/solcom-item.entity';
@Injectable()
export class OfertaService {
    constructor(
        @InjectRepository(Oferta)
        private ofertaRepository: Repository<Oferta>,
        @InjectRepository(OfertaItem)
        private ofertaItemRepository: Repository<OfertaItem>,
        @InjectRepository(SolcomItem)
        private solcomItemRepository: Repository<SolcomItem>,
        @InjectRepository(EstadoCompras)
        private estadoComprasRepository: Repository<EstadoCompras>,
        @InjectRepository(Archivo)
        private archivoRepository: Repository<Archivo>,
        @InjectRepository(AprobacionOfertaTipo)
        private aprobacionOfertaTipoRepository: Repository<AprobacionOfertaTipo>,
        private ofertaAprobacionService: OfertaAprobacionService,
        private configService: ConfigService,
    ) { }

    async create(createOfertaDto: CreateOfertaDto) {
        // Buscar el estado OF_INICIADA
        const estadoInicial = await this.estadoComprasRepository.findOne({
            where: { codigo: ESTADO_OFERTA_CODIGOS.OF_INICIADA, tipo: 'OFERTA' }
        });

        const ofertaData = {
            ...createOfertaDto,
            estadoId: estadoInicial?.id,
        };

        // Separar items del resto de datos
        const { items, ...ofertaMainData } = ofertaData;

        // Crear la oferta
        const oferta = this.ofertaRepository.create(ofertaMainData);
        const savedOferta = await this.ofertaRepository.save(oferta);

        // Si hay items, crearlos (ahora cada item tiene solcomItemId)
        if (items && items.length > 0) {
            const ofertaItems = items.map(item =>
                this.ofertaItemRepository.create({
                    ...item,
                    ofertaId: savedOferta.id,
                })
            );
            await this.ofertaItemRepository.save(ofertaItems);
        }

        // Crear automáticamente todas las aprobaciones pendientes
        const tiposAprobacion = await this.aprobacionOfertaTipoRepository.find();
        if (tiposAprobacion && tiposAprobacion.length > 0) {
            const aprobaciones = tiposAprobacion.map((tipo: AprobacionOfertaTipo) => ({
                ofertaId: savedOferta.id,
                ofertaAprobacionTipoId: tipo.id,
                aprobadorId: null,
                motivo: null,
            }));
            await this.ofertaAprobacionService.createBulk(aprobaciones);
        }

        // Retornar la oferta completa con sus items
        return this.findOne(savedOferta.id);
    }

    async findAll(conditions: FindManyOptions<Oferta>): Promise<Oferta[]> {
        const qb = this.ofertaRepository.createQueryBuilder('oferta');

        const relaciones = ['items', 'estado', 'proveedor', 'metodoPago', 'plazoPago', 'ordenCompra', 'aprobaciones', 'createdByUser', 'updatedByUser', 'deletedByUser'];

        for (const relation of relaciones) {
            qb.leftJoinAndSelect(`oferta.${relation}`, relation.split('.').pop());
        }

        // Cargar relaciones de aprobaciones (tipo y aprobador)
        qb.leftJoinAndSelect('aprobaciones.ofertaAprobacionTipo', 'ofertaAprobacionTipo');
        qb.leftJoinAndSelect('aprobaciones.aprobador', 'aprobador');

        // Cargar los solcom items vinculados a través de oferta_item
        qb.leftJoinAndSelect('items.solcomItem', 'solcomItem');
        qb.leftJoinAndSelect('solcomItem.solcom', 'solcom');
        qb.leftJoinAndSelect('solcomItem.inventario', 'solcomItemInventario');
        qb.leftJoinAndSelect('solcomItem.comprador', 'solcomItemComprador');
        qb.leftJoinAndSelect('solcom.estado', 'solcomEstado');
        qb.leftJoinAndSelect('solcom.presupuesto', 'solcomPresupuesto');
        qb.leftJoinAndSelect('solcom.centro', 'solcomCentro');
        qb.leftJoinAndSelect('items.inventario', 'inventario');
        qb.leftJoinAndSelect('items.inventarioConversion', 'inventarioConversion');
        // Aplicar filtros normales
        buildWhereAndOrderQuery(qb, conditions, 'oferta');
        // Aplicar filtro de SOLCOM si existe
        return await qb.getMany();
    }

    async findOne(id: number) {
        // Usar Query Builder para mejor control y optimización
        const qb = this.ofertaRepository
            .createQueryBuilder('oferta')
            .where('oferta.id = :id', { id })
            // Relaciones de oferta
            .leftJoinAndSelect('oferta.items', 'items')
            .leftJoinAndSelect('items.inventario', 'inventario')
            .leftJoinAndSelect('items.inventarioConversion', 'inventarioConversion')
            .leftJoinAndSelect('oferta.estado', 'estado')
            .leftJoinAndSelect('oferta.proveedor', 'proveedor')
            .leftJoinAndSelect('oferta.metodoPago', 'metodoPago')
            .leftJoinAndSelect('oferta.plazoPago', 'plazoPago')
            .leftJoinAndSelect('oferta.createdByUser', 'createdByUser')
            .leftJoinAndSelect('oferta.updatedByUser', 'updatedByUser')
            .leftJoinAndSelect('oferta.deletedByUser', 'deletedByUser')
            // Relaciones de solcom items vinculados a través de oferta_item
            .leftJoinAndSelect('items.solcomItem', 'solcomItem')
            .leftJoinAndSelect('solcomItem.solcom', 'solcom')
            .leftJoinAndSelect('solcomItem.inventario', 'solcomItemInventario')
            .leftJoinAndSelect('solcomItem.inventarioConversion', 'solcomItemInventarioConversion')
            .leftJoinAndSelect('solcomItem.comprador', 'solcomItemComprador')
            .leftJoinAndSelect('solcom.estado', 'solcomEstado')
            .leftJoinAndSelect('solcom.usuarioSolicitante', 'usuarioSolicitante')
            .leftJoinAndSelect('solcom.presupuesto', 'presupuesto')
            .leftJoinAndSelect('solcom.centro', 'centro');

        const oferta = await qb.getOne();

        if (oferta) {
            // Cargar el archivo más reciente de forma separada
            oferta['archivoOferta'] = await this.archivoRepository.findOne({
                where: {
                    modelo: 'oferta',
                    modeloId: oferta.id,
                    tipo: 'oferta'
                },
                order: {
                    id: 'DESC'
                }
            });
        }

        return oferta;
    }

    async update(id: number, updateOfertaDto: UpdateOfertaDto) {
        // Obtener la oferta actual con su estado
        const oferta = await this.ofertaRepository.findOne({
            where: { id },
            relations: ['estado']
        });

        if (!oferta) {
            throw new Error('Oferta no encontrada');
        }

        // Validar que la oferta esté en estado OF_INICIADA o OF_VALIDACION
        const estadosEditables: string[] = [ESTADO_OFERTA_CODIGOS.OF_INICIADA, ESTADO_OFERTA_CODIGOS.OF_VALIDACION];
        const codigoEstado = oferta.estado?.codigo;
        if (!codigoEstado || !estadosEditables.includes(codigoEstado)) {
            throw new Error('Solo se pueden modificar ofertas en estado Iniciada o En Validación');
        }

        const { items, ...ofertaMainData } = updateOfertaDto;

        // Actualizar datos principales de oferta
        await this.ofertaRepository.update({ id }, ofertaMainData);

        // Si hay items, eliminar los anteriores y crear los nuevos
        if (items !== undefined) {
            // Eliminar items anteriores
            await this.ofertaItemRepository.delete({ ofertaId: id });

            // Crear nuevos items (cada uno con su solcomItemId)
            if (items && items.length > 0) {
                const ofertaItems = items.map(item =>
                    this.ofertaItemRepository.create({
                        ...item,
                        ofertaId: id,
                    })
                );
                await this.ofertaItemRepository.save(ofertaItems);
            }
        }

        // Retornar la oferta actualizada
        return this.findOne(id);
    }

    async remove(id: number) {
        const oferta = await this.findOne(id);
        await this.ofertaRepository.delete({ id });
        return oferta;
    }

    /**
     * Envía la oferta a validación (cambia estado a OF_PENDIENTE)
     * Elimina todas las aprobaciones existentes y las crea de nuevo
     * Si el monto total es menor al límite configurado, auto-aprueba la aprobación de gerencia
     */
    async enviarAValidar(id: number) {
        const oferta = await this.findOne(id);

        if (!oferta) {
            throw new Error('Oferta no encontrada');
        }

        // Buscar el estado OF_PENDIENTE
        const estadoPendiente = await this.estadoComprasRepository.findOne({
            where: { codigo: ESTADO_OFERTA_CODIGOS.OF_VALIDACION, tipo: 'OFERTA' }
        });

        if (!estadoPendiente) {
            throw new Error('Estado OF_PENDIENTE no encontrado');
        }

        // Eliminar todas las aprobaciones existentes
        const aprobacionesExistentes = await this.ofertaAprobacionService.findByOferta(id);
        for (const aprobacion of aprobacionesExistentes) {
            await this.ofertaAprobacionService.remove(aprobacion.id);
        }

        // Crear nuevas aprobaciones
        const tiposAprobacion = await this.aprobacionOfertaTipoRepository.find();
        if (tiposAprobacion && tiposAprobacion.length > 0) {
            const aprobaciones = tiposAprobacion.map((tipo: AprobacionOfertaTipo) => ({
                ofertaId: id,
                ofertaAprobacionTipoId: tipo.id,
                aprobadorId: null,
                motivo: null,
            }));
            const aprobacionesCreadas = await this.ofertaAprobacionService.createBulk(aprobaciones);
            // Obtener el límite de monto configurado
            const limiteConfig = await this.configService.getValue(CONFIGURACIONES.ORDEN_COMPRA_LIMITE_MONTO);
            // Si hay un límite configurado y el monto de la oferta es menor, auto-aprobar gerencia
            if (Number(limiteConfig) && oferta.montoTotal && Number(oferta.montoTotal) < Number(limiteConfig)) {
                const tipoAprobacionGerencia = tiposAprobacion.find(tipo => tipo.codigo === 'APROB_GER');
                if (tipoAprobacionGerencia) {
                    const aprobacionGerencia = aprobacionesCreadas.find(
                        a => a.ofertaAprobacionTipoId === tipoAprobacionGerencia.id
                    );
                    await this.ofertaAprobacionService.aprobar(aprobacionGerencia.id, { motivo: `Auto-aprobado` });

                }
            }
        }

        // Actualizar el estado
        await this.ofertaRepository.update({ id }, { estadoId: estadoPendiente.id });

        return this.findOne(id);
    }

    /**
     * Rechaza la oferta (cambia estado a OF_RECHAZADA)
     */
    async rechazar(id: number) {
        const oferta = await this.findOne(id);

        if (!oferta) {
            throw new Error('Oferta no encontrada');
        }

        // Buscar el estado OF_RECHAZADA
        const estadoFin = await this.estadoComprasRepository.findOne({
            where: { codigo: ESTADO_OFERTA_CODIGOS.OF_RECHAZADA, tipo: 'OFERTA' }
        });

        if (!estadoFin) {
            throw new Error('Estado OF_RECHAZADA no encontrado');
        }

        // Actualizar el estado
        await this.ofertaRepository.update({ id }, { estadoId: estadoFin.id });

        return this.findOne(id);
    }
}
