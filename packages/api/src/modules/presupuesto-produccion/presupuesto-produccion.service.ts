import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PresupuestoProduccion } from './entities/presupuesto-produccion.entity';
import { CreatePresupuestoProduccionDto } from './dto/create-presupuesto-produccion.dto';
import { UpdatePresupuestoProduccionDto } from './dto/update-presupuesto-produccion.dto';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { PROCESO_GENERAL } from '@/constants/proceso-general'
import { FindManyOptionsWithSearch } from '@/types'
import { InventarioReservasService } from '../inventario-reservas/inventario-reservas.service';
import { getToday } from '@/helpers/date'
@Injectable()
export class PresupuestoProduccionService {
  constructor(
    @InjectRepository(PresupuestoProduccion)
    private presupuestoProduccionRepository: Repository<PresupuestoProduccion>,
    @InjectRepository(Presupuesto)
    private presupuestoRepository: Repository<Presupuesto>,
    private inventarioReservasService: InventarioReservasService,

  ) { }

  async create(createDto: CreatePresupuestoProduccionDto) {
    return await this.presupuestoProduccionRepository.save(createDto);
  }

  async findAll(conditions: FindManyOptionsWithSearch<PresupuestoProduccion>): Promise<PresupuestoProduccion[]> {
    const activos = conditions?.search && conditions?.search === 'activos'

    return await this.presupuestoProduccionRepository.find({
      ...conditions,
      where: {
        ...transformToGenericFilters(conditions.where),
        ...(activos && {
          presupuesto: {
            procesoGeneralId:
              In([
                PROCESO_GENERAL.ENVIADO_A_SERVICIO,
                PROCESO_GENERAL.ENVIADO_A_PRODUCCION,
                PROCESO_GENERAL.EN_SERVICIO,
                PROCESO_GENERAL.EN_PRODUCCION
              ])
          }
        })
      },

      relations: {
        presupuesto: {
          cliente: true
        },
        trabajo: true
      }
    });
  }

  async findOne(id: number) {
    return await this.presupuestoProduccionRepository.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdatePresupuestoProduccionDto) {
    // 1. Actualizar el registro de producción
    await this.presupuestoProduccionRepository.update({ id }, updateDto);
    // 2. Obtener el registro actualizado
    const produccion = await this.presupuestoProduccionRepository.findOne({
      where: { id },
      relations: ['presupuesto']
    });
    if (!produccion || !produccion.presupuestoId) {
      throw new NotFoundException('Registro de producción no encontrado');
    }
    // // 3. Obtener todas las producciones del mismo presupuesto
    const producciones = await this.presupuestoProduccionRepository.find({
      where: { presupuestoId: produccion.presupuestoId }
    });
    // // 4. Calcular el nuevo progreso
    const totalProducciones = producciones.length;
    const produccionesTerminadas = producciones.filter(p => p.terminado).length;
    const nuevoProgreso = Math.round((produccionesTerminadas / totalProducciones) * 100);
    // // 5. Actualizar el progreso en el presupuesto
    const updateData = {
      progreso: nuevoProgreso,
      ...(nuevoProgreso === 100 && {
        fechaFabricacion: getToday(),
        procesoGeneralId: PROCESO_GENERAL.TRABAJO_TERMINADO,
        produccionEstatus: 'completo'
      })
    }
    // // 6. Actualizar el presupuesto
    await this.presupuestoRepository.save({
      id: produccion.presupuestoId,
      ...updateData
    });
    if (updateDto.terminado === 1) {
      // Devolver al stock todas las reservas que no se utilizaron
      await this.inventarioReservasService.devolverReservasAlStock(
        produccion.presupuestoId,
        produccion.trabajoId
      );
    }

    // 7. Retornar la producción actualizada
    return produccion;

  }

  async remove(id: number) {
    const presupuestoProduccion = await this.findOne(id);
    await this.presupuestoProduccionRepository.delete({ id });
    return presupuestoProduccion;
  }
}
