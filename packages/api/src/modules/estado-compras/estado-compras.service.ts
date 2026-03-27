import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { EstadoCompras } from './entities/estado-compras.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstadoComprasService {
  constructor(
    @InjectRepository(EstadoCompras)
    private estadoComprasRepository: Repository<EstadoCompras>,
  ) { }

  async findAll(conditions: FindManyOptions<EstadoCompras>): Promise<EstadoCompras[]> {
    const order = conditions.order || {};

    const estados = await this.estadoComprasRepository.find({
      ...conditions,
      where: {
        ...transformToGenericFilters(conditions.where),
      },
      order,
    });

    return estados;
  }

  async findOne(id: number) {
    return await this.estadoComprasRepository.findOneBy({ id });
  }
}
