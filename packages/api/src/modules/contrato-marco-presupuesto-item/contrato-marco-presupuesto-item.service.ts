


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContratoMarcoPresupuestoItemDto } from './dto/create-contrato-marco-presupuesto-item.dto';
import { UpdateContratoMarcoPresupuestoItemDto } from './dto/update-contrato-marco-presupuesto-item.dto';
import { ContratoMarcoPresupuestoItem } from './entities/contrato-marco-presupuesto-item.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContratoMarcoPresupuestoItemService {
  constructor(
    @InjectRepository(ContratoMarcoPresupuestoItem)
    private contratoMarcoPresupuestoItemRepository: Repository<ContratoMarcoPresupuestoItem>,
  ) { }

  async create(CreateContratoMarcoPresupuestoItemDto: CreateContratoMarcoPresupuestoItemDto) {
    return await this.contratoMarcoPresupuestoItemRepository.save(CreateContratoMarcoPresupuestoItemDto);
  }

  async findAll(conditions: FindManyOptions<ContratoMarcoPresupuestoItem>): Promise<ContratoMarcoPresupuestoItem[]> {
    const qb = this.contratoMarcoPresupuestoItemRepository.createQueryBuilder('contrato-marco-presupuesto-item');
    const relaciones = ['contratoMarcoPresupuesto', 'contratoMarcoTalonarioItem'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`contrato-marco-presupuesto-item.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'contrato-marco-presupuesto-item');
    const presupuestos = await qb.getMany();

    return presupuestos;
  }
  async findOne(id: number) {
    return await this.contratoMarcoPresupuestoItemRepository.findOne({
      where: { id },
      relations: {
        contratoMarcoPresupuesto: true,
        contratoMarcoTalonarioItem: true
      },
    });
  }

  async update(id: number, UpdateContratoMarcoPresupuestoItemDto: UpdateContratoMarcoPresupuestoItemDto) {
    await this.contratoMarcoPresupuestoItemRepository.update({ id }, UpdateContratoMarcoPresupuestoItemDto);
    return await this.contratoMarcoPresupuestoItemRepository.findOne({
      where: { id },
      relations: {
        contratoMarcoPresupuesto: true,
        contratoMarcoTalonarioItem: true
      },
    });
  }

  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.contratoMarcoPresupuestoItemRepository.delete({ id });
    return inventarioReserva
  }
}
