import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Ubicacion } from './entities/ubicacion.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(AlquilerRecurso)
    private recursoRepository: Repository<AlquilerRecurso>,
  ) {}

  async findAll(conditions: FindManyOptions<Ubicacion>): Promise<Ubicacion[]> {
    const qb = this.ubicacionRepository
      .createQueryBuilder('ubicacion')
      .leftJoinAndSelect('ubicacion.recurso', 'recurso');

    buildWhereAndOrderQuery(qb, conditions, 'ubicacion');

    return qb.getMany();
  }

  async findOne(id: number) {
    return await this.ubicacionRepository.findOne({
      where: { id },
      relations: ['recurso'],
    });
  }

  async create(createUbicacionDto: CreateUbicacionDto) {
    const { codigo, ...ubicacionData } = createUbicacionDto;
    const recurso = await this.recursoRepository.save({ codigo, tipo: 'UBICACION' });
    return await this.ubicacionRepository.save({ ...ubicacionData, recursoId: recurso.id });
  }

  async update(id: number, updateUbicacionDto: UpdateUbicacionDto) {
    const { codigo, ...ubicacionData } = updateUbicacionDto;

    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });
    if (!ubicacion) throw new NotFoundException(`Ubicación ${id} no encontrada`);

    if (codigo !== undefined) {
      await this.recursoRepository.update({ id: ubicacion.recursoId }, { codigo });
    }

    if (Object.keys(ubicacionData).length > 0) {
      await this.ubicacionRepository.update({ id }, ubicacionData);
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });
    if (!ubicacion) throw new NotFoundException(`Ubicación ${id} no encontrada`);
    await this.ubicacionRepository.delete({ id });
    await this.recursoRepository.delete({ id: ubicacion.recursoId });
    return ubicacion;
  }
}
