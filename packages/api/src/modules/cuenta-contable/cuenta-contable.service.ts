import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCuentaContableDto } from './dto/create-cuenta-contable.dto';
import { UpdateCuentaContableDto } from './dto/update-cuenta-contable.dto';
import { CuentaContable } from './entities/cuenta-contable.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class CuentaContableService {
  constructor(
    @InjectRepository(CuentaContable)
    private cuentaContableRepository: Repository<CuentaContable>,
  ) { }

  async create(createCuentaContableDto: CreateCuentaContableDto) {
    const cuentaContable = this.cuentaContableRepository.create(createCuentaContableDto);
    return this.cuentaContableRepository.save(cuentaContable);
  }

  async findAll(conditions: FindManyOptions<CuentaContable>): Promise<CuentaContable[]> {
    return this.cuentaContableRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
    });
  }

  async findOne(id: number) {
    return this.cuentaContableRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCuentaContableDto: UpdateCuentaContableDto) {
    await this.cuentaContableRepository.update({ id }, updateCuentaContableDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cuentaContable = await this.findOne(id);
    await this.cuentaContableRepository.delete({ id });
    return cuentaContable;
  }
}
