import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashflowAgrupacion } from './entities/cashflow-agrupacion.entity';
import { CreateCashflowAgrupacionDto } from './dto/create-cashflow-agrupacion.dto';
import { UpdateCashflowAgrupacionDto } from './dto/update-cashflow-agrupacion.dto';

@Injectable()
export class CashflowAgrupacionService {
  constructor(
    @InjectRepository(CashflowAgrupacion)
    private readonly cashflowAgrupacionRepository: Repository<CashflowAgrupacion>,
  ) {}

  async findAll(): Promise<CashflowAgrupacion[]> {
    return this.cashflowAgrupacionRepository.find({
      order: { orden: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CashflowAgrupacion> {
    return this.cashflowAgrupacionRepository.findOne({ where: { id } });
  }

  async create(dto: CreateCashflowAgrupacionDto): Promise<CashflowAgrupacion> {
    const agrupacion = this.cashflowAgrupacionRepository.create(dto);
    return this.cashflowAgrupacionRepository.save(agrupacion);
  }

  async update(id: number, dto: UpdateCashflowAgrupacionDto): Promise<CashflowAgrupacion> {
    await this.cashflowAgrupacionRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<CashflowAgrupacion> {
    const agrupacion = await this.findOne(id);
    await this.cashflowAgrupacionRepository.softDelete(id);
    return agrupacion;
  }
}
