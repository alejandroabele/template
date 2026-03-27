import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { MovimientoInventario } from '@/modules/movimiento-inventario/entities/movimiento-inventario.entity';
import { MovimientoInventarioService } from '@/modules/movimiento-inventario/movimiento-inventario.service';
import { TIPO_MOVIMIENTO } from '@/constants/inventario';
import { MovimientoHerramientaDto } from './dto/movimiento-herramienta.dto';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';

@Injectable()
export class HerramientaService {
    constructor(
        @InjectRepository(Inventario)
        private inventarioRepository: Repository<Inventario>,
        @InjectRepository(MovimientoInventario)
        private movimientoRepository: Repository<MovimientoInventario>,
        private movimientoService: MovimientoInventarioService,
    ) { }

    async findAll(conditions: FindManyOptions<Inventario>) {
        const qb = this.inventarioRepository
            .createQueryBuilder('inventario')
            .where('inventario.es_herramienta = :esHerramienta', { esHerramienta: true });

        buildWhereAndOrderQuery(qb, conditions, 'inventario');

        const herramientas = await qb.getMany();

        return Promise.all(herramientas.map(async (h) => ({
            ...h,
            prestadas: await this.calcularPrestadas(h.id),
        })));
    }

    async findOne(id: number) {
        const herramienta = await this.inventarioRepository.findOne({ where: { id, esHerramienta: true } });
        if (!herramienta) throw new Error('Herramienta no encontrada');

        const prestamosActivos = await this.getPrestamosActivosPorHerramienta(id);
        return { ...herramienta, prestamosActivos };
    }

    async getHistorial(id: number) {
        return this.movimientoRepository.find({
            where: [
                { productoId: id, tipoMovimiento: TIPO_MOVIMIENTO.PRESTAMO },
                { productoId: id, tipoMovimiento: TIPO_MOVIMIENTO.DEVOLUCION },
            ],
            relations: ['persona'],
            order: { fecha: 'DESC' },
        });
    }

    async getPrestamosActivos() {
        const movimientos = await this.movimientoRepository
            .createQueryBuilder('m')
            .select('m.producto_id', 'productoId')
            .addSelect('m.persona_id', 'personaId')
            .addSelect(
                `SUM(CASE WHEN m.tipo_movimiento = 'PRESTAMO' THEN m.cantidad ELSE -m.cantidad END)`,
                'cantidad'
            )
            .addSelect('MIN(CASE WHEN m.tipo_movimiento = \'PRESTAMO\' THEN m.fecha END)', 'fechaPrestamo')
            .where('m.tipo_movimiento IN (:...tipos)', { tipos: [TIPO_MOVIMIENTO.PRESTAMO, TIPO_MOVIMIENTO.DEVOLUCION] })
            .groupBy('m.producto_id')
            .addGroupBy('m.persona_id')
            .having('SUM(CASE WHEN m.tipo_movimiento = \'PRESTAMO\' THEN m.cantidad ELSE -m.cantidad END) > 0')
            .getRawMany();

        const productoIds = [...new Set(movimientos.map(m => Number(m.productoId)))];
        const personaIds = [...new Set(movimientos.map(m => Number(m.personaId)))];

        const [herramientas, personas] = await Promise.all([
            productoIds.length > 0
                ? this.inventarioRepository.findByIds(productoIds)
                : Promise.resolve([]),
            personaIds.length > 0
                ? this.movimientoRepository.manager.getRepository('Persona').findByIds(personaIds)
                : Promise.resolve([]),
        ]);

        const herramientaMap = new Map(herramientas.map((h: any) => [h.id, h]));
        const personaMap = new Map((personas as any[]).map((p: any) => [p.id, p]));

        return movimientos.map(m => ({
            herramienta: herramientaMap.get(Number(m.productoId)),
            persona: personaMap.get(Number(m.personaId)),
            cantidad: Number(m.cantidad),
            fechaPrestamo: m.fechaPrestamo,
        }));
    }

    async registrarMovimiento(id: number, dto: MovimientoHerramientaDto) {
        const herramienta = await this.inventarioRepository.findOne({ where: { id } });
        if (!herramienta) throw new Error('Herramienta no encontrada');
        if (!herramienta.esHerramienta) throw new Error('El item no es una herramienta prestable');

        const motivo = dto.tipo === TIPO_MOVIMIENTO.PRESTAMO
            ? 'Préstamo de herramienta'
            : 'Devolución de herramienta';

        return this.movimientoService.create({
            tipoMovimiento: dto.tipo,
            productoId: id,
            producto: herramienta,
            personaId: dto.personaId,
            cantidad: dto.cantidad,
            motivo,
            observaciones: dto.observaciones,
        });
    }

    private async calcularPrestadas(productoId: number): Promise<number> {
        const result = await this.movimientoRepository
            .createQueryBuilder('m')
            .select(
                `SUM(CASE WHEN m.tipo_movimiento = 'PRESTAMO' THEN m.cantidad ELSE -m.cantidad END)`,
                'total'
            )
            .where('m.producto_id = :productoId', { productoId })
            .andWhere('m.tipo_movimiento IN (:...tipos)', { tipos: [TIPO_MOVIMIENTO.PRESTAMO, TIPO_MOVIMIENTO.DEVOLUCION] })
            .getRawOne();

        return Math.max(0, Number(result?.total ?? 0));
    }

    private async getPrestamosActivosPorHerramienta(productoId: number) {
        const movimientos = await this.movimientoRepository
            .createQueryBuilder('m')
            .select('m.persona_id', 'personaId')
            .addSelect(
                `SUM(CASE WHEN m.tipo_movimiento = 'PRESTAMO' THEN m.cantidad ELSE -m.cantidad END)`,
                'cantidad'
            )
            .addSelect('MIN(CASE WHEN m.tipo_movimiento = \'PRESTAMO\' THEN m.fecha END)', 'fechaPrestamo')
            .where('m.producto_id = :productoId', { productoId })
            .andWhere('m.tipo_movimiento IN (:...tipos)', { tipos: [TIPO_MOVIMIENTO.PRESTAMO, TIPO_MOVIMIENTO.DEVOLUCION] })
            .groupBy('m.persona_id')
            .having('SUM(CASE WHEN m.tipo_movimiento = \'PRESTAMO\' THEN m.cantidad ELSE -m.cantidad END) > 0')
            .getRawMany();

        const personaIds = movimientos.map(m => Number(m.personaId)).filter(Boolean);
        const personas = personaIds.length > 0
            ? await this.movimientoRepository.manager.getRepository('Persona').findByIds(personaIds)
            : [];
        const personaMap = new Map((personas as any[]).map((p: any) => [p.id, p]));

        return movimientos.map(m => ({
            persona: personaMap.get(Number(m.personaId)),
            cantidad: Number(m.cantidad),
            fechaPrestamo: m.fechaPrestamo,
        }));
    }
}
