import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';
import { Repository, FindManyOptions, IsNull, Brackets } from 'typeorm';
import { Alquiler } from './entities/alquiler.entity';
import { AlquilerPrecio } from '@/modules/alquiler-precio/entities/alquiler-precio.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';
import { Cobro } from '@/modules/cobro/entities/cobro.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { transformToGenericFiltersAndOrderQueryBuilder, transformCustomFilterQueryBuilder } from '@/helpers/filter-utils';
import { OrderValues } from '@/types';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { getToday } from '@/helpers/date'

@Injectable()
export class AlquilerService {
  constructor(
    @InjectRepository(Alquiler)
    private readonly alquilerRepository: Repository<Alquiler>,
    @InjectRepository(AlquilerPrecio)
    private readonly alquilerPrecioRepository: Repository<AlquilerPrecio>,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(Cobro)
    private readonly cobroRepository: Repository<Cobro>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(AlquilerRecurso)
    private readonly alquilerRecursoRepository: Repository<AlquilerRecurso>,
  ) { }

  async create(createAlquilerDto: CreateAlquilerDto): Promise<Alquiler> {
    const alquiler = this.alquilerRepository.create(createAlquilerDto);
    const savedAlquiler = await this.alquilerRepository.save(alquiler); // Guardar y obtener el alquiler con ID

    const { precio, clienteId, localidad, zona, alquilerRecursoId } = createAlquilerDto;

    // Si ya existe un precio para este recurso, le asignamos fechaFin a la fecha de hoy
    await this.alquilerPrecioRepository
      .createQueryBuilder()
      .update()
      .set({ fechaFin: new Date() })
      .where("alquiler_recurso_id = :alquilerRecursoId", { alquilerRecursoId })
      .andWhere("fecha_fin IS NULL")  // Aseguramos que estamos modificando el precio activo
      .execute();

    // Luego creamos un nuevo precio
    await this.crearNuevoPrecio(precio, clienteId, localidad, zona, alquilerRecursoId);

    return savedAlquiler;
  }

