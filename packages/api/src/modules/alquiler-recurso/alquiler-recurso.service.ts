import { Injectable } from '@nestjs/common';
import { CreateAlquileRecursorDto } from './dto/create-alquiler-recurso.dto';
import { UpdateAlquilerRecursoDto } from './dto/update-alquiler-recurso.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { AlquilerRecurso } from './entities/alquiler-recurso.entity'
import { transformToGenericFiltersAndOrderQueryBuilder } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlquilerRecursoService {
  constructor(
    @InjectRepository(AlquilerRecurso)
    private alquilerRecursoRepositoy: Repository<AlquilerRecurso>,
  ) { }

  create(createAlquilerRecursoDto: CreateAlquileRecursorDto) {
    return this.alquilerRecursoRepositoy.save(createAlquilerRecursoDto);
  }

  async findAll(conditions: FindManyOptions<AlquilerRecurso>): Promise<(AlquilerRecurso & { estado: string; otActivaId: number | null; mantenimientoActivo: boolean; vencimientoContrato: string | null; clienteNombre: string | null })[]> {
    const ESTADO = 'estado';
    const { where = {}, order = {}, take, skip } = conditions;
    const estadoWhere = where[ESTADO] || null;

    const queryBuilder = this.alquilerRecursoRepositoy
      .createQueryBuilder('recurso')
      .leftJoin('recurso.alquileres', 'alquiler',
        '(alquiler.inicioContrato <= CURRENT_DATE AND alquiler.fechaLimiteNegociacion >= CURRENT_DATE) OR ' +
        '(alquiler.inicioContrato <= CURRENT_DATE AND ((alquiler.vencimientoContrato IS NULL AND alquiler.fechaLimiteNegociacion IS NULL) OR alquiler.vencimientoContrato >= CURRENT_DATE))  '
      )
      .leftJoin('alquiler.cliente', 'cliente')
      .leftJoin('cartel', 'cartel', 'cartel.recurso_id = recurso.id')
      .addSelect([
        `COALESCE(alquiler.estado, 'LIBRE') AS estado`,
        `alquiler.vencimientoContrato AS vencimiento_contrato`,
        `cliente.nombre AS cliente_nombre`,
        `(SELECT p.id FROM presupuesto p
            WHERE p.alquiler_recurso_id = recurso.id
            AND p.produccion_estatus = 'pendiente'
            LIMIT 1
          ) AS ot_activa_id`,
        `cartel.id AS cartel_id`,
        `cartel.formato AS cartel_formato`,
        `cartel.alto AS cartel_alto`,
        `cartel.largo AS cartel_largo`,
        `cartel.localidad AS cartel_localidad`,
        `cartel.zona AS cartel_zona`,
        `cartel.coordenadas AS cartel_coordenadas`,
      ]);

    // estado es un campo calculado, no una columna real — se filtra con andWhere
    if (estadoWhere) {
      queryBuilder.andWhere(
        `COALESCE(alquiler.estado, 'LIBRE') = :estado`,
        { estado: estadoWhere }
      );
      delete where[ESTADO];
    }

    if (skip) queryBuilder.offset(skip);
    if (take) queryBuilder.limit(take);

    transformToGenericFiltersAndOrderQueryBuilder(where, order, queryBuilder, 'recurso');
    const recursos = await queryBuilder.getRawAndEntities();

    const rawById = new Map(recursos.raw.map((r) => [r.recurso_id, r]));

    return recursos.entities.map((recurso) => {
      const raw = rawById.get(recurso.id);
      const cartel = raw?.cartel_id ? {
        id: raw.cartel_id,
        formato: raw.cartel_formato,
        alto: raw.cartel_alto,
        largo: raw.cartel_largo,
        localidad: raw.cartel_localidad,
        zona: raw.cartel_zona,
        coordenadas: raw.cartel_coordenadas,
      } : null;
      return {
        ...recurso,
        estado: raw?.estado,
        otActivaId: raw?.ot_activa_id ?? null,
        mantenimientoActivo: raw?.ot_activa_id != null,
        vencimientoContrato: raw?.vencimiento_contrato ?? null,
        clienteNombre: raw?.cliente_nombre ?? null,
        cartel,
      };
    });
  }

  async findOne(id: number): Promise<AlquilerRecurso & { otActivaId: number | null; mantenimientoActivo: boolean }> {
    const recurso = await this.alquilerRecursoRepositoy.findOneBy({ id });
    const raw = await this.alquilerRecursoRepositoy.query(
      `SELECT p.id AS ot_activa_id FROM presupuesto p
        WHERE p.alquiler_recurso_id = ?
        AND p.produccion_estatus = 'pendiente'
        LIMIT 1`,
      [id]
    );
    const otActivaId = raw?.[0]?.ot_activa_id ?? null;
    return {
      ...recurso,
      otActivaId,
      mantenimientoActivo: otActivaId != null,
    };
  }

  async update(id: number, updateAreaDto: UpdateAlquilerRecursoDto) {
    await this.alquilerRecursoRepositoy.update({ id }, updateAreaDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const element = await this.findOne(id);
    await this.alquilerRecursoRepositoy.delete({ id });
    return element;
  }
}
