import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlquilerMantenimientoDto } from './dto/create-alquiler-mantenimiento.dto';
import { UpdateAlquilerMantenimientoDto } from './dto/update-alquiler-mantenimiento.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { AlquilerMantenimiento } from './entities/alquiler-mantenimiento.entity'
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlquilerMantenimientoService {

  constructor(
    @InjectRepository(AlquilerMantenimiento)
    private alquilerMantenimientoRepository: Repository<AlquilerMantenimiento>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) { }
  async create(createAlquilerMantenimientoDto: CreateAlquilerMantenimientoDto) {
    return await this.alquilerMantenimientoRepository.save(createAlquilerMantenimientoDto);
  }
  async findAll(conditions: FindManyOptions<AlquilerMantenimiento>): Promise<AlquilerMantenimiento[]> {
    const order = conditions.order || {};


    const alquilerMantenimientos = await this.alquilerMantenimientoRepository.find({
      ...conditions, where: transformToGenericFilters(conditions.where), relations: {
        alquilerRecurso: true
      },
      order
    })
    for (const alquilerMantenimiento of alquilerMantenimientos) {
      alquilerMantenimiento['checklistArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'alquiler_mantenimiento',
          modeloId: alquilerMantenimiento.id,
          tipo: 'checklist',
        },
        order: {
          id: 'DESC',
        },
      });
      alquilerMantenimiento['adjuntos'] = await this.archivoRepository.find({
        where: {
          modelo: 'alquiler_mantenimiento',
          modeloId: alquilerMantenimiento.id,
          tipo: 'adjuntos',
        },
        order: {
          id: 'DESC',
        },
      });
    }
    return alquilerMantenimientos
  }

  async findOne(id: number) {
    const alquilerMantenimiento = await this.alquilerMantenimientoRepository.findOne({
      where: { id },
      relations: {
        alquilerRecurso: true,
      }
    });
    if (!alquilerMantenimiento) throw new NotFoundException(`alquilerFactura #${id} not found`);

    alquilerMantenimiento['checklistArchivo'] = await this.archivoRepository.findOne({
      where: {
        modelo: 'alquiler_mantenimiento',
        modeloId: alquilerMantenimiento.id,
        tipo: 'checklist',
      },
      order: {
        id: 'DESC',
      },
    });
    alquilerMantenimiento['adjuntos'] = await this.archivoRepository.find({
      where: {
        modelo: 'alquiler_mantenimiento',
        modeloId: alquilerMantenimiento.id,
        tipo: 'adjuntos',
      },
      order: {
        id: 'DESC',
      },
    });

    return alquilerMantenimiento

  }

  async update(id: number, updateAlquilerMantenimientoDto: UpdateAlquilerMantenimientoDto) {
    await this.alquilerMantenimientoRepository.update({ id }, updateAlquilerMantenimientoDto);
    return await this.alquilerMantenimientoRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<AlquilerMantenimiento> {
    const alquilerMantenimiento = await this.findOne(id);

    await this.alquilerMantenimientoRepository.delete({ id });
    return alquilerMantenimiento
  }
}
