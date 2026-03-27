import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCashflowCategoriaDto } from './dto/create-cashflow-categoria.dto';
import { UpdateCashflowCategoriaDto } from './dto/update-cashflow-categoria.dto';
import { CashflowCategoria } from './entities/cashflow-categoria.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class CashflowCategoriaService {
  constructor(
    @InjectRepository(CashflowCategoria)
    private cashflowCategoriaRepository: Repository<CashflowCategoria>,
  ) { }

  async create(createCashflowCategoriaDto: CreateCashflowCategoriaDto) {
    return await this.cashflowCategoriaRepository.save(createCashflowCategoriaDto);
  }

  async findAll(conditions: FindManyOptions<CashflowCategoria>): Promise<CashflowCategoria[]> {
    return await this.cashflowCategoriaRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) });
  }

  async findOne(id: number) {
    return await this.cashflowCategoriaRepository.findOneBy({ id });
  }

  async update(id: number, updateCashflowCategoriaDto: UpdateCashflowCategoriaDto) {
    await this.cashflowCategoriaRepository.update({ id }, updateCashflowCategoriaDto);
    return await this.cashflowCategoriaRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const cashflowCategoria = await this.findOne(id);
    if (!cashflowCategoria.protegida) {
      await this.cashflowCategoriaRepository.delete({ id });
    }
    return cashflowCategoria;
  }
}
