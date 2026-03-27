import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUser } from '@/helpers/get-user';
import { getTodayDateTime } from '@/helpers/date';
import { CreateOfertaAprobacionDto } from './dto/create-oferta-aprobacion.dto';
import { UpdateOfertaAprobacionDto } from './dto/update-oferta-aprobacion.dto';
import { AprobarOfertaAprobacionDto } from './dto/aprobar-oferta-aprobacion.dto';
import { RechazarOfertaAprobacionDto } from './dto/rechazar-oferta-aprobacion.dto';
import { OfertaAprobacion } from './entities/oferta-aprobacion.entity';
import { Oferta } from '@/modules/oferta/entities/oferta.entity';
import { EstadoCompras } from '@/modules/estado-compras/entities/estado-compras.entity';
import { NotificacionService } from '@/modules/notificacion/notificacion.service';
import { ESTADO_OFERTA_CODIGOS } from '@/constants/compras';
import { TIPO_NOTIFICACION } from '@/constants/notificaciones';
import { USER_SYSTEM_ID } from '@/constants/sistema';

@Injectable()
export class OfertaAprobacionService {
  constructor(
    @InjectRepository(OfertaAprobacion)
    private ofertaAprobacionRepository: Repository<OfertaAprobacion>,
    @InjectRepository(Oferta)
    private ofertaRepository: Repository<Oferta>,
    @InjectRepository(EstadoCompras)
    private estadoComprasRepository: Repository<EstadoCompras>,
    private notificacionService: NotificacionService,
  ) { }

  async create(createOfertaAprobacionDto: CreateOfertaAprobacionDto) {
    return await this.ofertaAprobacionRepository.save(createOfertaAprobacionDto);
  }

  async createBulk(ofertaAprobaciones: CreateOfertaAprobacionDto[]) {
    return await this.ofertaAprobacionRepository.save(ofertaAprobaciones);
  }

  async findByOferta(ofertaId: number): Promise<OfertaAprobacion[]> {
    return await this.ofertaAprobacionRepository.find({
      where: { ofertaId },
      relations: ['ofertaAprobacionTipo', 'aprobador'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    return await this.ofertaAprobacionRepository.findOne({
      where: { id },
      relations: ['ofertaAprobacionTipo', 'aprobador'],
    });
  }

  async aprobar(id: number, aprobarDto: AprobarOfertaAprobacionDto) {
    const aprobacion = await this.findOne(id);
    if (!aprobacion) {
      throw new BadRequestException('Aprobación no encontrada');
    }
    if (aprobacion.estado !== 'PENDIENTE') {
      throw new BadRequestException('Esta aprobación ya fue procesada');
    }

    const user = getUser();
    aprobacion.estado = 'APROBADO';
    aprobacion.aprobadorId = user.uid;
    aprobacion.motivo = aprobarDto.motivo;
    const resultado = await this.ofertaAprobacionRepository.save(aprobacion);

    // Verificar si todas las aprobaciones de esta oferta están aprobadas
    const todasAprobaciones = await this.findByOferta(aprobacion.ofertaId);
    const todasAprobadas = todasAprobaciones.every(a => a.estado === 'APROBADO');

    if (todasAprobadas) {
      // Cambiar el estado de la oferta a OF_APROBADA
      const estadoAprobada = await this.estadoComprasRepository.findOne({
        where: { codigo: ESTADO_OFERTA_CODIGOS.OF_ACEPTADA, tipo: 'OFERTA' }
      });

      if (estadoAprobada) {
        await this.ofertaRepository.update(
          { id: aprobacion.ofertaId },
          { estadoId: estadoAprobada.id }
        );

        // Notificar a los compradores asignados (pueden ser múltiples)
        const oferta = await this.ofertaRepository.findOne({
          where: { id: aprobacion.ofertaId },
          relations: ['items', 'items.solcomItem', 'items.solcomItem.comprador']
        });

        if (oferta?.items) {
          // Obtener compradores únicos de todos los items
          const compradoresIds = [...new Set(
            oferta.items
              .map(item => item.solcomItem?.compradorId)
              .filter(id => id !== null && id !== undefined)
          )];

          // Notificar a cada comprador
          for (const compradorId of compradoresIds) {
            await this.notificacionService.notificarAUsuario(
              compradorId,
              {
                tipoUsuario: 0,
                tipoNotificacion: TIPO_NOTIFICACION.OFERTA,
                usuarioOrigenId: USER_SYSTEM_ID,
                tipo: TIPO_NOTIFICACION.OFERTA,
                fecha: getTodayDateTime(),
                tipoId: aprobacion.ofertaId,
                nota: `La oferta #${aprobacion.ofertaId} ha sido aprobada y está lista para generar la orden de compra`
              }
            );
          }
        }
      }
    }

    return resultado;
  }

  async rechazar(id: number, rechazarDto: RechazarOfertaAprobacionDto) {
    const aprobacion = await this.findOne(id);
    if (!aprobacion) {
      throw new BadRequestException('Aprobación no encontrada');
    }
    if (aprobacion.estado !== 'PENDIENTE') {
      throw new BadRequestException('Esta aprobación ya fue procesada');
    }

    const user = getUser();
    aprobacion.estado = 'RECHAZADO';
    aprobacion.aprobadorId = user.uid;
    aprobacion.motivo = rechazarDto.motivo;

    const resultado = await this.ofertaAprobacionRepository.save(aprobacion);

    // Cambiar automáticamente el estado de la oferta a OF_RECHAZADA
    const estadoRechazada = await this.estadoComprasRepository.findOne({
      where: { codigo: ESTADO_OFERTA_CODIGOS.OF_RECHAZADA, tipo: 'OFERTA' }
    });

    if (estadoRechazada) {
      await this.ofertaRepository.update(
        { id: aprobacion.ofertaId },
        { estadoId: estadoRechazada.id }
      );

      // Notificar a los compradores asignados (pueden ser múltiples)
      const oferta = await this.ofertaRepository.findOne({
        where: { id: aprobacion.ofertaId },
        relations: ['items', 'items.solcomItem', 'items.solcomItem.comprador']
      });

      if (oferta?.items) {
        // Obtener compradores únicos de todos los items
        const compradoresIds = [...new Set(
          oferta.items
            .map(item => item.solcomItem?.compradorId)
            .filter(id => id !== null && id !== undefined)
        )];

        // Notificar a cada comprador
        for (const compradorId of compradoresIds) {
          await this.notificacionService.notificarAUsuario(
            compradorId,
            {
              tipoUsuario: 0,
              tipoNotificacion: TIPO_NOTIFICACION.OFERTA,
              usuarioOrigenId: USER_SYSTEM_ID,
              tipo: TIPO_NOTIFICACION.OFERTA,
              fecha: getTodayDateTime(),
              tipoId: aprobacion.ofertaId,
              nota: `La oferta #${aprobacion.ofertaId} ha sido rechazada. Motivo: ${rechazarDto.motivo || 'No especificado'}`
            }
          );
        }
      }
    }

    return resultado;
  }

  async update(id: number, updateOfertaAprobacionDto: UpdateOfertaAprobacionDto) {
    await this.ofertaAprobacionRepository.update({ id }, updateOfertaAprobacionDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const aprobacion = await this.findOne(id);
    await this.ofertaAprobacionRepository.delete({ id });
    return aprobacion;
  }
}
