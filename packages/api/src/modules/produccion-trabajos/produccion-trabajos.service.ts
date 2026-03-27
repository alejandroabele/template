import { Injectable } from '@nestjs/common';
import { CreateProduccionTrabajoDto } from './dto/create-produccion-trabajo.dto';
import { UpdateProduccionTrabajoDto } from './dto/update-produccion-trabajo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { ProduccionTrabajo } from './entities/produccion-trabajo.entity';
type FindManyOptionsWithSearch<T> = FindManyOptions<T> & { search?: string };

@Injectable()
export class ProduccionTrabajosService {
  constructor(
    @InjectRepository(ProduccionTrabajo)
    private produccionTrabajoRepository: Repository<ProduccionTrabajo>,
  ) { }
  create(createProduccionTrabajoDto: CreateProduccionTrabajoDto) {
    return 'This action adds a new produccionTrabajo';
  }

  async findAll(conditions: FindManyOptionsWithSearch<ProduccionTrabajo>) {
    const order = conditions.order || {};
    const isMenu = conditions?.search && conditions?.search === 'menu'

    const produccion = await this.produccionTrabajoRepository.find({
      ...conditions,
      where: {
        ...transformToGenericFilters(conditions.where),
      },
      order,
      take: 50
    })
    if (isMenu) {
      return produccion.reduce((acc, item) => {
        const key = item.tipo;

        if (!acc[key]) {
          acc[key] = [];
        }

        const produccionTrabajo = {
          ...item,
          suministros: [],
          manoDeObra: [],
          materiales: []
        };

        acc[key].push(produccionTrabajo);

        return acc;
      }, {});
    }

    return produccion

  }
  async initProduccionTrabajos() {
    const produccion = await this.produccionTrabajoRepository.find({

      take: 50
    })
    return produccion.reduce((acc, item) => {
      const key = item.tipo;

      if (!acc[key]) {
        acc[key] = [];
      }

      const produccionTrabajo = {
        ...item,
        suministros: [],
        manoDeObra: [],
        materiales: []
      };

      acc[key].push(produccionTrabajo);

      return acc;
    }, {});

  }

  findOne(id: number) {
    return `This action returns a #${id} produccionTrabajo`;
  }

  update(id: number, updateProduccionTrabajoDto: UpdateProduccionTrabajoDto) {
    return `This action updates a #${id} produccionTrabajo`;
  }

  remove(id: number) {
    return `This action removes a #${id} produccionTrabajo`;
  }
}
