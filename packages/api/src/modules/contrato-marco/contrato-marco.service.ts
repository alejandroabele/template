


import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContratoMarcoDto } from './dto/create-contrato-marco.dto';
import { UpdateContratoMarcoDto } from './dto/update-contrato-marco.dto';
import { ContratoMarco } from './entities/contrato-marco.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Injectable()
export class ContratoMarcoService {
  constructor(
    @InjectRepository(ContratoMarco)
    private contratoMarcoRepository: Repository<ContratoMarco>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) { }

  async create(CreateContratoMarcoDto: CreateContratoMarcoDto) {
    return await this.contratoMarcoRepository.save(CreateContratoMarcoDto);

  }

  async findAll(conditions: FindManyOptions<ContratoMarco>): Promise<ContratoMarco[]> {
    const qb = this.contratoMarcoRepository.createQueryBuilder('contrato-marco');
    const relaciones = ['cliente'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`contrato-marco.${relation}`, relation.split('.').pop());
    }
    buildWhereAndOrderQuery(qb, conditions, 'contrato-marco');
    const contratos = await qb.getMany();

    // Cargar logo del cliente para cada contrato
    for (const contrato of contratos) {
      if (contrato.cliente) {
        contrato.cliente['logo'] = await this.archivoRepository.findOne({
          where: {
            modelo: 'cliente',
            modeloId: contrato.cliente.id,
            tipo: 'logo'
          },
          order: {
            id: 'DESC'
          }
        });
      }
    }

    return contratos;
  }
  async findOne(id: number) {
    const contrato = await this.contratoMarcoRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    // Cargar logo del cliente
    if (contrato && contrato.cliente) {
      contrato.cliente['logo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'cliente',
          modeloId: contrato.cliente.id,
          tipo: 'logo'
        },
        order: {
          id: 'DESC'
        }
      });
    }

    return contrato;
  }

  async update(id: number, UpdateContratoMarcoDto: UpdateContratoMarcoDto) {
    await this.contratoMarcoRepository.update({ id }, UpdateContratoMarcoDto);
    return await this.contratoMarcoRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });
  }

  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.contratoMarcoRepository.delete({ id });
    return inventarioReserva
  }
}
