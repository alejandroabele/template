


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContratoMarcoTalonarioItemDto } from './dto/create-contrato-marco-talonario-item.dto';
import { UpdateContratoMarcoTalonarioItemDto } from './dto/update-contrato-marco-talonario-item.dto';
import { ContratoMarcoTalonarioItem } from './entities/contrato-marco-talonario-item.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContratoMarcoTalonarioItemService {
  constructor(
    @InjectRepository(ContratoMarcoTalonarioItem)
    private contratoMarcoTalonarioItemRepository: Repository<ContratoMarcoTalonarioItem>,
  ) { }

  async create(CreateContratoMarcoTalonarioItemDto: CreateContratoMarcoTalonarioItemDto) {
    return await this.contratoMarcoTalonarioItemRepository.save(CreateContratoMarcoTalonarioItemDto);

  }

  async findAll(conditions: FindManyOptions<ContratoMarcoTalonarioItem>): Promise<ContratoMarcoTalonarioItem[]> {
    const qb = this.contratoMarcoTalonarioItemRepository.createQueryBuilder('contrato-marco-talonario-item');
    const relaciones = ['contratoMarcoTalonario'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`contrato-marco-talonario-item.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'contrato-marco-talonario-item');
    const presupuestos = await qb.getMany();


    return presupuestos;
  }
  async findOne(id: number) {
    return await this.contratoMarcoTalonarioItemRepository.findOne({
      where: { id },
      relations: { contratoMarcoTalonario: true, receta: true },
    });
  }

  async update(id: number, UpdateContratoMarcoTalonarioItemDto: UpdateContratoMarcoTalonarioItemDto) {
    await this.contratoMarcoTalonarioItemRepository.update({ id }, UpdateContratoMarcoTalonarioItemDto);
    return await this.contratoMarcoTalonarioItemRepository.findOne({
      where: { id },
      relations: { contratoMarcoTalonario: true, receta: true },
    });
  }

  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.contratoMarcoTalonarioItemRepository.delete({ id });
    return inventarioReserva
  }
}
