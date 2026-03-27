import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresupuestoLeido } from './entities/presupuesto-leido.entity';
import { getUser } from '@/helpers/get-user';

@Injectable()
export class PresupuestoLeidoService {
  constructor(
    @InjectRepository(PresupuestoLeido)
    private readonly presupuestoLeidoRepository: Repository<PresupuestoLeido>,
  ) { }

  /**
   * Marca un presupuesto como leído por el usuario actual
   * @param presupuestoId ID del presupuesto a marcar como leído
   * @returns Objeto con información de la operación
   */
  async marcarComoLeido(presupuestoId: number): Promise<{ success: boolean }> {
    const userId = getUser().uid;

    try {
      const existeRegistro = await this.presupuestoLeidoRepository.findOne({
        where: { usuarioId: userId, presupuestoId },
      });

      if (!existeRegistro) {
        await this.presupuestoLeidoRepository.save({
          usuarioId: userId,
          presupuestoId,
          fecha: new Date(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error al marcar presupuesto como leído:', error);
      return { success: false };
    }
  }

  /**
   * Verifica si un presupuesto específico ha sido leído por el usuario actual
   * @param presupuestoId ID del presupuesto a verificar
   * @returns Booleano indicando si ha sido leído
   */
  async verificarLecturaUsuario(presupuestoId: number): Promise<boolean> {
    const userId = getUser().uid;
    const registro = await this.presupuestoLeidoRepository.findOne({
      where: { usuarioId: userId, presupuestoId },
    });
    return !!registro;
  }

  /**
   * Verifica el estado de lectura para múltiples presupuestos
   * @param presupuestoIds Array de IDs de presupuestos
   * @returns Mapa con ID de presupuesto como clave y booleano como valor
   */
  async verificarLecturasUsuario(
    presupuestoIds: number[],
  ): Promise<Map<number, boolean>> {
    if (presupuestoIds.length === 0) {
      return new Map();
    }

    const userId = getUser().uid;
    const registros = await this.presupuestoLeidoRepository
      .createQueryBuilder('pl')
      .where('pl.usuarioId = :userId', { userId })
      .andWhere('pl.presupuestoId IN (:...presupuestoIds)', { presupuestoIds })
      .getMany();

    const mapaLecturas = new Map<number, boolean>();
    presupuestoIds.forEach((id) => {
      mapaLecturas.set(id, registros.some((r) => r.presupuestoId === id));
    });

    return mapaLecturas;
  }

  /**
   * Obtiene todos los presupuestos leídos por el usuario actual
   * @returns Array de IDs de presupuestos leídos
   */
  async obtenerPresupuestosLeidos(): Promise<number[]> {
    const userId = getUser().uid;
    const registros = await this.presupuestoLeidoRepository.find({
      where: { usuarioId: userId },
      select: ['presupuestoId'],
    });
    return registros.map((r) => r.presupuestoId);
  }

  /**
   * Elimina el registro de lectura de un presupuesto
   * @param presupuestoId ID del presupuesto
   * @returns Resultado de la operación
   */
  async eliminarRegistroLectura(presupuestoId: number): Promise<{ success: boolean }> {
    const userId = getUser().uid;
    const result = await this.presupuestoLeidoRepository.delete({
      usuarioId: userId,
      presupuestoId,
    });
    return { success: (result.affected || 0) > 0 };
  }

  async remove(presupuestoId: number) {
    await this.presupuestoLeidoRepository.delete({ presupuestoId })
  }
}