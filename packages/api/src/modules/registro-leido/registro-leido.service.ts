import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RegistroLeido } from './entities/registro-leido.entity';
import { getUser } from '@/helpers/get-user';

@Injectable()
export class RegistroLeidoService {
  constructor(
    @InjectRepository(RegistroLeido)
    private registroLeidoRepository: Repository<RegistroLeido>,
  ) { }

  async marcarComoLeido(modelo: string, modeloId: number): Promise<{ success: boolean }> {
    const user = getUser();
    if (!user?.uid) {
      return { success: false };
    }
    const userId = user.uid;

    try {
      const existeRegistro = await this.registroLeidoRepository.findOne({
        where: { usuarioId: userId, modelo, modeloId },
      });

      if (!existeRegistro) {
        await this.registroLeidoRepository.save({
          usuarioId: userId,
          modelo,
          modeloId,
          fecha: new Date(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error al marcar registro como leído:', error);
      return { success: false };
    }
  }

  async verificarLecturaUsuario(modelo: string, modeloId: number): Promise<boolean> {
    const user = getUser();
    if (!user?.uid) {
      return false;
    }
    const userId = user.uid;

    const registro = await this.registroLeidoRepository.findOne({
      where: { usuarioId: userId, modelo, modeloId },
    });

    return !!registro;
  }

  async verificarLecturasUsuario(modelo: string, modeloIds: number[]): Promise<Map<number, boolean>> {
    const user = getUser();
    if (!user?.uid) {
      const mapa = new Map<number, boolean>();
      modeloIds.forEach(id => mapa.set(id, false));
      return mapa;
    }
    const userId = user.uid;

    if (modeloIds.length === 0) {
      return new Map();
    }

    const registros = await this.registroLeidoRepository.find({
      where: {
        usuarioId: userId,
        modelo,
        modeloId: In(modeloIds),
      },
    });

    const mapa = new Map<number, boolean>();
    modeloIds.forEach(id => mapa.set(id, false));
    registros.forEach(reg => mapa.set(reg.modeloId, true));

    return mapa;
  }

  async obtenerRegistrosLeidos(modelo: string): Promise<number[]> {
    const user = getUser();
    if (!user?.uid) {
      return [];
    }
    const userId = user.uid;

    const registros = await this.registroLeidoRepository.find({
      where: { usuarioId: userId, modelo },
      select: ['modeloId'],
    });

    return registros.map(r => r.modeloId);
  }

  async remove(modelo: string, modeloId: number): Promise<void> {
    await this.registroLeidoRepository.delete({ modelo, modeloId });
  }

  async obtenerFechaLectura(modelo: string, modeloId: number): Promise<Date | null> {
    const user = getUser();
    if (!user?.uid) {
      return null;
    }
    const userId = user.uid;

    const registro = await this.registroLeidoRepository.findOne({
      where: { usuarioId: userId, modelo, modeloId },
      select: ['fecha'],
    });

    return registro ? registro.fecha : null;
  }
}
