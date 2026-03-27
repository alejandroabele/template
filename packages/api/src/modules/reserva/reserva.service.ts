import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { ReservaItem } from './entities/reserva-item.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InventarioReserva } from '../inventario-reservas/entities/inventario-reserva.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InventarioService } from '../inventario/inventario.service';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';
import { TIPO_MOVIMIENTO } from '@/constants/inventario';
import { EgresoMasivoDto } from '../movimiento-inventario/dto/egreso-masivo.dto';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { Persona } from '../persona/entities/persona.entity';


@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,
        @InjectRepository(ReservaItem)
        private reservaItemRepository: Repository<ReservaItem>,
        @InjectRepository(InventarioReserva)
        private inventarioReservaRepository: Repository<InventarioReserva>,
        @InjectRepository(Persona)
        private personaRepository: Repository<Persona>,
        @InjectRepository(Presupuesto)
        private presupuestoRepository: Repository<Presupuesto>,
        @InjectRepository(Inventario)
        private inventarioRepository: Repository<Inventario>,
        private inventarioService: InventarioService,
        private pdfExportService: PdfExportService,
        private movimientoInventarioService: MovimientoInventarioService,
    ) { }

    async create(createReservaDto: CreateReservaDto) {
        // Validar stock de cada producto considerando reservas existentes
        const validacionesStock = await this.inventarioService.validarDisponibilidadConReservas(
            createReservaDto.items
        );

        // Si hay errores de stock, lanzar excepción con detalle
        const itemsConError = validacionesStock.filter(v => !v.disponible);
        if (itemsConError.length > 0) {
            throw new BadRequestException({
                message: 'Stock insuficiente para algunos productos',
                errores: itemsConError.map(item => ({
                    productoId: item.productoId,
                    nombre: item.nombre,
                    cantidadSolicitada: item.cantidadSolicitada,
                    stockActual: item.stockActual,
                    stockReservado: item.stockReservado,
                    stockDisponible: item.stockDisponible,
                })),
            });
        }

        // Crear la reserva
        const reserva = await this.reservaRepository.save({
            observaciones: createReservaDto.observaciones,
            presupuestoId: createReservaDto.presupuestoId,
            trabajoId: createReservaDto.trabajoId,
            centroCostoId: createReservaDto.centroCostoId,
            personaId: createReservaDto.personaId,
        });

        // Crear los items de la reserva usando el servicio de movimientos
        for (const item of createReservaDto.items) {
            // Obtener el producto para pasarlo al movimiento
            //const producto = await this.inventarioService.findOne(item.productoId);

            // Crear movimiento de tipo RESERVA
            // Esto creará automáticamente el inventario_reserva y retorna el movimiento
            const movimiento = await this.movimientoInventarioService.create({
                tipoMovimiento: TIPO_MOVIMIENTO.RESERVA,
                motivo: 'Reserva de material',
                cantidad: item.cantidad,
                productoId: item.productoId,
                presupuestoId: createReservaDto.presupuestoId,
                trabajoId: createReservaDto.trabajoId,
                observaciones: item.observaciones,
                reservaId: reserva.id,
                personaId: createReservaDto.personaId,
                centroCostoId: createReservaDto.centroCostoId,

            });

            // El movimiento ya tiene el inventarioReservaId creado
            // Buscar el inventario_reserva para actualizarlo con el reservaId



            // Crear el reserva_item vinculado al inventario_reserva
            await this.reservaItemRepository.save({
                reservaId: reserva.id,
                productoId: item.productoId,
                cantidad: item.cantidad,
                observaciones: item.observaciones,
                inventarioReservaId: movimiento.inventarioReservaId,
            });
        }

        // Retornar reserva con sus items
        return await this.findOne(reserva.id);
    }


    async findAll(conditions: FindManyOptions<Reserva>): Promise<Reserva[]> {
        const qb = this.reservaRepository.createQueryBuilder('reserva');

        qb.leftJoinAndSelect('reserva.items', 'items');
        qb.leftJoinAndSelect('items.producto', 'producto');
        qb.leftJoinAndSelect('reserva.movimientos', 'movimientos');
        qb.leftJoinAndSelect('reserva.createdByUser', 'createdByUser');
        qb.leftJoinAndSelect('reserva.presupuesto', 'presupuesto');
        qb.leftJoinAndSelect('reserva.trabajo', 'trabajo');
        qb.leftJoinAndSelect('reserva.centroCosto', 'centroCosto');
        qb.leftJoinAndSelect('reserva.persona', 'persona');

        buildWhereAndOrderQuery(qb, conditions, 'reserva');

        const reservas = await qb.getMany();

        // Calcular cantidadUsada para cada item
        reservas.forEach(reserva => {
            if (reserva.items) {
                reserva.items.forEach(item => {
                    // Sumar movimientos de tipo OUT para este producto
                    item.cantidadUsada = reserva.movimientos
                        ?.filter(m =>
                            m.tipoMovimiento === TIPO_MOVIMIENTO.OUT &&
                            m.productoId === item.productoId &&
                            !m.deletedAt
                        )
                        .reduce((sum, m) => Number(sum) + Number(m.cantidad ?? 0), 0) || 0;
                });
            }
        });

        return reservas;
    }

    async findOne(id: number) {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['items', 'items.producto', 'items.producto.reservas', 'items.inventarioReserva', 'movimientos', 'createdByUser', 'presupuesto', 'trabajo', 'centroCosto', 'persona'],
            withDeleted: true
        });

        // Calcular cantidadUsada para cada item
        if (reserva?.items) {
            reserva.items.forEach(item => {
                // Sumar movimientos de tipo OUT para este producto
                item.cantidadUsada = reserva.movimientos
                    ?.filter(m =>
                        m.tipoMovimiento === TIPO_MOVIMIENTO.OUT &&
                        m.productoId === item.productoId &&
                        !m.deletedAt
                    )
                    .reduce((sum, m) => Number(sum) + Number(m.cantidad ?? 0), 0) || 0;
            });
        }

        return reserva;
    }

    async remove(id: number) {
        const reserva = await this.findOne(id);

        // Eliminar primero los inventario_reservas con este reservaId
        await this.inventarioReservaRepository.delete({ reservaId: id });

        // Eliminar los reserva_item
        await this.reservaItemRepository.delete({ reservaId: id });

        // Eliminar la reserva
        await this.reservaRepository.delete({ id });

        return reserva;
    }

    async generatePdf(id: number): Promise<Buffer> {
        const reserva = await this.findOne(id);
        if (!reserva) {
            throw new BadRequestException('Reserva no encontrada');
        }

        const data = {
            appName: 'PinteCRM',
            publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
            id: reserva.id,
            fecha: reserva.fecha ? new Date(reserva.fecha).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR'),
            fechaGeneracion: new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR'),
            presupuesto: reserva.presupuesto,
            trabajo: reserva.trabajo,
            centroCosto: reserva.centroCosto,
            persona: reserva.persona,
            items: reserva.items,
            observaciones: reserva.observaciones,
            createdByUser: reserva.createdByUser,
        };

        return this.pdfExportService.generatePdf('detalle-reserva', data);
    }

    async generatePdfEgresoOt(dto: EgresoMasivoDto): Promise<Buffer> {
        const { presupuestoId, personaId, productos } = dto;

        const [presupuesto, persona] = await Promise.all([
            presupuestoId
                ? this.presupuestoRepository.findOne({ where: { id: presupuestoId }, relations: ['cliente'] })
                : null,
            personaId
                ? this.personaRepository.findOne({ where: { id: personaId } })
                : null,
        ]);

        const items = await Promise.all(
            productos.map(async (p) => {
                const producto = await this.inventarioRepository.findOne({ where: { id: p.productoId } });
                return { producto, cantidad: p.cantidad };
            })
        );

        const data = {
            appName: 'PinteCRM',
            publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
            fecha: new Date().toLocaleDateString('es-AR'),
            presupuesto,
            persona,
            items,
        };

        return this.pdfExportService.generatePdf('detalle-reserva', data);
    }
}
