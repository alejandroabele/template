import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ContactoProximo } from './entities/contacto-proximo.entity';
import { CreateContactoProximoDto } from './dto/create-contacto-proximo.dto';
import { UpdateContactoProximoDto } from './dto/update-contacto-proximo.dto';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class ContactoProximoService {
  constructor(
    @InjectRepository(ContactoProximo)
    private contactoProximoRepository: Repository<ContactoProximo>,
  ) { }

  async findAll(conditions: FindManyOptions<ContactoProximo>): Promise<ContactoProximo[]> {
    return await this.contactoProximoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['caso', 'tipo', 'vendedor'],
    });
  }

  async findOne(id: number) {
    return await this.contactoProximoRepository.findOne({
      where: { id },
      relations: ['caso', 'tipo', 'vendedor'],
    });
  }

  async create(createDto: CreateContactoProximoDto) {
    return await this.contactoProximoRepository.save(createDto);
  }

  async update(id: number, updateDto: UpdateContactoProximoDto) {
    await this.contactoProximoRepository.update({ id }, updateDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.contactoProximoRepository.delete({ id });
    return entity;
  }
}
