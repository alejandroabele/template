import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    return await this.clienteRepository.save(createClienteDto);
  }

  async findAll(conditions: FindManyOptions<Cliente>): Promise<Cliente[]> {

    return await this.clienteRepository.find({ ...conditions, where: transformToGenericFilters(conditions.where) })
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });

    // Cargar logo del cliente
    const logoFiles = await this.archivoRepository.find({
      where: {
        modelo: 'cliente',
        modeloId: cliente.id,
        tipo: 'logo',
      },
      order: {
        id: 'DESC',
      },
    });
    cliente['logo'] = logoFiles.length > 0 ? logoFiles[0] : null;
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.clienteRepository.update({ id }, updateClienteDto);
    return await this.clienteRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
