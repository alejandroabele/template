import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { Equipamiento } from './entities/equipamiento.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Injectable()
export class EquipamientoService {
  constructor(
    @InjectRepository(Equipamiento)
    private equipamientoRepository: Repository<Equipamiento>,
    @InjectRepository(AlquilerRecurso)
    private recursoRepository: Repository<AlquilerRecurso>,
  ) {}

  async findAll(conditions: FindManyOptions<Equipamiento>): Promise<Equipamiento[]> {
    const qb = this.equipamientoRepository
      .createQueryBuilder('equipamiento')
      .leftJoinAndSelect('equipamiento.recurso', 'recurso');

    buildWhereAndOrderQuery(qb, conditions, 'equipamiento');

    return qb.getMany();
  }

  async findOne(id: number) {
    return await this.equipamientoRepository.findOne({
      where: { id },
      relations: ['recurso'],
    });
  }

  async create(createEquipamientoDto: CreateEquipamientoDto) {
    const { codigo, ...equipamientoData } = createEquipamientoDto;
    const recurso = await this.recursoRepository.save({ codigo, tipo: 'EQUIPAMIENTO' });
    return await this.equipamientoRepository.save({ ...equipamientoData, recursoId: recurso.id });
  }

  async update(id: number, updateEquipamientoDto: UpdateEquipamientoDto) {
    const { codigo, ...equipamientoData } = updateEquipamientoDto;

    const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
    if (!equipamiento) throw new NotFoundException(`Equipamiento ${id} no encontrado`);

    if (codigo !== undefined) {
      await this.recursoRepository.update({ id: equipamiento.recursoId }, { codigo });
    }

    if (Object.keys(equipamientoData).length > 0) {
      await this.equipamientoRepository.update({ id }, equipamientoData);
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
    if (!equipamiento) throw new NotFoundException(`Equipamiento ${id} no encontrado`);
    await this.equipamientoRepository.delete({ id });
    await this.recursoRepository.delete({ id: equipamiento.recursoId });
    return equipamiento;
  }
}
