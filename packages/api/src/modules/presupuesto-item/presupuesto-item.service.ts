


import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreatePresupuestoItemDto } from './dto/create-presupuesto-item.dto';
import { UpdatePresupuestoItemDto } from './dto/update-presupuesto-item.dto';
import { PresupuestoItem } from './entities/presupuesto-item.entity';
import { buildWhereAndOrderQuery, transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PresupuestoItemService {
  constructor(
    @InjectRepository(PresupuestoItem)
    private presupuestoItemRepository: Repository<PresupuestoItem>,
  ) { }

  async create(createPresupuestoItemDto: CreatePresupuestoItemDto) {
    return await this.presupuestoItemRepository.save(createPresupuestoItemDto);
  }

  async findAll(conditions: FindManyOptions<PresupuestoItem>): Promise<PresupuestoItem[]> {
    const qb = this.presupuestoItemRepository.createQueryBuilder('inventario-reservas');
    const relaciones = ['presupuesto'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario-reservas.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'inventario-reservas');
    const presupuestos = await qb.getMany();


    return presupuestos;
  }
  async findOne(id: number) {
    return await this.presupuestoItemRepository.findOneBy({ id });
  }

  async update(id: number, updatePresupuestoItemDto: UpdatePresupuestoItemDto) {
    await this.presupuestoItemRepository.update({ id }, updatePresupuestoItemDto);
    return await this.presupuestoItemRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const presupuestoItem = await this.findOne(id);

    await this.presupuestoItemRepository.delete({ id });
    return presupuestoItem
  }
}
