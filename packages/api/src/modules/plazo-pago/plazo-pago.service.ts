import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreatePlazoPagoDto } from './dto/create-plazo-pago.dto';
import { UpdatePlazoPagoDto } from './dto/update-plazo-pago.dto';
import { PlazoPago } from './entities/plazo-pago.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlazoPagoService {
  constructor(
    @InjectRepository(PlazoPago)
    private plazoPagoRepository: Repository<PlazoPago>,
  ) { }

  async create(createPlazoPagoDto: CreatePlazoPagoDto) {
    return await this.plazoPagoRepository.save(createPlazoPagoDto);
  }

  async findAll(conditions: FindManyOptions<PlazoPago>): Promise<PlazoPago[]> {
    return await this.plazoPagoRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.plazoPagoRepository.findOneBy({ id });
  }

  async update(id: number, updatePlazoPagoDto: UpdatePlazoPagoDto) {
    await this.plazoPagoRepository.update({ id }, updatePlazoPagoDto);
    return await this.plazoPagoRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const plazoPago = await this.findOne(id);
    await this.plazoPagoRepository.delete({ id });
    return plazoPago;
  }
}
