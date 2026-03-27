import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContratoMarco } from './entities/contrato-marco.entity';
import { ContratoMarcoPresupuesto } from '@/modules/contrato-marco-presupuesto/entities/contrato-marco-presupuesto.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';

@Injectable()
export class ContratoMarcoReportesService {
    constructor(
        @InjectRepository(ContratoMarco)
        private readonly contratoMarcoRepository: Repository<ContratoMarco>,
        @InjectRepository(ContratoMarcoPresupuesto)
        private readonly contratoMarcoPresupuestoRepository: Repository<ContratoMarcoPresupuesto>,
        @InjectRepository(Presupuesto)
        private readonly presupuestoRepository: Repository<Presupuesto>,
    ) { }

    async getEstadoConsumo(id: number): Promise<any> {
        // Traer el contrato marco
        const contrato = await this.contratoMarcoRepository.findOne({
            where: { id },
        });

        if (!contrato) {
            throw new Error(`Contrato marco con id ${id} no encontrado`);
        }

        const montoContrato = parseFloat(contrato.monto ?? '0');

        // Sumar ventaTotal de todos los presupuestos asociados
        const { consumido } = await this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .innerJoin(ContratoMarcoPresupuesto, 'cmp', 'cmp.presupuestoId = presupuesto.id')
            .where('cmp.contratoMarcoId = :id', { id })
            .select('COALESCE(SUM(presupuesto.ventaTotal), 0)', 'consumido')
            .getRawOne<{ consumido: string }>();

        const consumidoNum = parseFloat(consumido);

        return {
            contratoId: id,
            montoContrato,
            consumido: consumidoNum,
            saldo: montoContrato - consumidoNum,
            porcentajeConsumido:
                montoContrato > 0 ? (consumidoNum / montoContrato) * 100 : 0,
        };
    }
    async getOrdenesPorTipo(id: number): Promise<any> {
        const resultados = await this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .innerJoin(
                ContratoMarcoPresupuesto,
                'cmp',
                'cmp.presupuestoId = presupuesto.id',
            )
            .where('cmp.contratoMarcoId = :id', { id })
            .select('cmp.tipo', 'tipo')
            .addSelect('COALESCE(SUM(presupuesto.ventaTotal),0)', 'total')
            .groupBy('cmp.tipo')
            .getRawMany<{ tipo: string; total: string }>()

        // Mapear resultados a formato limpio
        return resultados.map((r) => ({
            tipo: r.tipo,
            total: parseFloat(r.total),
        }))
    }
}
