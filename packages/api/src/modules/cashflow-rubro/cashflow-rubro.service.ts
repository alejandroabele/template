import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCashflowRubroDto } from './dto/create-cashflow-rubro.dto';
import { UpdateCashflowRubroDto } from './dto/update-cashflow-rubro.dto';
import { CashflowRubro } from './entities/cashflow-rubro.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class CashflowRubroService {
  constructor(
    @InjectRepository(CashflowRubro)
    private cashflowRubroRepository: Repository<CashflowRubro>,
  ) {}

  async create(createCashflowRubroDto: CreateCashflowRubroDto): Promise<CashflowRubro> {
    return await this.cashflowRubroRepository.save(createCashflowRubroDto);
  }

  async findAll(conditions: FindManyOptions<CashflowRubro> = {}): Promise<CashflowRubro[]> {
    return await this.cashflowRubroRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['categorias'],
    });
  }

  async findOne(id: number): Promise<CashflowRubro> {
    return await this.cashflowRubroRepository.findOne({
      where: { id },
      relations: ['categorias'],
    });
  }

  async update(id: number, updateCashflowRubroDto: UpdateCashflowRubroDto): Promise<CashflowRubro> {
    await this.cashflowRubroRepository.update({ id }, updateCashflowRubroDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<CashflowRubro> {
    const rubro = await this.findOne(id);
    await this.cashflowRubroRepository.delete({ id });
    return rubro;
  }
}
