import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FACTURACION, COBROS } from "@/constants/eventos";
import { Cobro } from '@/modules/cobro/entities/cobro.entity';
import { FACTURA_ESTADO } from '@/constants/factura';
@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepository: Repository<Factura>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    private eventEmitter: EventEmitter2,
  ) { }

  /**
   * Calcula el estado de una factura basado en sus cobros
   * Estados: FACTURA_ESTADO.PAGADO, FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE
   */
  private calcularEstado(factura: Factura): string {
    const cobros = factura.cobros || [];
    const montoTotal = Number(factura.monto) || 0;


    // TODO: Usar importe bruto una vez que se tenga en claro el tema de las retenciones
    if (montoTotal === 0) {
      return FACTURA_ESTADO.PENDIENTE;
    }

    const montoCobrado = cobros.reduce((sum, cobro) => {
      return sum + (Number(cobro.monto) || 0);
    }, 0);

    // Si está completamente cobrada
    if (montoCobrado >= montoTotal) {
      return FACTURA_ESTADO.PAGADO;
    }

    // Si tiene cobros parciales
    if (montoCobrado > 0) {
      return FACTURA_ESTADO.PARCIAL;
    }

    // Sin cobros
    return FACTURA_ESTADO.PENDIENTE;
  }

  /**
   * Actualiza el estado de una factura y lo guarda en la base de datos
   */
  async actualizarEstado(facturaId: number): Promise<void> {
    const factura = await this.facturaRepository.findOne({
      where: { id: facturaId },
      relations: ['cobros'],
    });

    if (!factura) {
      return;
    }

    const nuevoEstado = this.calcularEstado(factura);

    if (factura.estado !== nuevoEstado) {
      await this.facturaRepository.update({ id: facturaId }, { estado: nuevoEstado });
    }
  }

  async create(createFacturaDto: CreateFacturaDto) {
    const factura = await this.facturaRepository.save(createFacturaDto);

    // Emitir evento de creación
    this.eventEmitter.emit(FACTURACION.FACTURA_CREADA, factura);

    return factura;
  }

  async findAll(conditions: FindManyOptions<Factura>): Promise<Factura[]> {
    const qb = this.facturaRepository.createQueryBuilder('factura');

    // Cargar relaciones
    const relaciones = ['cliente', 'cobros'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`factura.${relation}`, relation);
    }
    qb.leftJoinAndSelect('cobros.metodoPago', 'cobrosMetodoPago');
    qb.leftJoinAndSelect('cobros.banco', 'cobrosBanco');

    // Aplicar filtros y ordenamiento
    buildWhereAndOrderQuery(qb, conditions, 'factura');

    const facturas = await qb.getMany();

    // Cargar archivo de factura y actualizar estado para cada una
    for (const factura of facturas) {
      factura['facturaArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'factura',
          modeloId: factura.id,
          tipo: 'factura',
        },
        order: {
          id: 'DESC',
        },
      });
    }

    return facturas;
  }

  async findOne(id: number) {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: {
        cliente: true,
        cobros: {
          metodoPago: true,
          banco: true,
        },
      }
    });

    if (!factura) throw new NotFoundException(`Factura #${id} not found`);

    factura['facturaArchivo'] = await this.archivoRepository.findOne({
      where: {
        modelo: 'factura',
        modeloId: factura.id,
        tipo: 'factura'
      },
      order: {
        id: 'DESC'
      }
    });

    return factura;
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    await this.facturaRepository.update({ id }, updateFacturaDto);
    const factura = await this.facturaRepository.findOneBy({ id });

    return factura;
  }

  async remove(id: number): Promise<Factura> {
    const factura = await this.findOne(id);
    await this.facturaRepository.delete({ id });

    // Emitir evento de eliminación

    return factura;
  }

  // ===== Eventos =====

  /**
   * Listener para creación de cobros
   * Actualiza el estado de la factura asociada
   */
  @OnEvent(COBROS.COBRO_CREADA, { async: true })
  async handleCobroCreado(payload: Cobro) {
    const cobro = payload;
    if (!cobro || !cobro.facturaId) return;

    await this.actualizarEstado(cobro.facturaId);
  }

  /**
   * Listener para creación de cobros masivos
   * Actualiza el estado de las facturas asociadas
   */
  @OnEvent(COBROS.COBRO_MASIVO_CREADO, { async: true })
  async handleCobroMasivoCreado(payload: any) {
    const { cobros } = payload;
    if (!cobros || cobros.length === 0) return;

    // Actualizar estado de cada factura
    for (const cobro of cobros) {
      if (cobro.facturaId) {
        await this.actualizarEstado(cobro.facturaId);
      }
    }
  }

}
