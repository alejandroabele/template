


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateInventarioCategoriaDto } from './dto/create-inventario-categoria.dto';
import { UpdateInventarioCategoriaDto } from './dto/update-inventario-categoria.dto';
import { InventarioCategoria } from './entities/inventario-categoria.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventarioCategoriaService {
  constructor(
    @InjectRepository(InventarioCategoria)
    private inventarioReservaRepository: Repository<InventarioCategoria>,
  ) { }

  async create(createInventarioCategoriaDto: CreateInventarioCategoriaDto) {
    return await this.inventarioReservaRepository.save(createInventarioCategoriaDto);

  }

  async findAll(conditions: FindManyOptions<InventarioCategoria>): Promise<InventarioCategoria[]> {
    const qb = this.inventarioReservaRepository.createQueryBuilder('inventario-categoria');
    const relaciones = ['inventarioFamilia'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario-categoria.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'inventario-categoria');
    const presupuestos = await qb.getMany();


    return presupuestos;
  }
  async findOne(id: number) {
    return await this.inventarioReservaRepository.findOneBy({ id });
  }

  async update(id: number, updateInventarioCategoriaDto: UpdateInventarioCategoriaDto) {
    await this.inventarioReservaRepository.update({ id }, updateInventarioCategoriaDto);
    return await this.inventarioReservaRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.inventarioReservaRepository.delete({ id });
    return inventarioReserva
  }
}
