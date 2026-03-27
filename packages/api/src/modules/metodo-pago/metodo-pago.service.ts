import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private metodoPagoRepository: Repository<MetodoPago>,
  ) { }

  async create(createMetodoPagoDto: CreateMetodoPagoDto) {
    return await this.metodoPagoRepository.save(createMetodoPagoDto);
  }

  async findAll(conditions: FindManyOptions<MetodoPago>): Promise<MetodoPago[]> {
    return await this.metodoPagoRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.metodoPagoRepository.findOneBy({ id });
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto) {
    await this.metodoPagoRepository.update({ id }, updateMetodoPagoDto);
    return await this.metodoPagoRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const metodoPago = await this.findOne(id);

    await this.metodoPagoRepository.delete({ id });
    return metodoPago;
  }
}
