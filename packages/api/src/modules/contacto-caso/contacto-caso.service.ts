import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContactoCasoDto } from './dto/create-contacto-caso.dto';
import { UpdateContactoCasoDto } from './dto/update-contacto-caso.dto';
import { ContactoCaso } from './entities/contacto-caso.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';

@Injectable()
export class ContactoCasoService {
  constructor(
    @InjectRepository(ContactoCaso)
    private contactoCasoRepository: Repository<ContactoCaso>,
  ) {}

  async create(createContactoCasoDto: CreateContactoCasoDto) {
    return await this.contactoCasoRepository.save(createContactoCasoDto);
  }

  async findAll(conditions: FindManyOptions<ContactoCaso>): Promise<ContactoCaso[]> {
    const casos = await this.contactoCasoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['cliente', 'vendedor', 'contactosProximos', 'contactosProximos.tipo'],
    });

    // Para cada caso, mantener solo el próximo contacto más cercano
    return casos.map((caso) => {
      if (caso.contactosProximos && caso.contactosProximos.length > 0) {
        // Filtrar contactos futuros y ordenar por fecha
        const proximosContactos = caso.contactosProximos
          .filter((cp) => cp.fecha && new Date(cp.fecha) >= new Date())
          .sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());

        // Mantener solo el más próximo
        caso.contactosProximos = proximosContactos.slice(0, 1);
      }
      return caso;
    });
  }

  async findOne(id: number) {
    return await this.contactoCasoRepository.findOne({
      where: { id },
      relations: ['cliente', 'vendedor'],
    });
  }

  async update(id: number, updateContactoCasoDto: UpdateContactoCasoDto) {
    await this.contactoCasoRepository.update({ id }, updateContactoCasoDto);
    return await this.contactoCasoRepository.findOne({
      where: { id },
      relations: ['cliente', 'vendedor'],
    });
  }

  async remove(id: number) {
    const contactoCaso = await this.findOne(id);
    await this.contactoCasoRepository.delete({ id });
    return contactoCaso;
  }
}
