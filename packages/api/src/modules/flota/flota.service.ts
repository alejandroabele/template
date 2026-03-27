import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { CreateFlotaDto } from './dto/create-flota.dto';
import { UpdateFlotaDto } from './dto/update-flota.dto';
import { Flota } from './entities/flota.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Injectable()
export class FlotaService {
  constructor(
    @InjectRepository(Flota)
    private flotaRepository: Repository<Flota>,
    @InjectRepository(AlquilerRecurso)
    private recursoRepository: Repository<AlquilerRecurso>,
  ) {}

  async findAll(conditions: FindManyOptions<Flota>): Promise<Flota[]> {
    const qb = this.flotaRepository
      .createQueryBuilder('flota')
      .leftJoinAndSelect('flota.recurso', 'recurso');

    buildWhereAndOrderQuery(qb, conditions, 'flota');

    return qb.getMany();
  }

  async findOne(id: number) {
    return await this.flotaRepository.findOne({
      where: { id },
      relations: ['recurso'],
    });
  }

  async create(createFlotaDto: CreateFlotaDto) {
    const { codigo, ...flotaData } = createFlotaDto;
    const recurso = await this.recursoRepository.save({ codigo, tipo: 'FLOTA' });
    return await this.flotaRepository.save({ ...flotaData, recursoId: recurso.id });
  }

  async update(id: number, updateFlotaDto: UpdateFlotaDto) {
    const { codigo, ...flotaData } = updateFlotaDto;

    const flota = await this.flotaRepository.findOne({ where: { id } });
    if (!flota) throw new NotFoundException(`Flota ${id} no encontrada`);

    if (codigo !== undefined) {
      await this.recursoRepository.update({ id: flota.recursoId }, { codigo });
    }

    if (Object.keys(flotaData).length > 0) {
      await this.flotaRepository.update({ id }, flotaData);
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const flota = await this.flotaRepository.findOne({ where: { id } });
    if (!flota) throw new NotFoundException(`Flota ${id} no encontrada`);
    await this.flotaRepository.delete({ id });
    await this.recursoRepository.delete({ id: flota.recursoId });
    return flota;
  }
}
