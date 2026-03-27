import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateIndiceDto } from './dto/create-indice.dto';
import { UpdateIndiceDto } from './dto/update-indice.dto';
import { Indice } from './entities/indice.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IndiceService {
  constructor(
    @InjectRepository(Indice)
    private indiceRepository: Repository<Indice>,
  ) { }

  async create(createAreaDto: CreateIndiceDto) {
    return await this.indiceRepository.save(createAreaDto);
  }

  async findAll(conditions: FindManyOptions<Indice>): Promise<Indice[]> {
    return await this.indiceRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.indiceRepository.findOneBy({ id });
  }

  async update(id: number, updateAreaDto: UpdateIndiceDto) {
    await this.indiceRepository.update({ id }, updateAreaDto);
    return await this.indiceRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
