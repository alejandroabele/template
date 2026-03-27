import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, FindManyOptions } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { CreateCashflowTransaccionDto } from './dto/create-cashflow-transaccion.dto';
import { UpdateCashflowTransaccionDto } from './dto/update-cashflow-transaccion.dto';
import { CashflowTransaccion } from './entities/cashflow-transaccion.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { BANCOS, COBROS, FACTURACION, PRESUPUESTO } from '@/constants/eventos';
import { CATEGORIAS, CATEGORIAS_CODIGOS } from '@/constants/cashflow';
import { addDaysToDateString, getToday } from '@/helpers/date';
import { CashflowCategoria } from '@/modules/cashflow-categoria/entities/cashflow-categoria.entity';
import { parseISO, addMonths, format, lastDayOfMonth, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { BancoSaldo } from '../banco-saldo/entities/banco-saldo.entity';
import { Banco } from '../banco/entities/banco.entity';
import { calcularIva } from '@/helpers/iva';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { Factura } from '../factura/entities/factura.entity';
import { ExcelReaderService } from '@/services/excel-reader/excel-reader.service';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';
@Injectable()
export class CashflowTransaccionService {
  constructor(
    @InjectRepository(CashflowTransaccion)
    private cashflowTransaccionRepository: Repository<CashflowTransaccion>,
    @InjectRepository(CashflowCategoria)
    private cashflowCategoriaRepository: Repository<CashflowCategoria>,
    @InjectRepository(BancoSaldo)
    private bancoSaldoRepository: Repository<BancoSaldo>,
    @InjectRepository(Banco)
    private bancoRepository: Repository<Banco>,
    private readonly excelReaderService: ExcelReaderService,
    private readonly excelExportService: ExcelExportService,
  ) { }

  async create(createCashflowTransaccionDto: CreateCashflowTransaccionDto): Promise<CashflowTransaccion> {
    const transaccion = this.cashflowTransaccionRepository.create(createCashflowTransaccionDto);
    return await this.cashflowTransaccionRepository.save(transaccion);
  }

  async findAll(): Promise<CashflowTransaccion[]> {
    return await this.cashflowTransaccionRepository.find({
      relations: ['categoria', 'banco'],
    });
  }

  async findBusqueda(conditions: FindManyOptions<CashflowTransaccion>): Promise<CashflowTransaccion[]> {
    const qb = this.cashflowTransaccionRepository.createQueryBuilder('cashflowTransaccion');
    qb.leftJoinAndSelect('cashflowTransaccion.categoria', 'categoria');
    qb.andWhere('cashflowTransaccion.proyectado = :proyectado', { proyectado: false });
    buildWhereAndOrderQuery(qb, conditions, 'cashflowTransaccion');
    if (!conditions.order || Object.keys(conditions.order).length === 0) {
      qb.orderBy('cashflowTransaccion.fecha', 'DESC');
    }
    return await qb.getMany();
  }

  async findByDateRange(from: string, to: string): Promise<CashflowTransaccion[]> {
    return await this.cashflowTransaccionRepository.find({
      where: {
        fecha: Between(from, to),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<CashflowTransaccion> {
    return await this.cashflowTransaccionRepository.findOne({
      where: { id },
      relations: ['categoria', 'banco'],
    });
  }

  async update(id: number, updateCashflowTransaccionDto: UpdateCashflowTransaccionDto): Promise<CashflowTransaccion> {
    await this.cashflowTransaccionRepository.update(id, updateCashflowTransaccionDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cashflowTransaccionRepository.delete(id);
  }

  async conciliar(id: number): Promise<CashflowTransaccion> {
    const transaccion = await this.cashflowTransaccionRepository.findOne({
      where: { id },
      relations: ['categoria', 'banco'],
    });

    if (!transaccion) {
      throw new Error('Transacción no encontrada');
    }

    if (transaccion.conciliado) {
      throw new Error('La transacción ya está conciliada');
    }

    if (!transaccion.bancoId) {
      throw new Error('La transacción no tiene banco asociado');
    }

    const ultimoSaldo = await this.bancoSaldoRepository.findOne({
      where: { bancoId: transaccion.bancoId },
      order: { fecha: 'DESC', id: 'DESC' },
    });

    const saldoActual = ultimoSaldo ? Number(ultimoSaldo.monto) : 0;
    const monto = Number(transaccion.monto);
    const nuevoSaldo = transaccion.categoria.tipo === 'ingreso'
      ? saldoActual + monto
      : saldoActual - monto;

    const hoy = getToday();
    if (ultimoSaldo && String(ultimoSaldo.fecha).substring(0, 10) === hoy) {
      await this.bancoSaldoRepository.update({ id: ultimoSaldo.id }, { monto: nuevoSaldo });
    } else {
      await this.bancoSaldoRepository.save({
        bancoId: transaccion.bancoId,
        monto: nuevoSaldo,
        fecha: hoy,
      });
    }

    transaccion.conciliado = true;
    await this.cashflowTransaccionRepository.save(transaccion);

    return transaccion;
  }

  async getResumenSemana(from: string, to: string, incluirProyectado?: boolean) {
    // Obtener todas las transacciones del rango con sus categorías
    // Si incluirProyectado es false, filtrar solo las no proyectadas (proyectado = false)
    // Si incluirProyectado es true o no se especifica, traer todas
    const whereCondition: any = {
      fecha: Between(from, to),
    };

    if (incluirProyectado === false) {
      whereCondition.proyectado = false;
    } const transacciones = await this.cashflowTransaccionRepository.find({
      where: whereCondition,
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });


    // Obtener todas las categorías para asegurar que aparezcan todas en el resumen
    const categorias = await this.cashflowTransaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre,
        r.agrupacion_id, ag.nombre as agrupacion_nombre, ag.tipo as agrupacion_tipo, ag.orden as agrupacion_orden
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      LEFT JOIN cashflow_agrupacion ag ON r.agrupacion_id = ag.id
      ORDER BY ag.orden ASC, r.nombre ASC, c.nombre ASC
    `);

    // Generar array de fechas en el rango
    const fechaInicio = new Date(from);
    const fechaFin = new Date(to);
    const fechas = [];

    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      fechas.push(fecha.toISOString().split('T')[0]);
    }

    // Inicializar estructura de datos
    const resumenPorCategoria = {};
    const totalesPorFecha = {};

    // Inicializar todas las categorías
    categorias.forEach(categoria => {
      resumenPorCategoria[categoria.id] = {
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        rubro_id: categoria.rubro_id,
        rubro_nombre: categoria.rubro_nombre,
        agrupacion_id: categoria.agrupacion_id,
        agrupacion_nombre: categoria.agrupacion_nombre,
        agrupacion_tipo: categoria.agrupacion_tipo,
        agrupacion_orden: categoria.agrupacion_orden,
        transacciones: fechas.reduce((acc, fecha) => {
          acc[fecha] = 0;
          return acc;
        }, {}),
        transaccionesDetalle: fechas.reduce((acc, fecha) => {
          acc[fecha] = [];
          return acc;
        }, {}),
        total: 0
      };
    });

    // Inicializar totales por fecha
    fechas.forEach(fecha => {
      totalesPorFecha[fecha] = {
        ingresos: 0,
        egresos: 0,
        neto: 0
      };
    });

    // Procesar transacciones
    transacciones.forEach(transaccion => {
      const fecha = transaccion.fecha;
      const categoriaId = transaccion.categoria.id;
      const monto = parseFloat(transaccion.monto.toString());

      // Sumar a la categoria
      if (resumenPorCategoria[categoriaId]) {
        resumenPorCategoria[categoriaId].transacciones[fecha] += monto;
        resumenPorCategoria[categoriaId].transaccionesDetalle[fecha].push(transaccion);
        resumenPorCategoria[categoriaId].total += monto;
      }

      // Sumar a totales por fecha
      if (transaccion.categoria.tipo === 'ingreso') {
        totalesPorFecha[fecha].ingresos += monto;
      } else {
        totalesPorFecha[fecha].egresos += monto;
      }
      totalesPorFecha[fecha].neto = totalesPorFecha[fecha].ingresos - totalesPorFecha[fecha].egresos;
    });

    // Calcular proyección acumulada desde el inicio de los tiempos
    const proyeccionPorFecha = {};

    for (const fecha of fechas) {
      // Obtener el saldo acumulado hasta esta fecha (incluyendo la fecha actual)
      // Si incluirProyectado es false, filtrar solo las no proyectadas
      // Si incluirProyectado es true o no se especifica, traer todas
      const saldoAcumulado = await this.cashflowTransaccionRepository.query(`
      SELECT
        COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
      FROM cashflow_transaccion ct
      INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
      WHERE ct.fecha <= ?
      ${incluirProyectado === false ? 'AND ct.proyectado = 0' : ''}
      `, incluirProyectado === false ? [fecha, 0] : [fecha]);


      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;

      proyeccionPorFecha[fecha] = proyeccionAcumulada;
    }

    return {
      fechas,
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha,
      proyeccionPorFecha
    };
  }

  async getResumenMes(from: string, to: string, incluirProyectado?: boolean) {
    // Obtener todas las transacciones del rango con sus categorías
    const whereCondition: any = {
      fecha: Between(from, to),
    };

    if (incluirProyectado === false) {
      whereCondition.proyectado = false;
    }

    const transacciones = await this.cashflowTransaccionRepository.find({
      where: whereCondition,
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.cashflowTransaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre,
        r.agrupacion_id, ag.nombre as agrupacion_nombre, ag.tipo as agrupacion_tipo, ag.orden as agrupacion_orden
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      LEFT JOIN cashflow_agrupacion ag ON r.agrupacion_id = ag.id
      ORDER BY ag.orden ASC, r.nombre ASC, c.nombre ASC
    `);

    // Generar array de meses en el rango (formato YYYY-MM)
    const fechaFin = parseISO(to);
    const meses = [];

    for (let fecha = parseISO(from); fecha <= fechaFin; fecha = addMonths(fecha, 1)) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      meses.push(`${year}-${month}`);
    }

    // Inicializar estructura de datos
    const resumenPorCategoria = {};
    const totalesPorMes = {};

    // Inicializar todas las categorías
    categorias.forEach(categoria => {
      resumenPorCategoria[categoria.id] = {
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        rubro_id: categoria.rubro_id,
        rubro_nombre: categoria.rubro_nombre,
        agrupacion_id: categoria.agrupacion_id,
        agrupacion_nombre: categoria.agrupacion_nombre,
        agrupacion_tipo: categoria.agrupacion_tipo,
        agrupacion_orden: categoria.agrupacion_orden,
        transacciones: meses.reduce((acc, mes) => {
          acc[mes] = 0;
          return acc;
        }, {}),
        transaccionesDetalle: meses.reduce((acc, mes) => {
          acc[mes] = [];
          return acc;
        }, {}),
        total: 0
      };
    });

    // Inicializar totales por mes
    meses.forEach(mes => {
      totalesPorMes[mes] = {
        ingresos: 0,
        egresos: 0,
        neto: 0
      };
    });

    // Procesar transacciones agrupando por mes
    transacciones.forEach(transaccion => {
      const fecha = transaccion.fecha;
      const mes = fecha.substring(0, 7); // Obtener YYYY-MM
      const categoriaId = transaccion.categoria.id;
      const monto = parseFloat(transaccion.monto.toString());

      // Sumar a la categoria
      if (resumenPorCategoria[categoriaId] && resumenPorCategoria[categoriaId].transacciones[mes] !== undefined) {
        resumenPorCategoria[categoriaId].transacciones[mes] += monto;
        resumenPorCategoria[categoriaId].transaccionesDetalle[mes].push(transaccion);
        resumenPorCategoria[categoriaId].total += monto;
      }

      // Sumar a totales por mes
      if (totalesPorMes[mes]) {
        if (transaccion.categoria.tipo === 'ingreso') {
          totalesPorMes[mes].ingresos += monto;
        } else {
          totalesPorMes[mes].egresos += monto;
        }
        totalesPorMes[mes].neto = totalesPorMes[mes].ingresos - totalesPorMes[mes].egresos;
      }
    });

    // Calcular proyección acumulada por mes
    const proyeccionPorMes = {};

    for (const mes of meses) {
      // Último día del mes usando date-fns
      const [year, month] = mes.split('-').map(Number);
      const primerDiaMes = parseISO(`${year}-${String(month).padStart(2, '0')}-01`);
      const ultimoDiaMes = lastDayOfMonth(primerDiaMes);
      const fechaConsulta = format(ultimoDiaMes, 'yyyy-MM-dd');

      const saldoAcumulado = await this.cashflowTransaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.fecha <= ?
        ${incluirProyectado === false ? 'AND ct.proyectado = 0' : ''}
      `, incluirProyectado === false ? [fechaConsulta, 0] : [fechaConsulta]);

      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;



      proyeccionPorMes[mes] = proyeccionAcumulada;
    }

    return {
      fechas: meses,
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha: totalesPorMes,
      proyeccionPorFecha: proyeccionPorMes
    };
  }

  async getResumenTrimestre(year: number, incluirProyectado?: boolean) {
    // Obtener todas las transacciones del año
    const whereCondition: any = {
      fecha: Between(`${year}-01-01`, `${year}-12-31`),
    };

    if (incluirProyectado === false) {
      whereCondition.proyectado = false;
    }

    const transacciones = await this.cashflowTransaccionRepository.find({
      where: whereCondition,
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.cashflowTransaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre,
        r.agrupacion_id, ag.nombre as agrupacion_nombre, ag.tipo as agrupacion_tipo, ag.orden as agrupacion_orden
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      LEFT JOIN cashflow_agrupacion ag ON r.agrupacion_id = ag.id
      ORDER BY ag.orden ASC, r.nombre ASC, c.nombre ASC
    `);

    // Array de trimestres (Q1, Q2, Q3, Q4)
    const trimestres = ['Q1', 'Q2', 'Q3', 'Q4'];

    // Función helper para determinar el trimestre de una fecha
    const getTrimestre = (fecha: string): string => {
      const month = parseInt(fecha.substring(5, 7));
      if (month >= 1 && month <= 3) return 'Q1';
      if (month >= 4 && month <= 6) return 'Q2';
      if (month >= 7 && month <= 9) return 'Q3';
      return 'Q4';
    };

    // Inicializar estructura de datos
    const resumenPorCategoria = {};
    const totalesPorTrimestre = {};

    // Inicializar todas las categorías
    categorias.forEach(categoria => {
      resumenPorCategoria[categoria.id] = {
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        rubro_id: categoria.rubro_id,
        rubro_nombre: categoria.rubro_nombre,
        agrupacion_id: categoria.agrupacion_id,
        agrupacion_nombre: categoria.agrupacion_nombre,
        agrupacion_tipo: categoria.agrupacion_tipo,
        agrupacion_orden: categoria.agrupacion_orden,
        transacciones: trimestres.reduce((acc, trimestre) => {
          acc[trimestre] = 0;
          return acc;
        }, {}),
        transaccionesDetalle: trimestres.reduce((acc, trimestre) => {
          acc[trimestre] = [];
          return acc;
        }, {}),
        total: 0
      };
    });

    // Inicializar totales por trimestre
    trimestres.forEach(trimestre => {
      totalesPorTrimestre[trimestre] = {
        ingresos: 0,
        egresos: 0,
        neto: 0
      };
    });

    // Procesar transacciones agrupando por trimestre
    transacciones.forEach(transaccion => {
      const fecha = transaccion.fecha;
      const trimestre = getTrimestre(fecha);
      const categoriaId = transaccion.categoria.id;
      const monto = parseFloat(transaccion.monto.toString());

      // Sumar a la categoria
      if (resumenPorCategoria[categoriaId]) {
        resumenPorCategoria[categoriaId].transacciones[trimestre] += monto;
        resumenPorCategoria[categoriaId].transaccionesDetalle[trimestre].push(transaccion);
        resumenPorCategoria[categoriaId].total += monto;
      }

      // Sumar a totales por trimestre
      if (transaccion.categoria.tipo === 'ingreso') {
        totalesPorTrimestre[trimestre].ingresos += monto;
      } else {
        totalesPorTrimestre[trimestre].egresos += monto;
      }
      totalesPorTrimestre[trimestre].neto = totalesPorTrimestre[trimestre].ingresos - totalesPorTrimestre[trimestre].egresos;
    });

    // Calcular proyección acumulada por trimestre
    const proyeccionPorTrimestre = {};

    for (const trimestre of trimestres) {
      // Último día del trimestre
      let ultimoDiaTrimestre: string;
      if (trimestre === 'Q1') ultimoDiaTrimestre = `${year}-03-31`;
      else if (trimestre === 'Q2') ultimoDiaTrimestre = `${year}-06-30`;
      else if (trimestre === 'Q3') ultimoDiaTrimestre = `${year}-09-30`;
      else ultimoDiaTrimestre = `${year}-12-31`;

      const saldoAcumulado = await this.cashflowTransaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.fecha <= ?
        ${incluirProyectado === false ? 'AND ct.proyectado = 0' : ''}
      `, incluirProyectado === false ? [ultimoDiaTrimestre, 0] : [ultimoDiaTrimestre]);

      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;

      // Si la fecha es >= hoy, restar el total de descubiertos usados


      proyeccionPorTrimestre[trimestre] = proyeccionAcumulada;
    }

    return {
      fechas: trimestres,
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha: totalesPorTrimestre,
      proyeccionPorFecha: proyeccionPorTrimestre
    };
  }

  async getResumenSemanaMes(year: number, month: number, incluirProyectado?: boolean) {
    // Calcular primer y último día del mes usando date-fns
    const primerDiaMes = parseISO(`${year}-${String(month).padStart(2, '0')}-01`);
    const ultimoDiaMes = lastDayOfMonth(primerDiaMes);

    // Generar semanas del mes usando date-fns
    // Una semana pertenece al mes si su lunes (primer día) cae en ese mes
    const semanas = [];
    const semanasInfo = {}; // Para guardar info de cada semana

    // Calcular el lunes de la semana que contiene el primer día del mes
    let currentWeekStart = startOfWeek(primerDiaMes, { weekStartsOn: 1 });
    let weekNumber = 1;

    // Continuar mientras el lunes de la semana esté dentro del mes
    while (currentWeekStart <= ultimoDiaMes) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

      // Verificar si el lunes (inicio de semana) está en el mes que consultamos
      const lunesMonth = currentWeekStart.getMonth() + 1;
      const lunesYear = currentWeekStart.getFullYear();

      // Solo incluir la semana si el lunes está en el mes consultado
      if (lunesYear === year && lunesMonth === month) {
        const weekKey = `S${weekNumber}`;
        semanas.push(weekKey);
        semanasInfo[weekKey] = {
          inicio: format(currentWeekStart, 'yyyy-MM-dd'),
          fin: format(weekEnd, 'yyyy-MM-dd')
        };
        weekNumber++;
      }

      // Avanzar a la siguiente semana
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }

    // Obtener el rango real de fechas que necesitamos consultar
    // Desde el inicio de la primera semana hasta el fin de la última semana
    const primeraSemanInfo = semanasInfo['S1'];
    const ultimaSemanInfo = semanasInfo[`S${semanas.length}`];
    const from = primeraSemanInfo.inicio;
    const to = ultimaSemanInfo.fin;

    const whereCondition = {
      fecha: Between(from, to),
      ...(incluirProyectado === false && { proyectado: false }),
    };

    const transacciones = await this.cashflowTransaccionRepository.find({
      where: whereCondition,
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.cashflowTransaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre,
        r.agrupacion_id, ag.nombre as agrupacion_nombre, ag.tipo as agrupacion_tipo, ag.orden as agrupacion_orden
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      LEFT JOIN cashflow_agrupacion ag ON r.agrupacion_id = ag.id
      ORDER BY ag.orden ASC, r.nombre ASC, c.nombre ASC
    `);

    // Función helper para determinar la semana de una fecha (comparación de strings)
    const getSemana = (fecha: string): string => {
      for (const [semana, info] of Object.entries(semanasInfo)) {
        const semanaInfo = info as { inicio: string; fin: string };
        // Comparar strings directamente (formato YYYY-MM-DD permite comparación lexicográfica)
        if (fecha >= semanaInfo.inicio && fecha <= semanaInfo.fin) {
          return semana;
        }
      }
      return 'S1'; // fallback
    };

    // Inicializar estructura de datos
    const resumenPorCategoria = {};
    const totalesPorSemana = {};

    // Inicializar todas las categorías
    categorias.forEach(categoria => {
      resumenPorCategoria[categoria.id] = {
        id: categoria.id,
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        rubro_id: categoria.rubro_id,
        rubro_nombre: categoria.rubro_nombre,
        agrupacion_id: categoria.agrupacion_id,
        agrupacion_nombre: categoria.agrupacion_nombre,
        agrupacion_tipo: categoria.agrupacion_tipo,
        agrupacion_orden: categoria.agrupacion_orden,
        transacciones: semanas.reduce((acc, semana) => {
          acc[semana] = 0;
          return acc;
        }, {}),
        transaccionesDetalle: semanas.reduce((acc, semana) => {
          acc[semana] = [];
          return acc;
        }, {}),
        total: 0
      };
    });

    // Inicializar totales por semana
    semanas.forEach(semana => {
      totalesPorSemana[semana] = {
        ingresos: 0,
        egresos: 0,
        neto: 0
      };
    });

    // Procesar transacciones agrupando por semana
    transacciones.forEach(transaccion => {
      const fecha = transaccion.fecha;
      const semana = getSemana(fecha);
      const categoriaId = transaccion.categoria.id;
      const monto = parseFloat(transaccion.monto.toString());

      // Sumar a la categoria
      if (resumenPorCategoria[categoriaId]) {
        resumenPorCategoria[categoriaId].transacciones[semana] += monto;
        resumenPorCategoria[categoriaId].transaccionesDetalle[semana].push(transaccion);
        resumenPorCategoria[categoriaId].total += monto;
      }

      // Sumar a totales por semana
      if (transaccion.categoria.tipo === 'ingreso') {
        totalesPorSemana[semana].ingresos += monto;
      } else {
        totalesPorSemana[semana].egresos += monto;
      }
      totalesPorSemana[semana].neto = totalesPorSemana[semana].ingresos - totalesPorSemana[semana].egresos;
    });

    // Calcular proyección acumulada por semana
    const proyeccionPorSemana = {};

    for (const semana of semanas) {
      const fechaConsulta = semanasInfo[semana].fin;

      const saldoAcumulado = await this.cashflowTransaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.fecha <= ?
        ${incluirProyectado === false ? 'AND ct.proyectado = 0' : ''}
      `, incluirProyectado === false ? [fechaConsulta, 0] : [fechaConsulta]);

      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;



      proyeccionPorSemana[semana] = proyeccionAcumulada;
    }

    return {
      fechas: semanas,
      semanasInfo, // Info adicional con las fechas de cada semana
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha: totalesPorSemana,
      proyeccionPorFecha: proyeccionPorSemana
    };
  }

  // ===== Migración desde Excel =====

  async migrarTransaccionesExcel(fileBuffer: any) {
    const datosExcel = await this.excelReaderService.leerExcel(fileBuffer, {
      hoja: 0,
      filaEncabezados: 1,
      filaInicioDatos: 2,
    });

    // Cargar todas las categorías una sola vez para buscar por nombre
    const categorias = await this.cashflowCategoriaRepository.find();
    const categoriasPorNombre = new Map<string, CashflowCategoria>();
    categorias.forEach(c => categoriasPorNombre.set(c.nombre.trim().toLowerCase(), c));

    // Cargar todos los bancos una sola vez para buscar por nombre
    const bancos = await this.bancoRepository.find();
    const bancosPorNombre = new Map<string, Banco>();
    bancos.forEach(b => bancosPorNombre.set(b.nombre.trim().toLowerCase(), b));

    const resultados: any[] = [];
    let exitosos = 0;
    let errores = 0;

    for (let index = 0; index < datosExcel.filas.length; index++) {
      const fila = datosExcel.filas[index];
      const numeroFila = index + 2; // +2 porque fila 1 es encabezado
      const resultadoFila: any = {
        fila: numeroFila,
        datos: {
          fecha: fila['fecha'],
          monto: fila['monto'],
          descripcion: fila['descripcion'],
          categoria: fila['categoria'],
          banco: fila['banco'] || null,
        },
        estado: '',
        acciones: [],
        errores: [],
      };

      try {
        // Validar campos obligatorios
        if (!fila['fecha']) {
          throw new Error('Campo "fecha" es obligatorio');
        }
        if (fila['monto'] === undefined || fila['monto'] === null || fila['monto'] === '') {
          throw new Error('Campo "monto" es obligatorio');
        }
        if (!fila['categoria']) {
          throw new Error('Campo "categoria" es obligatorio');
        }

        // Parsear fecha: ExcelJS retorna Date cuando la celda tiene formato fecha,
        // string cuando es texto plano en dd/mm/yyyy
        let fecha: string;
        if (fila['fecha'] instanceof Date) {
          const d = fila['fecha'];
          const anio = d.getUTCFullYear();
          const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
          const dia = String(d.getUTCDate()).padStart(2, '0');
          fecha = `${anio}-${mes}-${dia}`;
        } else {
          const fechaRaw = String(fila['fecha']).trim();
          const partes = fechaRaw.split('/');
          if (partes.length !== 3) {
            throw new Error(`Formato de fecha inválido: "${fechaRaw}". Se espera dd/mm/yyyy`);
          }
          const dia = partes[0].padStart(2, '0');
          const mes = partes[1].padStart(2, '0');
          const anio = partes[2];
          if (anio.length !== 4 || isNaN(Number(anio)) || isNaN(Number(mes)) || isNaN(Number(dia))) {
            throw new Error(`Formato de fecha inválido: "${fechaRaw}". Se espera dd/mm/yyyy`);
          }
          fecha = `${anio}-${mes}-${dia}`;
        }

        // Parsear monto
        const monto = Number(fila['monto']);
        if (isNaN(monto)) {
          throw new Error(`Monto inválido: "${fila['monto']}"`);
        }

        // Buscar categoría por nombre exacto (case-insensitive)
        const categoriaKey = String(fila['categoria']).trim().toLowerCase();
        const categoria = categoriasPorNombre.get(categoriaKey);
        if (!categoria) {
          const nombresDisponibles = Array.from(categoriasPorNombre.keys()).map(n => n.charAt(0).toUpperCase() + n.slice(1));
          throw new Error(`Categoría no encontrada: "${fila['categoria']}". Disponibles: ${nombresDisponibles.join(', ')}`);
        }

        // Buscar banco por nombre (opcional)
        let bancoId: number | undefined;
        if (fila['banco']) {
          const bancoKey = String(fila['banco']).trim().toLowerCase();
          const banco = bancosPorNombre.get(bancoKey);
          if (!banco) {
            const nombresDisponibles = Array.from(bancosPorNombre.keys()).map(n => n.charAt(0).toUpperCase() + n.slice(1));
            throw new Error(`Banco no encontrado: "${fila['banco']}". Disponibles: ${nombresDisponibles.join(', ')}`);
          }
          bancoId = banco.id;
        }

        // Crear transacción
        const descripcion = fila['descripcion'] ? String(fila['descripcion']).trim() : undefined;
        await this.cashflowTransaccionRepository.save({
          categoriaId: categoria.id,
          fecha,
          monto,
          descripcion,
          proyectado: false,
          bancoId,
        });

        resultadoFila.estado = 'exitoso';
        resultadoFila.acciones.push(`Transacción creada en categoría "${categoria.nombre}"${bancoId ? ` y banco "${bancos.find(b => b.id === bancoId)?.nombre}"` : ''} para fecha ${fecha}`);
        exitosos++;
      } catch (error) {
        resultadoFila.estado = 'error';
        resultadoFila.errores.push(error.message);
        errores++;
      }

      resultados.push(resultadoFila);
    }

    return {
      mensaje: `Migración completada: ${exitosos} exitosa${exitosos !== 1 ? 's' : ''}, ${errores} error${errores !== 1 ? 'es' : ''}`,
      resumen: {
        totalFilas: datosExcel.filas.length,
        exitosos,
        errores,
      },
      resultados,
    };
  }

  // ===== Eventos =====

  /**
   * Listener para creación de facturas
   * Crea una transacción proyectada de ingreso con la fecha de vencimiento de la factura
   */
  @OnEvent(FACTURACION.FACTURA_CREADA, { async: true })
  async handleFacturaCreada(payload: Factura) {
    const factura = payload;
    if (!factura) return;

    // Buscar si ya existe una transacción para esta factura
    const existente = await this.cashflowTransaccionRepository.findOne({
      where: {
        modelo: 'factura',
        modeloId: factura.id,
      },
    });

    // Crear/actualizar transacción proyectada de la factura
    const transaccion = this.cashflowTransaccionRepository.create({
      ...existente,
      modelo: 'factura',
      modeloId: factura.id,
      monto: Number(factura.importeBruto || factura.monto) || 0,
      fecha: factura.fechaVencimiento || factura.fecha,
      categoriaId: existente?.categoriaId ?? CATEGORIAS.INGRESOS_PROYECTADOS,
      descripcion: `Factura ${factura.folio || factura.id}${factura.modelo ? ` - ${factura.modelo} #${factura.modeloId}` : ''}`,
    });

    await this.cashflowTransaccionRepository.save(transaccion);

    if (factura.modeloId) {
      const transaccionPresupuestoEstimado = await this.cashflowTransaccionRepository.findOne({
        where: {
          modelo: 'presupuesto',
          modeloId: factura.modeloId,
        },
      });

      if (transaccionPresupuestoEstimado) {
        await this.cashflowTransaccionRepository.remove(transaccionPresupuestoEstimado);
      }
    }
  }

  /**
   * Listener para creación de cobros
   * Crea transacción real del cobro y elimina la transacción proyectada de la factura asociada
   */
  @OnEvent(COBROS.COBRO_CREADA, { async: true })
  async handleCobroCreado(payload: any) {
    const cobro = payload;
    if (!cobro) return;

    // Obtener categoría según método de pago
    const categoria = await this.cashflowCategoriaRepository.findOne({
      where: { metodoPagoId: cobro.metodoPagoId }
    });
    console.log('Categoria encontrada para método de pago', cobro.metodoPagoId, categoria);

    // Buscar si ya existe la transacción del cobro
    const existente = await this.cashflowTransaccionRepository.findOne({
      where: {
        modelo: 'cobro',
        modeloId: cobro.id,
      },
    });

    // Crear/actualizar transacción real del cobro
    const transaccion = this.cashflowTransaccionRepository.create({
      ...existente,
      modelo: 'cobro',
      modeloId: cobro.id,
      monto: Number(cobro.monto) - Number(cobro.retenciones || 0),
      fecha: cobro.fecha,
      categoriaId: categoria?.id || CATEGORIAS.EFECTIVO,
      descripcion: `Cobro${cobro.factura?.folio ? ` factura ${cobro.factura.folio}` : ''}${cobro.modelo ? ` - ${cobro.modelo} #${cobro.modeloId}` : ''}`,
      bancoId: cobro.bancoId || null,
    });

    await this.cashflowTransaccionRepository.save(transaccion);

    // Si el cobro está asociado a una factura, eliminar la transacción proyectada de esa factura
    if (cobro.facturaId) {
      const transaccionFactura = await this.cashflowTransaccionRepository.findOne({
        where: {
          modelo: 'factura',
          modeloId: cobro.facturaId,
        },
      });

      if (transaccionFactura) {
        await this.cashflowTransaccionRepository.remove(transaccionFactura);
      }
    }
  }

  /**
   * Listener para creación de cobros masivos
   * Crea UNA SOLA transacción de cashflow con la descripción consolidada
   */
  @OnEvent(COBROS.COBRO_MASIVO_CREADO, { async: true })
  async handleCobroMasivoCreado(payload: any) {
    const { cobros, facturas, fecha, bancoId, metodoPagoId, montoTotal } = payload;
    if (!cobros || cobros.length === 0) return;

    // Construir la descripción con todas las facturas
    const descripcionLineas = cobros.map((cobro: any) => {
      const factura = facturas.find((f: any) => f.id === cobro.facturaId);
      if (!factura) return '';

      const tipoModelo = factura.modelo === 'presupuesto' ? 'Presup.' : 'Alq.';
      return `${tipoModelo} #${factura.modeloId} - Fact. #${factura.id} - $${Number(cobro.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    }).filter(Boolean).join('\n');

    const descripcion = `Cobro múltiple:\n${descripcionLineas}`;

    // Obtener categoría según método de pago
    const categoria = await this.cashflowCategoriaRepository.findOne({
      where: { metodoPagoId: metodoPagoId }
    });

    // Crear UNA SOLA transacción de cashflow
    const transaccion = this.cashflowTransaccionRepository.create({
      modelo: 'cobro_masivo',
      modeloId: null,
      monto: Number(montoTotal),
      fecha: fecha,
      categoriaId: categoria?.id || CATEGORIAS.EFECTIVO,
      descripcion: descripcion,
      bancoId: bancoId || null,
      proyectado: false,
      conciliado: false,
    });

    await this.cashflowTransaccionRepository.save(transaccion);

    // Eliminar transacciones proyectadas de las facturas
    for (const cobro of cobros) {
      if (cobro.facturaId) {
        const transaccionFactura = await this.cashflowTransaccionRepository.findOne({
          where: {
            modelo: 'factura',
            modeloId: cobro.facturaId,
          },
        });

        if (transaccionFactura) {
          await this.cashflowTransaccionRepository.remove(transaccionFactura);
        }
      }
    }
  }

  @OnEvent(PRESUPUESTO.FECHA_ENTREGA_ESTIMADA, { async: true })
  async handlePresupuestoFechaEntregaEstimada(payload: Presupuesto) {
    const presupuesto = payload;
    if (!presupuesto) return;
    const existente = await this.cashflowTransaccionRepository.findOne({
      where: {
        modelo: 'presupuesto',
        modeloId: presupuesto.id,
      },
    });


    const fecha = [presupuesto?.fechaEntregaEstimada, presupuesto?.fechaFabricacionEstimada]
      .filter(Boolean)
      .sort()
      .pop();
    const fechaEstimada = addDaysToDateString(String(fecha), 45)

    const transaccion = this.cashflowTransaccionRepository.create({
      ...existente, // si existe, mergea
      modelo: 'presupuesto',
      modeloId: presupuesto.id,
      monto: calcularIva(Number(presupuesto.ventaTotal)),
      fecha: fechaEstimada,
      categoriaId: existente?.categoriaId ?? CATEGORIAS.INGRESOS_PROYECTADOS_OTS,
      descripcion: `OT ${presupuesto.id}`,
      proyectado: false
    });

    await this.cashflowTransaccionRepository.save(transaccion);
  }

  /**
   * Obtiene las columnas según el tipo de vista
   */
  async getColumnas(
    vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
    from?: string,
    year?: number,
    month?: number,
  ) {
    const fechas: string[] = [];
    let metadata: any = {};

    if (vista === 'semanal') {
      // Vista semanal: 7 días desde 'from'
      if (!from) {
        throw new Error('Se requiere el parámetro "from" para la vista semanal');
      }
      const fechaInicio = parseISO(from);
      for (let i = 0; i < 7; i++) {
        const day = addDaysToDateString(from, i);
        fechas.push(day);
      }
    } else if (vista === 'mensual') {
      // Vista mensual: 12 meses del año
      if (!year) {
        throw new Error('Se requiere el parámetro "year" para la vista mensual');
      }
      for (let i = 0; i < 12; i++) {
        const month = new Date(year, i, 1);
        fechas.push(format(month, 'yyyy-MM-dd'));
      }
    } else if (vista === 'trimestral') {
      // Vista trimestral: Q1, Q2, Q3, Q4
      fechas.push('Q1', 'Q2', 'Q3', 'Q4');
    } else if (vista === 'semanal-mes') {
      // Vista semanal-mes: semanas del mes especificado
      if (!year || !month) {
        throw new Error('Se requieren los parámetros "year" y "month" para la vista semanal-mes');
      }

      // Reutilizar la lógica de getResumenSemanaMes
      const primerDiaMes = parseISO(`${year}-${String(month).padStart(2, '0')}-01`);
      const ultimoDiaMes = lastDayOfMonth(primerDiaMes);

      const semanasInfo = {};
      let currentWeekStart = startOfWeek(primerDiaMes, { weekStartsOn: 1 });
      let weekNumber = 1;

      while (currentWeekStart <= ultimoDiaMes) {
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const lunesMonth = currentWeekStart.getMonth() + 1;
        const lunesYear = currentWeekStart.getFullYear();

        if (lunesYear === year && lunesMonth === month) {
          const weekKey = `S${weekNumber}`;
          fechas.push(weekKey);
          semanasInfo[weekKey] = {
            inicio: format(currentWeekStart, 'yyyy-MM-dd'),
            fin: format(weekEnd, 'yyyy-MM-dd')
          };
          weekNumber++;
        }

        currentWeekStart = addWeeks(currentWeekStart, 1);
      }

      metadata.semanasInfo = semanasInfo;
    }

    return {
      fechas,
      ...metadata
    };
  }

  // ─── Exportar Excel ──────────────────────────────────────────────────────────

  async exportarExcel(from: string, to: string, modo: 'dia' | 'semana' | 'mes' | 'trimestre', incluirProyectado?: boolean): Promise<ArrayBuffer> {
    // Obtener el resumen según el modo
    let resumen: { fechas: string[]; categorias: any[]; totalesPorFecha: Record<string, any> };

    if (modo === 'dia' || modo === 'semana') {
      resumen = await this.getResumenSemana(from, to, incluirProyectado);
    } else if (modo === 'mes') {
      resumen = await this.getResumenMes(from, to, incluirProyectado);
    } else {
      // trimestre: usar el año de la fecha from
      const year = parseInt(from.substring(0, 4));
      resumen = await this.getResumenTrimestre(year, incluirProyectado);
    }

    const { fechas, categorias, totalesPorFecha } = resumen;

    // Agrupar categorías por rubro
    const rubroMap = new Map<string, any[]>();
    for (const cat of categorias) {
      const rubroNombre = cat.rubro_nombre ?? 'Sin rubro';
      if (!rubroMap.has(rubroNombre)) rubroMap.set(rubroNombre, []);
      rubroMap.get(rubroNombre).push(cat);
    }

    const workbook = new (await import('exceljs')).Workbook();
    const ws = workbook.addWorksheet('Cashflow');

    // ── Estilos ──────────────────────────────────────────────────────────────

    const estiloCabecera = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF2563EB' } },
      alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } },
    };

    const estiloRubro = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF374151' } },
      border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } },
    };

    const estiloCategoria = {
      border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } },
    };

    const estiloTotal = {
      font: { bold: true },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF3F4F6' } },
      border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } },
    };

    const aplicarEstilo = (row: any, estilo: any) => {
      row.eachCell({ includeEmpty: true }, (cell: any) => {
        if (estilo.font) cell.font = estilo.font;
        if (estilo.fill) cell.fill = estilo.fill;
        if (estilo.alignment) cell.alignment = estilo.alignment;
        if (estilo.border) cell.border = estilo.border;
      });
    };

    const formatMonto = (v: number) =>
      Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // ── Fila de cabecera ─────────────────────────────────────────────────────

    const headerRow = ws.addRow(['Categoría', ...fechas, 'Total']);
    aplicarEstilo(headerRow, estiloCabecera);
    headerRow.height = 20;

    // ── Filas por rubro/categoría ─────────────────────────────────────────────

    for (const [rubroNombre, cats] of rubroMap.entries()) {
      // Fila de rubro (separador)
      const filaRubro = ws.addRow([rubroNombre, ...fechas.map(() => ''), '']);
      aplicarEstilo(filaRubro, estiloRubro);

      for (const cat of cats) {
        // Solo mostrar categorías con al menos un monto > 0
        const montos = fechas.map(f => Number(cat.transacciones?.[f] ?? 0));
        const total = montos.reduce((a, b) => a + b, 0);

        const filaData = ws.addRow([
          cat.nombre,
          ...montos.map(m => m !== 0 ? formatMonto(m) : ''),
          total !== 0 ? formatMonto(total) : '',
        ]);
        aplicarEstilo(filaData, estiloCategoria);
      }
    }

    // ── Fila totales ingresos ────────────────────────────────────────────────

    const totalIngresos = fechas.map(f => Number(totalesPorFecha[f]?.ingresos ?? 0));
    const filaIngresos = ws.addRow([
      'TOTAL INGRESOS',
      ...totalIngresos.map(m => formatMonto(m)),
      formatMonto(totalIngresos.reduce((a, b) => a + b, 0)),
    ]);
    aplicarEstilo(filaIngresos, { ...estiloTotal, font: { bold: true }, fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD1FAE5' } }, border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } } });

    // ── Fila totales egresos ─────────────────────────────────────────────────

    const totalEgresos = fechas.map(f => Number(totalesPorFecha[f]?.egresos ?? 0));
    const filaEgresos = ws.addRow([
      'TOTAL EGRESOS',
      ...totalEgresos.map(m => formatMonto(m)),
      formatMonto(totalEgresos.reduce((a, b) => a + b, 0)),
    ]);
    aplicarEstilo(filaEgresos, { ...estiloTotal, font: { bold: true }, fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFEE2E2' } }, border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } } });

    // ── Fila neto ────────────────────────────────────────────────────────────

    const netos = fechas.map(f => Number(totalesPorFecha[f]?.neto ?? 0));
    const filaNet = ws.addRow([
      'NETO',
      ...netos.map(m => formatMonto(m)),
      formatMonto(netos.reduce((a, b) => a + b, 0)),
    ]);
    aplicarEstilo(filaNet, { ...estiloTotal, font: { bold: true }, fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFDBEAFE' } }, border: { top: { style: 'thin' as const }, left: { style: 'thin' as const }, bottom: { style: 'thin' as const }, right: { style: 'thin' as const } } });

    // ── Ancho de columnas ────────────────────────────────────────────────────

    ws.getColumn(1).width = 32;
    fechas.forEach((_, i) => { ws.getColumn(i + 2).width = 16; });
    ws.getColumn(fechas.length + 2).width = 16;

    return workbook.xlsx.writeBuffer() as unknown as Promise<ArrayBuffer>;
  }

}
