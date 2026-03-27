import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { Contacto } from './entities/contacto.entity';
import { ContactoProximoService } from '../contacto-proximo/contacto-proximo.service';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private contactoRepository: Repository<Contacto>,
    private contactoProximoService: ContactoProximoService,
  ) {}

  async create(createContactoDto: CreateContactoDto & { proximoContacto?: any }) {
    const contacto = await this.contactoRepository.save(createContactoDto);

    // Si hay datos de próximo contacto, crear el registro
    if (createContactoDto.proximoContacto) {
      await this.contactoProximoService.create({
        casoId: createContactoDto.casoId,
        vendedorId: createContactoDto.vendedorId,
        fecha: createContactoDto.proximoContacto.fecha,
        tipoId: createContactoDto.proximoContacto.tipoId,
        nota: createContactoDto.proximoContacto.nota,
      });
    }

    return contacto;
  }

  async findAll(conditions: FindManyOptions<Contacto>): Promise<Contacto[]> {
    return await this.contactoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['caso', 'caso.cliente', 'caso.vendedor', 'tipo'],
    });
  }

  async findOne(id: number) {
    return await this.contactoRepository.findOne({
      where: { id },
      relations: ['tipo', 'vendedor', 'caso'],
    });
  }

  async update(id: number, updateContactoDto: UpdateContactoDto) {
    await this.contactoRepository.update({ id }, updateContactoDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const contacto = await this.findOne(id);
    await this.contactoRepository.delete({ id });
    return contacto;
  }
}
