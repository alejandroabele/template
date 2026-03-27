import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCentroCostoDto } from './dto/create-centro-costo.dto';
import { UpdateCentroCostoDto } from './dto/update-centro-costo.dto';
import { CentroCosto } from './entities/centro-costo.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';

@Injectable()
export class CentroCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private centroCostoRepository: Repository<CentroCosto>,
  ) { }

  async create(createCentroCostoDto: CreateCentroCostoDto): Promise<CentroCosto> {
    return await this.centroCostoRepository.save(createCentroCostoDto);
  }

  async findAll(conditions: FindManyOptions<CentroCosto>): Promise<CentroCosto[]> {
    const qb = this.centroCostoRepository.createQueryBuilder('centro-costo')
    buildWhereAndOrderQuery(qb, conditions, 'centro-costo');
    return await qb.getMany();
  }

  async findOne(id: number): Promise<CentroCosto> {
    return await this.centroCostoRepository.findOneBy({ id });
  }

  async update(id: number, updateCentroCostoDto: UpdateCentroCostoDto): Promise<CentroCosto> {
    await this.centroCostoRepository.update({ id }, updateCentroCostoDto);
    return await this.centroCostoRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<CentroCosto> {
    const centroCosto = await this.findOne(id);
    await this.centroCostoRepository.softDelete({ id });
    return centroCosto;
  }
}
