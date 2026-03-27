


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContratoMarcoTalonarioDto } from './dto/create-contrato-marco-talonario.dto';
import { UpdateContratoMarcoTalonarioDto } from './dto/update-contrato-marco-talonario.dto';
import { ContratoMarcoTalonario } from './entities/contrato-marco-talonario.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { getToday } from '@/helpers/date'

@Injectable()
export class ContratoMarcoTalonarioService {
  constructor(
    @InjectRepository(ContratoMarcoTalonario)
    private contratoMarcoTalonarioRepository: Repository<ContratoMarcoTalonario>,
  ) { }

  async create(CreateContratoMarcoTalonarioDto: CreateContratoMarcoTalonarioDto) {
    try {

      const nuevoTalonario = this.contratoMarcoTalonarioRepository.create(CreateContratoMarcoTalonarioDto);

      const saved = await this.contratoMarcoTalonarioRepository.save(nuevoTalonario);
      // Actualiza la fechaFin de todos los demás talonarios del mismo contrato marco
      await this.contratoMarcoTalonarioRepository
        .createQueryBuilder()
        .update()
        .set({ fechaFin: getToday() })
        .where("contratoMarcoId = :contratoMarcoId", { contratoMarcoId: saved.contratoMarcoId })
        .andWhere("id != :id", { id: saved.id })
        .execute();

      return saved;
    } catch (error) {
      console.error('Error al crear el contrato marco talonario:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por el controlador o servicio superior
    }
  }


  async findAll(conditions: FindManyOptions<ContratoMarcoTalonario>): Promise<ContratoMarcoTalonario[]> {
    const qb = this.contratoMarcoTalonarioRepository.createQueryBuilder('contrato-marco-talonario');
    const relaciones = ['contratoMarco'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`contrato-marco-talonario.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'contrato-marco-talonario');
    const presupuestos = await qb.getMany();


    return presupuestos;
  }
  async findOne(id: number) {
    const talonario = await this.contratoMarcoTalonarioRepository.createQueryBuilder('contrato_marco_talonario')
      .leftJoinAndSelect('contrato_marco_talonario.items', 'item') // Carga los items
      .leftJoinAndSelect('contrato_marco_talonario.contratoMarco', 'contratoMarco') // Agregado
      .leftJoinAndSelect('contratoMarco.cliente', 'cliente') // <-- Agregado
      .leftJoinAndSelect('item.receta', 'receta') // Carga la relación de receta
      .where('contrato_marco_talonario.id = :id', { id })
      .getOne();

    return talonario;
  }


  async update(id: number, UpdateContratoMarcoTalonarioDto: UpdateContratoMarcoTalonarioDto) {
    // Encuentra el contrato existente
    try {
      const contrato = await this.contratoMarcoTalonarioRepository.findOne({
        where: { id },
        relations: ['items'],
      });

      if (!contrato) {
        throw new Error('Contrato no encontrado');
      }

      contrato.fechaInicio = UpdateContratoMarcoTalonarioDto.fechaInicio;
      contrato.fechaFin = UpdateContratoMarcoTalonarioDto.fechaFin;
      contrato.contratoMarcoId = UpdateContratoMarcoTalonarioDto.contratoMarcoId;

      if (UpdateContratoMarcoTalonarioDto.items) {
        contrato.items = UpdateContratoMarcoTalonarioDto.items;
      }
      // Guarda la entidad actualizada
      return await this.contratoMarcoTalonarioRepository.save(contrato);

    } catch (error) {
      console.error('Error al actualizar el contrato:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por el controlador o servicio superior
    }
  }



  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.contratoMarcoTalonarioRepository.delete({ id });
    return inventarioReserva
  }
}
