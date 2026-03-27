import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, In } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { CreateCobroMasivoDto } from './dto/create-cobro-masivo.dto';
import { Cobro } from './entities/cobro.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { COBROS } from '@/constants/eventos';

@Injectable()
export class CobroService {
  constructor(
    @InjectRepository(Cobro)
    private cobroRepository: Repository<Cobro>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    private eventEmitter: EventEmitter2,

  ) { }

  async create(createCobroDto: CreateCobroDto) {
    const cobro = await this.cobroRepository.save(createCobroDto);
    // Emitir evento de creación
    this.eventEmitter.emit(COBROS.COBRO_CREADA, cobro);
    return cobro;
  }

  async findAll(conditions: FindManyOptions<Cobro>): Promise<Cobro[]> {
    const facturas = await this.cobroRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: {
        factura: true,
        metodoPago: true,
        banco: true,
      }
    });

    for (const factura of facturas) {
      factura['comprobante'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'cobro',
          modeloId: factura.id,
          tipo: 'comprobante',
        },
        order: {
          id: 'DESC',
        },
      });
    }

    return facturas;
  }

  async findOne(id: number) {
    const factura = await this.cobroRepository.findOne({
      where: { id },
      relations: {
        factura: true,
        metodoPago: true,
        banco: true,
      }
    });

    if (!factura) throw new NotFoundException(`Factura #${id} not found`);

    factura['comprobante'] = await this.archivoRepository.findOne({
      where: {
        modelo: 'cobro',
        modeloId: factura.id,
        tipo: 'comprobante',
      },
      order: {
        id: 'DESC'
      }
    });

    return factura;
  }

  async update(id: number, updateCobroDto: UpdateCobroDto) {
    await this.cobroRepository.update({ id }, updateCobroDto);
    const cobro = await this.findOne(id);
    return cobro
  }

  async remove(id: number) {
    const cobro = await this.findOne(id);
    await this.cobroRepository.delete({ id });
    return cobro;
  }

  async createCobroMasivo(createCobroMasivoDto: CreateCobroMasivoDto) {
    const facturaIds = createCobroMasivoDto.facturas.map(f => f.facturaId);

    // Obtener las facturas con sus relaciones
    const facturas = await this.facturaRepository.find({
      where: { id: In(facturaIds) },
      relations: ['cobros']
    });

    if (facturas.length !== facturaIds.length) {
      throw new NotFoundException('Alguna de las facturas no existe');
    }

    // Eliminar todos los cobros existentes de estas facturas
    const cobrosIds = facturas.flatMap(f => f.cobros?.map(c => c.id) || []);
    if (cobrosIds.length > 0) {
      await this.cobroRepository.delete({ id: In(cobrosIds) });
    }

    // Crear un cobro por cada factura para mantener la relación
    const cobrosCreados = [];
    for (const facturaDto of createCobroMasivoDto.facturas) {
      const factura = facturas.find(f => f.id === facturaDto.facturaId);
      if (!factura) continue;

      const cobro = await this.cobroRepository.save({
        modelo: factura.modelo,
        modeloId: factura.modeloId,
        monto: facturaDto.monto,
        fecha: createCobroMasivoDto.fecha,
        facturaId: factura.id,
        metodoPagoId: createCobroMasivoDto.metodoPagoId,
        bancoId: createCobroMasivoDto.bancoId,
        retenciones: createCobroMasivoDto.retenciones,
      });

      cobrosCreados.push(cobro);
    }

    // Calcular el monto total
    const montoTotal = createCobroMasivoDto.facturas.reduce((sum, f) => sum + Number(f.monto), 0);

    // Emitir evento de cobro masivo con información consolidada
    // Este evento será escuchado por:
    // 1. cashflow-transaccion: creará UNA SOLA transacción de cashflow
    // 2. factura: actualizará estados de las facturas
    // 3. presupuesto: recalculará montos cobrados de presupuestos
    this.eventEmitter.emit(COBROS.COBRO_MASIVO_CREADO, {
      cobros: cobrosCreados,
      facturas: facturas,
      fecha: createCobroMasivoDto.fecha,
      bancoId: createCobroMasivoDto.bancoId,
      metodoPagoId: createCobroMasivoDto.metodoPagoId,
      montoTotal: montoTotal,
    });

    return {
      cobros: cobrosCreados,
      montoTotal,
    };
  }
}
