import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashflowSimulacion } from './entities/cashflow-simulacion.entity';
import { CashflowSimulacionTransaccion } from './entities/cashflow-simulacion-transaccion.entity';
import { CashflowTransaccion } from '@/modules/cashflow-transaccion/entities/cashflow-transaccion.entity';
import { CreateCashflowSimulacionDto } from './dto/create-cashflow-simulacion.dto';
import { UpdateCashflowSimulacionDto } from './dto/update-cashflow-simulacion.dto';

@Injectable()
export class CashflowSimulacionService {
    constructor(
        @InjectRepository(CashflowSimulacion)
        private readonly simulacionRepository: Repository<CashflowSimulacion>,
        @InjectRepository(CashflowSimulacionTransaccion)
        private readonly transaccionRepository: Repository<CashflowSimulacionTransaccion>,
        @InjectRepository(CashflowTransaccion)
        private readonly cashflowTransaccionRepository: Repository<CashflowTransaccion>,
    ) {}

    async create(dto: CreateCashflowSimulacionDto): Promise<CashflowSimulacion> {
        const simulacion = this.simulacionRepository.create(dto);
        const saved = await this.simulacionRepository.save(simulacion);

        if (dto.tipo === 'desde_actual') {
            await this.copiarSnapshotActual(saved.id);
        }

        return saved;
    }

    async findAll(): Promise<CashflowSimulacion[]> {
        return this.simulacionRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<CashflowSimulacion> {
        const simulacion = await this.simulacionRepository.findOne({ where: { id } });
        if (!simulacion) {
            throw new NotFoundException(`Simulación ${id} no encontrada`);
        }
        return simulacion;
    }

    async update(id: number, dto: UpdateCashflowSimulacionDto): Promise<CashflowSimulacion> {
        await this.findOne(id);
        await this.simulacionRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.simulacionRepository.delete(id);
    }

    private async copiarSnapshotActual(simulacionId: number): Promise<void> {
        const transacciones = await this.cashflowTransaccionRepository.find();

        if (transacciones.length === 0) return;

        const copias = transacciones.map((t) =>
            this.transaccionRepository.create({
                simulacionId,
                categoriaId: t.categoriaId,
                fecha: t.fecha,
                monto: t.monto,
                descripcion: t.descripcion,
                bancoId: t.bancoId,
                conciliado: t.conciliado,
            }),
        );

        await this.transaccionRepository.save(copias);
    }
}
