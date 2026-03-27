import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProveedorRubroDto } from './dto/create-proveedor-rubro.dto';
import { UpdateProveedorRubroDto } from './dto/update-proveedor-rubro.dto';
import { ProveedorRubro } from './entities/proveedor-rubro.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProveedorRubroService {
  constructor(
    @InjectRepository(ProveedorRubro)
    private proveedorRubroRepository: Repository<ProveedorRubro>,
  ) { }

  async create(createProveedorDto: CreateProveedorRubroDto) {
    return await this.proveedorRubroRepository.save(createProveedorDto);
  }

  async findAll(conditions: FindManyOptions<ProveedorRubro>): Promise<ProveedorRubro[]> {
    return await this.proveedorRubroRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    return await this.proveedorRubroRepository.findOneBy({ id });
  }

  async update(id: number, updateProveedorDto: UpdateProveedorRubroDto) {
    await this.proveedorRubroRepository.update({ id }, updateProveedorDto);
    return await this.proveedorRubroRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const alquilerPrecio = await this.findOne(id);

    await this.proveedorRubroRepository.delete({ id });
    return alquilerPrecio
  }
}
