import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { getTodayDateTime, getToday } from '@/helpers/date';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { IniciarPorOtDto } from './dto/iniciar-por-ot.dto';
import { Jornada } from './entities/jornada.entity';
import { JornadaPersona } from './entities/jornada-persona.entity';
import { JornadaFlota } from '@/modules/flota/entities/jornada-flota.entity';
import { JornadaEquipamiento } from '@/modules/equipamiento/entities/jornada-equipamiento.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { PresupuestoProduccion } from '@/modules/presupuesto-produccion/entities/presupuesto-produccion.entity';

@Injectable()
export class JornadaService {
  constructor(
    @InjectRepository(Jornada)
    private jornadaRepository: Repository<Jornada>,
    @InjectRepository(JornadaPersona)
    private jornadaPersonaRepository: Repository<JornadaPersona>,
    @InjectRepository(JornadaFlota)
    private jornadaFlotaRepository: Repository<JornadaFlota>,
    @InjectRepository(JornadaEquipamiento)
    private jornadaEquipamientoRepository: Repository<JornadaEquipamiento>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Presupuesto)
    private presupuestoRepository: Repository<Presupuesto>,
    @InjectRepository(PresupuestoProduccion)
    private presupuestoProduccionRepository: Repository<PresupuestoProduccion>,
  ) { }

  async create(createJornadaDto: CreateJornadaDto) {
    const { personasIds, personasTrabajos, flotaIds, flotas, equipamientoIds, equipamientos, ...jornadaData } = createJornadaDto;

    // Crear la jornada
    const jornada = await this.jornadaRepository.save(jornadaData);

    // Asociar personas con trabajos (nuevo formato)
    if (personasTrabajos && personasTrabajos.length > 0) {
      const jornadaPersonas = personasTrabajos.map(pt => ({
        jornadaId: jornada.id,
        personaId: pt.personaId,
        produccionTrabajoId: pt.produccionTrabajoId,
      }));
      await this.jornadaPersonaRepository.save(jornadaPersonas);
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (personasIds && personasIds.length > 0) {
      const jornadaPersonas = personasIds.map(personaId => ({
        jornadaId: jornada.id,
        personaId,
      }));
      await this.jornadaPersonaRepository.save(jornadaPersonas);
    }

    // Asociar flota con persona responsable (nuevo formato)
    if (flotas && flotas.length > 0) {
      const jornadaFlotas = flotas.map(f => ({
        jornadaId: jornada.id,
        flotaId: f.flotaId,
        personaResponsableId: f.personaResponsableId,
      }));
      await this.jornadaFlotaRepository.save(jornadaFlotas);
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (flotaIds && flotaIds.length > 0) {
      const jornadaFlotas = flotaIds.map(flotaId => ({
        jornadaId: jornada.id,
        flotaId,
      }));
      await this.jornadaFlotaRepository.save(jornadaFlotas);
    }

    // Asociar equipamiento real con persona responsable (nuevo formato)
    if (equipamientos && equipamientos.length > 0) {
      const jornadaEquipamientos = equipamientos.map(e => ({
        jornadaId: jornada.id,
        equipamientoId: e.equipamientoId,
        personaResponsableId: e.personaResponsableId,
      }));
      await this.jornadaEquipamientoRepository.save(jornadaEquipamientos);
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (equipamientoIds && equipamientoIds.length > 0) {
      const jornadaEquipamientos = equipamientoIds.map(equipamientoId => ({
        jornadaId: jornada.id,
        equipamientoId,
      }));
      await this.jornadaEquipamientoRepository.save(jornadaEquipamientos);
    }

    return await this.findOne(jornada.id);
  }

  async findAll(conditions: FindManyOptions<Jornada>): Promise<Jornada[]> {
    // Extraer y procesar filtros especiales antes de construir el query
    const where = conditions.where || {};
    const modifiedWhere = { ...where };

    // Verificar si hay filtro de persona para usar innerJoin
    const hasPersonaFilter = 'personaId' in modifiedWhere;
    const personaIdFilter = hasPersonaFilter ? modifiedWhere['personaId'] : null;
    if (hasPersonaFilter) {
      delete modifiedWhere['personaId'];
    }

    // Verificar si hay filtro de cliente
    const hasClienteFilter = 'clienteId' in modifiedWhere;
    const clienteIdFilter = hasClienteFilter ? modifiedWhere['clienteId'] : null;
    if (hasClienteFilter) {
      delete modifiedWhere['clienteId'];
    }

    // Verificar si hay filtro de trabajo de producción
    const hasTrabajoFilter = 'produccionTrabajoId' in modifiedWhere;
    const trabajoIdFilter = hasTrabajoFilter ? modifiedWhere['produccionTrabajoId'] : null;
    if (hasTrabajoFilter) {
      delete modifiedWhere['produccionTrabajoId'];
    }

    const qb = this.jornadaRepository
      .createQueryBuilder('jornada')
      .leftJoinAndSelect('jornada.presupuesto', 'presupuesto')
      .leftJoinAndSelect('presupuesto.cliente', 'cliente')
      .leftJoinAndSelect('jornada.jornadaFlotas', 'jornadaFlotas')
      .leftJoinAndSelect('jornadaFlotas.flota', 'flota')
      .leftJoinAndSelect('jornadaFlotas.personaResponsable', 'personaResponsable')
      .leftJoinAndSelect('jornada.jornadaEquipamientos', 'jornadaEquipamientos')
      .leftJoinAndSelect('jornadaEquipamientos.equipamiento', 'equipamiento')
      .leftJoinAndSelect('jornadaEquipamientos.personaResponsable', 'equipamientoResponsable');

    // Si hay filtro de persona, usar subquery para filtrar jornadas pero cargar TODAS las personas
    if (hasPersonaFilter) {
      qb.innerJoin('jornada.jornadaPersonas', 'jornadaPersonasFiltro', 'jornadaPersonasFiltro.personaId = :personaId', { personaId: personaIdFilter })
    }
    qb.leftJoinAndSelect('jornada.jornadaPersonas', 'jornadaPersonas')
      .leftJoinAndSelect('jornadaPersonas.persona', 'persona')
      .leftJoinAndSelect('jornadaPersonas.produccionTrabajo', 'produccionTrabajo');

    // Filtro de cliente: buscar por presupuesto.clienteId
    if (hasClienteFilter) {
      qb.andWhere('presupuesto.clienteId = :clienteId', { clienteId: clienteIdFilter });
    }

    // Filtro de trabajo de producción: buscar por jornadaPersonas.produccionTrabajoId
    if (hasTrabajoFilter) {
      qb.andWhere('jornadaPersonas.produccionTrabajoId = :trabajoId', { trabajoId: trabajoIdFilter });
    }

    // Aplicar el resto de filtros usando el helper estándar
    buildWhereAndOrderQuery(qb, { ...conditions, where: modifiedWhere }, 'jornada');

    return await qb.getMany();
  }

  async findOne(id: number) {
    return await this.jornadaRepository.findOne({
      where: { id },
      relations: [
        'jornadaPersonas',
        'jornadaPersonas.persona',
        'jornadaPersonas.produccionTrabajo',
        'presupuesto',
        'presupuesto.cliente',
        'jornadaFlotas',
        'jornadaFlotas.flota',
        'jornadaFlotas.personaResponsable',
        'jornadaEquipamientos',
        'jornadaEquipamientos.equipamiento',
        'jornadaEquipamientos.personaResponsable',
      ],
    });
  }

  async update(id: number, updateJornadaDto: UpdateJornadaDto) {
    const { personasIds, personasTrabajos, flotaIds, flotas, equipamientoIds, equipamientos, ...jornadaData } = updateJornadaDto;

    // Actualizar la jornada
    await this.jornadaRepository.update({ id }, jornadaData);

    // Actualizar personas con trabajos (nuevo formato)
    if (personasTrabajos !== undefined) {
      await this.jornadaPersonaRepository.delete({ jornadaId: id });

      if (personasTrabajos.length > 0) {
        const jornadaPersonas = personasTrabajos.map(pt => ({
          jornadaId: id,
          personaId: pt.personaId,
          produccionTrabajoId: pt.produccionTrabajoId,
        }));
        await this.jornadaPersonaRepository.save(jornadaPersonas);
      }
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (personasIds !== undefined) {
      await this.jornadaPersonaRepository.delete({ jornadaId: id });

      if (personasIds.length > 0) {
        const jornadaPersonas = personasIds.map(personaId => ({
          jornadaId: id,
          personaId,
        }));
        await this.jornadaPersonaRepository.save(jornadaPersonas);
      }
    }

    // Actualizar flota con persona responsable (nuevo formato)
    if (flotas !== undefined) {
      await this.jornadaFlotaRepository.delete({ jornadaId: id });

      if (flotas.length > 0) {
        const jornadaFlotas = flotas.map(f => ({
          jornadaId: id,
          flotaId: f.flotaId,
          personaResponsableId: f.personaResponsableId,
        }));
        await this.jornadaFlotaRepository.save(jornadaFlotas);
      }
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (flotaIds !== undefined) {
      await this.jornadaFlotaRepository.delete({ jornadaId: id });

      if (flotaIds.length > 0) {
        const jornadaFlotas = flotaIds.map(flotaId => ({
          jornadaId: id,
          flotaId,
        }));
        await this.jornadaFlotaRepository.save(jornadaFlotas);
      }
    }

    // Actualizar equipamiento real
    if (equipamientos !== undefined) {
      await this.jornadaEquipamientoRepository.delete({ jornadaId: id });

      if (equipamientos.length > 0) {
        const jornadaEquipamientos = equipamientos.map(e => ({
          jornadaId: id,
          equipamientoId: e.equipamientoId,
          personaResponsableId: e.personaResponsableId,
        }));
        await this.jornadaEquipamientoRepository.save(jornadaEquipamientos);
      }
    }
    // Mantener compatibilidad con formato anterior (solo IDs)
    else if (equipamientoIds !== undefined) {
      await this.jornadaEquipamientoRepository.delete({ jornadaId: id });

      if (equipamientoIds.length > 0) {
        const jornadaEquipamientos = equipamientoIds.map(equipamientoId => ({
          jornadaId: id,
          equipamientoId,
        }));
        await this.jornadaEquipamientoRepository.save(jornadaEquipamientos);
      }
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const jornada = await this.findOne(id);
    await this.jornadaRepository.delete({ id });
    return jornada;
  }

  async cancelar(id: number, motivo?: string) {
    const jornada = await this.findOne(id);
    if (!jornada) {
      throw new Error('Jornada no encontrada');
    }
    if (jornada.cancelado === 1) {
      throw new Error('La jornada ya está cancelada');
    }

    await this.jornadaRepository.update({ id }, {
      cancelado: 1,
      motivoCancelacion: motivo || jornada.motivoCancelacion
    });
    return await this.findOne(id);
  }

  async updateFlota(jornadaId: number, flotaIds: number[]) {
    await this.jornadaFlotaRepository.delete({ jornadaId });

    if (flotaIds && flotaIds.length > 0) {
      const jornadaFlotas = flotaIds.map(flotaId => ({
        jornadaId,
        flotaId,
      }));
      await this.jornadaFlotaRepository.save(jornadaFlotas);
    }

    return await this.findOne(jornadaId);
  }

  async misAsignaciones(dni: string, fecha?: string) {
    const fechaBusqueda = fecha ?? getToday();

    const persona = await this.personaRepository.findOne({ where: { dni } });
    if (!persona) {
      throw new NotFoundException('DNI no encontrado');
    }

    const asignaciones = await this.jornadaPersonaRepository
      .createQueryBuilder('jp')
      .innerJoinAndSelect('jp.jornada', 'jornada')
      .leftJoinAndSelect('jp.produccionTrabajo', 'produccionTrabajo')
      .leftJoinAndSelect('jornada.presupuesto', 'presupuesto')
      .leftJoinAndSelect('presupuesto.cliente', 'cliente')
      .where('jp.personaId = :personaId', { personaId: persona.id })
      .andWhere('jornada.fecha = :fecha', { fecha: fechaBusqueda })
      .andWhere('jornada.cancelado = 0')
      .getMany();

    return asignaciones.map(jp => ({
      ...jp,
      persona,
      estado: !jp.inicio ? 'sin_iniciar' : !jp.fin ? 'en_progreso' : 'completada',
    }));
  }

  async iniciarAsignacion(id: number) {
    const asignacion = await this.jornadaPersonaRepository.findOne({
      where: { id },
      relations: ['jornada', 'produccionTrabajo', 'persona'],
    });
    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada');
    }
    if (asignacion.inicio) {
      throw new BadRequestException('Esta asignación ya fue iniciada');
    }
    await this.jornadaPersonaRepository.update({ id }, { inicio: getTodayDateTime() });
    return await this.jornadaPersonaRepository.findOne({
      where: { id },
      relations: ['jornada', 'produccionTrabajo', 'persona', 'jornada.presupuesto', 'jornada.presupuesto.cliente'],
    });
  }

  async finalizarAsignacion(id: number) {
    const asignacion = await this.jornadaPersonaRepository.findOne({
      where: { id },
      relations: ['jornada', 'produccionTrabajo', 'persona'],
    });
    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada');
    }
    if (!asignacion.inicio) {
      throw new BadRequestException('Esta asignación no fue iniciada');
    }
    if (asignacion.fin) {
      throw new BadRequestException('Esta asignación ya fue finalizada');
    }
    await this.jornadaPersonaRepository.update({ id }, { fin: getTodayDateTime() });
    return await this.jornadaPersonaRepository.findOne({
      where: { id },
      relations: ['jornada', 'produccionTrabajo', 'persona', 'jornada.presupuesto', 'jornada.presupuesto.cliente'],
    });
  }

  async enCurso() {
    const hoy = getToday();
    const asignaciones = await this.jornadaPersonaRepository
      .createQueryBuilder('jp')
      .innerJoinAndSelect('jp.jornada', 'jornada')
      .innerJoinAndSelect('jp.persona', 'persona')
      .leftJoinAndSelect('jp.produccionTrabajo', 'produccionTrabajo')
      .leftJoinAndSelect('jornada.presupuesto', 'presupuesto')
      .leftJoinAndSelect('presupuesto.cliente', 'cliente')
      .where('jornada.fecha = :hoy', { hoy })
      .andWhere('jp.inicio IS NOT NULL')
      .andWhere('jp.fin IS NULL')
      .andWhere('jornada.cancelado = 0')
      .orderBy('jp.inicio', 'ASC')
      .getMany();

    return asignaciones;
  }

  async iniciarPorOt(dto: IniciarPorOtDto) {
    const { otId, produccionTrabajoId, personaDni } = dto;

    const presupuesto = await this.presupuestoRepository.findOne({ where: { id: otId } });
    if (!presupuesto) {
      throw new NotFoundException(`OT #${otId} no encontrada`);
    }

    const trabajoEnOt = await this.presupuestoProduccionRepository.findOne({
      where: { presupuestoId: otId, trabajoId: produccionTrabajoId },
    });
    if (!trabajoEnOt) {
      throw new BadRequestException(`El trabajo #${produccionTrabajoId} no pertenece a la OT #${otId}`);
    }

    const persona = await this.personaRepository.findOne({ where: { dni: personaDni } });
    if (!persona) {
      throw new NotFoundException(`Persona con DNI ${personaDni} no encontrada`);
    }

    const hoy = getToday();
    let jornada = await this.jornadaRepository.findOne({
      where: { presupuestoId: otId, fecha: hoy, cancelado: 0 },
    });
    if (!jornada) {
      jornada = await this.jornadaRepository.save({
        presupuestoId: otId,
        fecha: hoy,
        detalle: 'Generada automáticamente',
      });
    }

    const asignacionExistente = await this.jornadaPersonaRepository.findOne({
      where: {
        jornadaId: jornada.id,
        personaId: persona.id,
        produccionTrabajoId,
      },
    });
    if (asignacionExistente) {
      throw new BadRequestException(`Ya tenés ese trabajo iniciado en esta jornada`);
    }

    const nuevaAsignacion = await this.jornadaPersonaRepository.save({
      jornadaId: jornada.id,
      personaId: persona.id,
      produccionTrabajoId,
      inicio: getTodayDateTime(),
    });

    return await this.jornadaPersonaRepository.findOne({
      where: { id: nuevaAsignacion.id },
      relations: ['jornada', 'jornada.presupuesto', 'jornada.presupuesto.cliente', 'produccionTrabajo', 'persona'],
    });
  }

  async trabajosDisponiblesPorOt(otId: number) {
    const presupuesto = await this.presupuestoRepository.findOne({
      where: { id: otId },
      relations: ['cliente'],
    });
    if (!presupuesto) {
      throw new NotFoundException(`OT #${otId} no encontrada`);
    }

    const trabajos = await this.presupuestoProduccionRepository.find({
      where: { presupuestoId: otId, terminado: 0 },
      relations: ['trabajo'],
    });

    return { presupuesto, trabajos };
  }

  async estadisticas(desde?: string, hasta?: string) {
    const hoy = getToday();
    const primerDiaMes = hoy.substring(0, 7) + '-01';
    const fechaDesde = desde ?? primerDiaMes;
    const fechaHasta = hasta ?? hoy;

    const asignaciones = await this.jornadaPersonaRepository
      .createQueryBuilder('jp')
      .innerJoinAndSelect('jp.jornada', 'jornada')
      .innerJoinAndSelect('jp.persona', 'persona')
      .leftJoinAndSelect('jp.produccionTrabajo', 'produccionTrabajo')
      .leftJoinAndSelect('jornada.presupuesto', 'presupuesto')
      .leftJoinAndSelect('presupuesto.cliente', 'cliente')
      .where('jornada.fecha >= :desde', { desde: fechaDesde })
      .andWhere('jornada.fecha <= :hasta', { hasta: fechaHasta })
      .andWhere('jp.inicio IS NOT NULL')
      .andWhere('jp.fin IS NOT NULL')
      .getMany();

    return asignaciones;
  }
}
