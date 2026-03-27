import { Injectable, Inject } from '@nestjs/common';
import { CreateAlquilerPrecioDto } from './dto/create-alquiler-precio.dto';
import { UpdateAlquilerPrecioDto } from './dto/update-alquiler-precio.dto';
import { AlquilerPrecio } from './entities/alquiler-precio.entity'
import { FindManyOptions, Repository } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { OrderValues } from '@/types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlquilerPrecioService {
  constructor(
    @InjectRepository(AlquilerPrecio)
    private alquilerPrecioRepository: Repository<AlquilerPrecio>,
  ) { }
  create(createAlquilerPrecioDto: CreateAlquilerPrecioDto) {
    return 'This action adds a new alquilerPrecio';
  }
  async findAll(conditions: FindManyOptions<AlquilerPrecio>): Promise<AlquilerPrecio[]> {
    const order = conditions.order || {};

    if (order['cliente']) {
      order.cliente = {
        nombre: order.cliente as OrderValues
      }
    }
    return await this.alquilerPrecioRepository.find({
      ...conditions, where: transformToGenericFilters(conditions.where), relations: {
        cliente: true,
        alquilerRecurso: true
      },
      order
    })
  }

  findOne(id: number) {
    return this.alquilerPrecioRepository.findOne({
      where: { id },
      relations: {
        cliente: true,
        alquilerRecurso: true,
      }
    });

  }

  async update(id: number, updateAlquilerPrecioDto: UpdateAlquilerPrecioDto) {
    await this.alquilerPrecioRepository.update({ id }, updateAlquilerPrecioDto);
    return await this.alquilerPrecioRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<AlquilerPrecio> {
    const alquilerPrecio = await this.findOne(id);

    await this.alquilerPrecioRepository.delete({ id });
    return alquilerPrecio
  }
}
