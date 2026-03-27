import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContactoTipoDto } from './dto/create-contacto-tipo.dto';
import { UpdateContactoTipoDto } from './dto/update-contacto-tipo.dto';
import { ContactoTipo } from './entities/contacto-tipo.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class ContactoTipoService {
  constructor(
    @InjectRepository(ContactoTipo)
    private contactoTipoRepository: Repository<ContactoTipo>,
  ) {}

  async create(createContactoTipoDto: CreateContactoTipoDto) {
    return await this.contactoTipoRepository.save(createContactoTipoDto);
  }

  async findAll(conditions: FindManyOptions<ContactoTipo>): Promise<ContactoTipo[]> {
    return await this.contactoTipoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where)
    });
  }

  async findOne(id: number) {
    return await this.contactoTipoRepository.findOneBy({ id });
  }

  async update(id: number, updateContactoTipoDto: UpdateContactoTipoDto) {
    await this.contactoTipoRepository.update({ id }, updateContactoTipoDto);
    return await this.contactoTipoRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const contactoTipo = await this.findOne(id);
    await this.contactoTipoRepository.delete({ id });
    return contactoTipo;
  }
}
