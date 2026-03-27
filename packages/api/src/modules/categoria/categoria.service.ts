import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    return await this.categoriaRepository.save(createCategoriaDto);
  }

  async findAll(conditions: FindManyOptions<Categoria>): Promise<Categoria[]> {
    return await this.categoriaRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.categoriaRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.categoriaRepository.update({ id }, updateCategoriaDto);
    return await this.categoriaRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.categoriaRepository.softDelete(id);
  }
}
