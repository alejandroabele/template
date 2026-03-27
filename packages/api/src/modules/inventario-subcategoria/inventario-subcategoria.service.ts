import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInventarioSubcategoriaDto } from './dto/create-inventario-subcategoria.dto';
import { UpdateInventarioSubcategoriaDto } from './dto/update-inventario-subcategoria.dto';
import { InventarioSubcategoria } from './entities/inventario-subcategoria.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';

@Injectable()
export class InventarioSubcategoriaService {
  constructor(
    @InjectRepository(InventarioSubcategoria)
    private inventarioSubcategoriaRepository: Repository<InventarioSubcategoria>,
  ) { }

  async create(createInventarioSubcategoriaDto: CreateInventarioSubcategoriaDto) {
    return await this.inventarioSubcategoriaRepository.save(createInventarioSubcategoriaDto);
  }

  async findAll(conditions: FindManyOptions<InventarioSubcategoria>): Promise<InventarioSubcategoria[]> {
    const qb = this.inventarioSubcategoriaRepository.createQueryBuilder('inventario-subcategoria');
    const relaciones = ['inventarioCategoria'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario-subcategoria.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'inventario-subcategoria');
    return await qb.getMany();
  }

  async findOne(id: number) {
    return await this.inventarioSubcategoriaRepository.findOneBy({ id });
  }

  async update(id: number, updateInventarioSubcategoriaDto: UpdateInventarioSubcategoriaDto) {
    return await this.inventarioSubcategoriaRepository.update(id, updateInventarioSubcategoriaDto);
  }

  async remove(id: number) {
    return await this.inventarioSubcategoriaRepository.delete(id);
  }
}
