import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto) {
    return await this.personaRepository.save(createPersonaDto);
  }

  async findAll(conditions: FindManyOptions<Persona>): Promise<Persona[]> {
    const personas = await this.personaRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
    });

    // Cargar foto para cada persona
    for (const persona of personas) {
      persona['fotoArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'persona',
          modeloId: persona.id,
          tipo: 'foto',
        },
        order: { id: 'DESC' },
      });
    }

    return personas;
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOneBy({ id });

    if (persona) {
      persona['fotoArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'persona',
          modeloId: persona.id,
          tipo: 'foto',
        },
        order: { id: 'DESC' },
      });
    }

    return persona;
  }

  async update(id: number, updatePersonaDto: UpdatePersonaDto) {
    await this.personaRepository.update({ id }, updatePersonaDto);
    return await this.personaRepository.findOneBy({ id });
  }

  async findByDni(dni: string) {
    return await this.personaRepository.findOneBy({ dni });
  }

  async remove(id: number) {
    const persona = await this.findOne(id);
    await this.personaRepository.delete({ id });
    return persona;
  }
}
