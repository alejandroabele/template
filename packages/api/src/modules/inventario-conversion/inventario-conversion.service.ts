


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateInventarioConversionDto } from './dto/create-inventario-conversion.dto';
import { UpdateInventarioConversionDto } from './dto/update-inventario-conversion.dto';
import { InventarioConversion } from './entities/inventario-conversion.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from '../inventario/entities/inventario.entity';

@Injectable()
export class InventarioConversionService {
  constructor(
    @InjectRepository(InventarioConversion)
    private inventarioConversionRepository: Repository<InventarioConversion>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) { }

  async create(createInventarioConversionDto: CreateInventarioConversionDto) {
    return await this.inventarioConversionRepository.save(createInventarioConversionDto);

  }

  async findAll(conditions: FindManyOptions<InventarioConversion> & { search?: string }): Promise<InventarioConversion[]> {
    const qb = this.inventarioConversionRepository.createQueryBuilder('inventario-conversion');
    const relaciones = ['inventario'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario-conversion.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'inventario-conversion');
    const presupuestos = await qb.getMany();

    if (conditions.search === 'list' && !Array.isArray(conditions.where) && conditions.where.inventarioId) {
      const inventario = await this.inventarioRepository.findOneBy({ id: conditions.where.inventarioId })
      if (inventario.unidadMedida) {
        const unidadActual = {
          unidadOrigen: inventario.unidadMedida,
          cantidad: 1,
          id: 0,
          unidadDestino: inventario.unidadMedida,

        }
        presupuestos.unshift(unidadActual as any)
      }
    }

    return presupuestos;
  }
  async findOne(id: number) {
    return await this.inventarioConversionRepository.findOne({
      where: { id },
      relations: ['inventario'],
    });
  }

  async update(id: number, updateInventarioConversionDto: UpdateInventarioConversionDto) {
    await this.inventarioConversionRepository.update({ id }, updateInventarioConversionDto);
    return await this.inventarioConversionRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const inventarioConversion = await this.findOne(id);

    await this.inventarioConversionRepository.delete({ id });
    return inventarioConversion
  }
}
