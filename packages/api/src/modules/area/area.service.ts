import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) { }

  async create(createAreaDto: CreateAreaDto) {
    return await this.areaRepository.save(createAreaDto);
  }

  async findAll(conditions: FindManyOptions<Area>): Promise<Area[]> {
    return await this.areaRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.areaRepository.findOneBy({ id });
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    await this.areaRepository.update({ id }, updateAreaDto);
    return await this.areaRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const alquilerPrecio = await this.findOne(id);

    await this.areaRepository.delete({ id });
    return alquilerPrecio
  }
}
