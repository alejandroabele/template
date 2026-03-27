


import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateInventarioReservaDto } from './dto/create-inventario-reserva.dto';
import { UpdateInventarioReservaDto } from './dto/update-inventario-reserva.dto';
import { InventarioReserva } from './entities/inventario-reserva.entity';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';

@Injectable()
export class InventarioReservasService {
  constructor(
    @InjectRepository(InventarioReserva)
    private inventarioReservaRepository: Repository<InventarioReserva>,
    @Inject(forwardRef(() => MovimientoInventarioService))
    private movimientoInventarioService: MovimientoInventarioService,
  ) { }

  async create(createInventarioReservaDto: CreateInventarioReservaDto) {
    return await this.inventarioReservaRepository.save(createInventarioReservaDto);

  }
  async findAll(conditions: FindManyOptions<InventarioReserva>): Promise<InventarioReserva[]> {
    const qb = this.inventarioReservaRepository.createQueryBuilder('inventario_reserva');

    // // FUNCIONA
    // qb.leftJoinAndSelect('inventario_reserva.reserva', 'reserva');
    // qb.leftJoinAndSelect('inventario_reserva.producto', 'producto');
    // qb.leftJoinAndSelect('producto.reservas', 'productoReservas');
    // qb.leftJoinAndSelect('reserva.presupuesto', 'reservaPresupuesto');
    // qb.leftJoinAndSelect('reserva.trabajo', 'reservaTrabajo');
    // qb.leftJoinAndSelect('reserva.centroCosto', 'reservaCentroCosto');
    // // FIN FUNCIONA


    // //NO FUNCIONA 
    // const relaciones = ['producto', 'presupuesto', 'trabajo', 'centroCosto', 'reserva', 'createdByUser', 'updatedByUser', 'deletedByUser'];
    // for (const relation of relaciones) {
    //   qb.leftJoinAndSelect(`inventario_reserva.${relation}`, relation.split('.').pop());
    // }
    // qb.leftJoinAndSelect('reserva.presupuesto', 'reservaPresupuesto');
    // qb.leftJoinAndSelect('reserva.trabajo', 'reservaTrabajo');
    // qb.leftJoinAndSelect('reserva.centroCosto', 'reservaCentroCosto');
    // // FIN NO FUNCIONA

    // NUEVO
    const relaciones = ['producto', 'presupuesto', 'trabajo', 'centroCosto', 'reserva', 'createdByUser', 'updatedByUser', 'deletedByUser'];
    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`inventario_reserva.${relation}`, relation.split('.').pop());
    }
    qb.leftJoinAndSelect('producto.reservas', 'productoReservas');
    qb.leftJoinAndSelect('reserva.presupuesto', 'reservaPresupuesto');
    qb.leftJoinAndSelect('reserva.trabajo', 'reservaTrabajo');
    qb.leftJoinAndSelect('reserva.centroCosto', 'reservaCentroCosto');
    // FIN NUEVO


    buildWhereAndOrderQuery(qb, conditions, 'inventario_reserva');

    return await qb.getMany();
  }


  async findOne(id: number) {
    return await this.inventarioReservaRepository.findOneBy({ id });
  }

  async update(id: number, updateInventarioReservaDto: UpdateInventarioReservaDto) {
    await this.inventarioReservaRepository.update({ id }, updateInventarioReservaDto);
    return await this.inventarioReservaRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const inventarioReserva = await this.findOne(id);

    await this.inventarioReservaRepository.delete({ id });
    return inventarioReserva
  }

  async findByPresupuesto(presupuestoId: number): Promise<InventarioReserva[]> {
    return await this.inventarioReservaRepository.find({
      where: { presupuestoId },
      relations: ['producto', 'producto.reservas', 'presupuesto', 'trabajo', 'centroCosto'],
    });
  }

  async findByPresupuestoAndTrabajo(presupuestoId: number, trabajoId: number): Promise<InventarioReserva[]> {
    return await this.inventarioReservaRepository.find({
      where: { presupuestoId, trabajoId },
      relations: ['producto', 'producto.reservas', 'presupuesto', 'trabajo', 'centroCosto'],
    });
  }

  async findByCentroCosto(centroCostoId: number): Promise<InventarioReserva[]> {
    return await this.inventarioReservaRepository.find({
      where: { centroCostoId },
      relations: ['producto', 'producto.reservas', 'presupuesto', 'trabajo', 'centroCosto'],
    });
  }

  async devolverReservasAlStock(presupuestoId: number, trabajoId: number): Promise<{ reservasDevueltas: number; cantidadTotal: number }> {
    // Buscar todas las reservas (no eliminadas) para este presupuesto y trabajo
    const reservasDisponibles = await this.inventarioReservaRepository.find({
      where: {
        presupuestoId,
        trabajoId,
      },
      relations: ['producto', 'producto.reservas'],
    });
    // Devolver las reservas simplemente eliminándolas (no afecta el stock físico)
    for (const reserva of reservasDisponibles) {
      // Eliminar la reserva (soft delete)
      await this.inventarioReservaRepository.softDelete({ id: reserva.id });
    }

    return
  }
}