  async findAll(conditions: FindManyOptions<Alquiler>): Promise<Alquiler[]> {

    const ESTADO_FACTURACION = 'estadoFacturacion';
    const ESTADO_COBRANZA = 'estadoCobranza';
    const ESTADO = 'estado';
    const { where = {}, order = {}, take, skip } = conditions;
    const fechaActual = getToday();

    const estadoFacturacionWhere = where[ESTADO_FACTURACION] || null;
    const estadoCobranzaWhere = where[ESTADO_COBRANZA] || null;
    const estadoWhere = where[ESTADO] || null; // Nuevo: obtenemos el filtro de estado


    const queryBuilder = this.alquilerRepository
      .createQueryBuilder('alquiler')
      .leftJoinAndSelect('alquiler.cliente', 'cliente') // JOIN con la tabla cliente
      .leftJoin('factura', 'facturas', 'facturas.modelo = :modelo AND facturas.modelo_id = alquiler.id', { modelo: 'alquiler' })
      .leftJoin('cobro', 'cobros', 'cobros.factura_id = facturas.id')
      .leftJoinAndSelect('alquiler.alquilerRecurso', 'alquiler_recurso')
      .leftJoinAndSelect(
        'alquiler_recurso.precios',
        'ultimo_precio',
        'ultimo_precio.id = (SELECT MAX(ap.id) FROM alquiler_precio ap WHERE ap.alquiler_recurso_id = alquiler_recurso.id)'
      )
      .addSelect([
        'facturas.id',
        'facturas.fecha',
        'facturas.inicioPeriodo',
        'facturas.finPeriodo',
        'facturas.monto',
        'facturas.folio',
        'facturas.fechaVencimiento'
      ]);
    if (estadoWhere === 'VIGENTE') {
      queryBuilder.andWhere('alquiler.estado = :estado', { estado: 'ARRENDADO' })
        .andWhere('alquiler.inicioContrato <= :currentDate', { currentDate: fechaActual })
        .andWhere(
          new Brackets(qb =>
            qb.where('alquiler.vencimientoContrato IS NULL')
              .orWhere('alquiler.vencimientoContrato >= :currentDate', { currentDate: fechaActual })
          )
        );
      delete where[ESTADO];
    }


    if (estadoWhere === 'FINALIZADO') {
      queryBuilder.andWhere('alquiler.vencimientoContrato < :currentDate', { currentDate: fechaActual });
      delete where[ESTADO];
    }

    if (estadoWhere === 'MANTENIMIENTO') {
      queryBuilder
        .leftJoin('alquiler.alquilerRecurso', 'recurso_mantenimiento')
        .leftJoin('recurso_mantenimiento.presupuestos', 'presupuesto_mantenimiento')
        .andWhere('presupuesto_mantenimiento.produccionEstatus = :estatusPendiente', {
          estatusPendiente: 'pendiente',
        });
      delete where[ESTADO];
    }
    if (estadoFacturacionWhere === 'PENDIENTE') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('facturas.id IS NULL') // Facturas no existen
            .orWhere('facturas.fin_periodo < :currentDate', { currentDate: fechaActual }); // Facturas vencidas
        }),
      )
        .andWhere(
          new Brackets((qb) => {
            qb.where(() => {
              const subQueryBuilder = this.facturaRepository
                .createQueryBuilder('facturas2')
                .select('1')
                .where('facturas2.modelo = :modelo', { modelo: 'alquiler' })
                .andWhere('facturas2.modelo_id = alquiler.id')
                .andWhere('facturas2.fin_periodo > :currentDate', { currentDate: fechaActual });
              return `NOT EXISTS (${subQueryBuilder.getQuery()})`;
            });
          }),
        );
      delete where[ESTADO_FACTURACION];
    }
    if (estadoFacturacionWhere === 'FACTURADO') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('facturas.fin_periodo >= :currentDate', { currentDate: fechaActual })
            .andWhere('facturas.inicio_periodo <= :currentDate', { currentDate: fechaActual });
        }),
      );
      delete where[ESTADO_FACTURACION];
    }

    if (estadoCobranzaWhere === 'PENDIENTE') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(() => {
            // No existe cobro asociado a una factura en el periodo actual
            const subQueryBuilder = this.cobroRepository
              .createQueryBuilder('cobro_pendiente')
              .select('1')
              .innerJoin('factura', 'factura_pendiente', 'factura_pendiente.id = cobro_pendiente.factura_id')
              .where('factura_pendiente.modelo = \'alquiler\'')
              .andWhere('factura_pendiente.modelo_id = alquiler.id')
              .andWhere(`factura_pendiente.inicio_periodo <= '${fechaActual}'`)
              .andWhere(`factura_pendiente.fin_periodo >= '${fechaActual}'`);
            return `NOT EXISTS (${subQueryBuilder.getQuery()})`;
          });
        }),
      );
      delete where[ESTADO_COBRANZA];
    }
    if (estadoCobranzaWhere === 'COBRADO') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(() => {
            // Existe cobro asociado a una factura en el periodo actual
            const subQueryBuilder = this.cobroRepository
              .createQueryBuilder('cobro_cobrado')
              .select('1')
              .innerJoin('factura', 'factura_cobrada', 'factura_cobrada.id = cobro_cobrado.factura_id')
              .where('factura_cobrada.modelo = \'alquiler\'')
              .andWhere('factura_cobrada.modelo_id = alquiler.id')
              .andWhere(`factura_cobrada.inicio_periodo <= '${fechaActual}'`)
              .andWhere(`factura_cobrada.fin_periodo >= '${fechaActual}'`);
            return `EXISTS (${subQueryBuilder.getQuery()})`;
          });
        }),
      );
      delete where[ESTADO_COBRANZA];
    }
    if (where['cliente']) {
      transformCustomFilterQueryBuilder(where, queryBuilder, 'cliente', 'nombre', where['cliente'])
      delete where['cliente']

    }
    if (order['cliente']) {
      queryBuilder.addOrderBy('cliente.nombre', order['cliente'] as Extract<OrderValues, 'ASC' | 'DESC'>
      );
      delete order['cliente']
    }

    if (where['codigo']) {
      transformCustomFilterQueryBuilder(where, queryBuilder, 'alquiler_recurso', 'codigo', where['codigo'])
      delete where['codigo']

    }
    if (order['codigo']) {
      queryBuilder.addOrderBy('alquiler_recurso.codigo', order['codigo'] as Extract<OrderValues, 'ASC' | 'DESC'>

      );
      delete order['codigo']
    }
    transformToGenericFiltersAndOrderQueryBuilder(where, order, queryBuilder, 'alquiler')

    if (take) queryBuilder.take(take);
    if (skip) queryBuilder.skip(skip);
    const results = await queryBuilder.getMany();
    const alquileres = [];
    for (const alquiler of results) {
      // Cargar facturas de la nueva tabla factura
      const facturas = await this.facturaRepository.find({
        where: {
          modelo: 'alquiler',
          modeloId: alquiler.id,
        }
      });

      const tieneFacturaActiva = facturas.some(
        (factura) =>
          factura.finPeriodo >= (fechaActual) &&
          factura.inicioPeriodo <= (fechaActual)
      );
      alquiler['estadoFacturacion'] = tieneFacturaActiva ? 'FACTURADO' : 'PENDIENTE';

      // Verificar si existe cobro asociado a una factura en el periodo actual
      const tieneCobroActivo = await this.cobroRepository
        .createQueryBuilder('cobro')
        .innerJoin('factura', 'factura', 'factura.id = cobro.factura_id')
        .where('factura.modelo = :modeloAlquiler', { modeloAlquiler: 'alquiler' })
        .andWhere('factura.modelo_id = :alquilerId', { alquilerId: alquiler.id })
        .andWhere('factura.inicio_periodo <= :currentDate', { currentDate: fechaActual })
        .andWhere('factura.fin_periodo >= :currentDate', { currentDate: fechaActual })
        .getExists();


      alquiler['estadoCobranza'] = tieneCobroActivo ? 'COBRADO' : 'PENDIENTE';
      console.log({ tieneCobroActivo, fechaActual });
      alquiler['contratoArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'alquiler',
          modeloId: alquiler.id,
          tipo: 'contrato'
        },
        order: {
          id: 'DESC'
        }
      });

      alquiler['fichaTecnicaArchivo'] = await this.archivoRepository.findOne({
        where: {
          modelo: 'alquiler',
          modeloId: alquiler.id,
          tipo: 'ficha_tecnica'
        },
        order: {
          id: 'DESC'
        }
      });
      alquiler['estadoPrecio'] = getEstadoPrecio(
        alquiler.alquilerRecurso?.precios?.[0]?.fechaDesde,
        parseInt(alquiler.periodicidadActualizacion)
      )
      alquileres.push(alquiler);
    }

    return alquileres;
  }


  async findOne(id: number): Promise<Alquiler> {
    const alquiler = await this.alquilerRepository.findOne({
      where: { id }, relations: {
        cliente: true,
        alquilerRecurso: true
      }
    })

    if (!alquiler) throw new NotFoundException(`Alquiler #${id} not found`);
    alquiler['contratoArchivo'] = await this.archivoRepository.findOne({
      where: {
        modelo: 'alquiler',
        modeloId: alquiler.id,
        tipo: 'contrato'
      },
      order: {
        id: 'DESC'
      }
    });

    alquiler['fichaTecnicaArchivo'] = await this.archivoRepository.findOne({
      where: {
        modelo: 'alquiler',
        modeloId: alquiler.id,
        tipo: 'ficha_tecnica'
      },
      order: {
        id: 'DESC'
      }
    });
    return alquiler;
  }

  async update(id: number, updateAlquilerDto: UpdateAlquilerDto): Promise<Alquiler> {
    const { precio, clienteId, localidad, zona, alquilerRecursoId } = updateAlquilerDto;

    const alquilerPrecio = await this.alquilerPrecioRepository.findOne({
      where: {
        alquilerRecursoId,
        fechaFin: IsNull(),  // Verificamos si el precio está activo
      },
    });

    if (alquilerPrecio) {
      // Si existe un precio activo, lo actualizamos
      alquilerPrecio.precio = precio;
      alquilerPrecio.clienteId = clienteId;
      alquilerPrecio.localidad = localidad;
      alquilerPrecio.zona = zona;

      // Guardamos el precio actualizado
      await this.alquilerPrecioRepository.save(alquilerPrecio);

      // Actualizamos el recurso con el nuevo precio
      await this.alquilerRecursoRepository.update(alquilerRecursoId, { precio });
    } else {
      // Si no existe un precio activo, creamos uno nuevo
      await this.crearNuevoPrecio(precio, clienteId, localidad, zona, alquilerRecursoId);
    }

    // Ahora actualizamos el alquiler
    await this.alquilerRepository.update(id, updateAlquilerDto);

    return this.findOne(id); // Devolvemos el alquiler actualizado
  }

  async updatePrice(id: number, updateAlquilerDto: UpdateAlquilerDto): Promise<Alquiler> {
    const { precio, clienteId, localidad, zona, alquilerRecursoId } = updateAlquilerDto; // Suponiendo que el precio viene en el DTO
    const today = new Date();

    // Actualiza cualquier registro con `fechaFin` en null para este alquiler
    await this.alquilerPrecioRepository
      .createQueryBuilder()
      .update()
      .set({ fechaFin: today })
      .where("alquiler_recurso_id = :alquilerRecursoId", { alquilerRecursoId })
      .andWhere("fecha_fin IS NULL")
      .execute();

    await this.alquilerPrecioRepository.save({
      alquilerRecurso: { id: alquilerRecursoId },
      precio,
      fechaDesde: today,
      fechaFin: null,
      clienteId,
      localidad,
      zona
    });

    await this.alquilerRepository.update(id, updateAlquilerDto);
    await this.alquilerRecursoRepository.update(alquilerRecursoId, { precio });

    // alquilerRecursoRepository

    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const result = await this.alquilerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alquiler #${id} not found`);
    }
  }

  async crearNuevoPrecio(precio: number, clienteId: number, localidad: string, zona: string, alquilerRecursoId: number) {
    const today = new Date();

    const nuevoPrecio = this.alquilerPrecioRepository.create({
      alquilerRecursoId,
      precio,
      clienteId,
      fechaDesde: today,
      fechaFin: null, // Este nuevo precio no tiene fecha de fin aún
      localidad,
      zona,
    });

    // Guardamos el nuevo precio
    await this.alquilerPrecioRepository.save(nuevoPrecio);

    // Actualizamos el recurso con el nuevo precio
    await this.alquilerRecursoRepository.update(alquilerRecursoId, { precio });
  }


  // async crearAlquilerPrecio(precio: number, clienteId: number, localidad: string, zona: string, alquilerRecursoId: number) {
  //   let alquilerPrecio = await this.alquilerPrecioRepository.findOne({
  //     where: {
  //       alquilerRecursoId,
  //       fechaFin: IsNull(),
  //     },
  //   });
  //   const today = new Date();



  //   if (alquilerPrecio) {
  //     // El recurso ya tiene un precio 
  //     alquilerPrecio.precio = precio;
  //     alquilerPrecio.clienteId = clienteId
  //     alquilerPrecio.localidad = localidad
  //     alquilerPrecio.zona = zona
  //     await this.alquilerPrecioRepository.save(alquilerPrecio);
  //     await this.alquilerRecursoRepository.update(alquilerRecursoId, { precio });

  //   } else if (precio) {

  //     alquilerPrecio = this.alquilerPrecioRepository.create({
  //       alquilerRecursoId,
  //       precio,
  //       clienteId,
  //       fechaDesde: today,
  //       fechaFin: null, // Nuevo registro no tiene fecha de fin,
  //       localidad,
  //       zona
  //     });

  //     await this.alquilerPrecioRepository.save(alquilerPrecio);
  //     await this.alquilerRecursoRepository.update(alquilerRecursoId, { precio });

  //   }


  // }

}


function getEstadoPrecio(
  fechaDesde: string | Date,
  periodicidadMeses: number
): "VENCIDO" | "VENCIMIENTO_PROXIMO" | "VENCIMIENTO_CERCANO" | "VIGENTE" {
  if (!fechaDesde || !periodicidadMeses) return "VIGENTE"; // O manejar como error

  const fechaActual = new Date();
  const fechaInicio = new Date(fechaDesde);

  // Calcular fecha de vencimiento (fechaDesde + periodicidad)
  const fechaVencimiento = new Date(fechaInicio);
  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + periodicidadMeses);

  // Diferencia en días (puede ser negativo si ya venció)
  const diffDias = Math.floor(
    (fechaVencimiento.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Clasificar el estado
  if (diffDias < 0) {
    return "VENCIDO";
  } else if (diffDias <= 5) {
    return "VENCIMIENTO_PROXIMO";
  } else if (diffDias <= 10) {
    return "VENCIMIENTO_CERCANO";
  } else {
    return "VIGENTE";
  }
}