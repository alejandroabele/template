import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindManyOptions } from 'typeorm';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { CashflowSimulacionTransaccion } from './entities/cashflow-simulacion-transaccion.entity';
import { parseISO, addMonths, format, lastDayOfMonth, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { addDaysToDateString } from '@/helpers/date';

@Injectable()
export class CashflowSimulacionTransaccionService {
  constructor(
    @InjectRepository(CashflowSimulacionTransaccion)
    private transaccionRepository: Repository<CashflowSimulacionTransaccion>,
  ) {}

  async findBusqueda(simulacionId: number, conditions: FindManyOptions<CashflowSimulacionTransaccion>): Promise<CashflowSimulacionTransaccion[]> {
    const qb = this.transaccionRepository.createQueryBuilder('cashflowTransaccion');
    qb.leftJoinAndSelect('cashflowTransaccion.categoria', 'categoria');
    qb.andWhere('cashflowTransaccion.simulacion_id = :simulacionId', { simulacionId });
    buildWhereAndOrderQuery(qb, conditions, 'cashflowTransaccion');
    if (!conditions.order || Object.keys(conditions.order).length === 0) {
      qb.orderBy('cashflowTransaccion.fecha', 'DESC');
    }
    if (conditions.take) qb.take(conditions.take);
    if (conditions.skip) qb.skip(conditions.skip);
    return await qb.getMany();
  }

  async findByDateRange(simulacionId: number, from: string, to: string): Promise<CashflowSimulacionTransaccion[]> {
    return await this.transaccionRepository.find({
      where: {
        simulacionId,
        fecha: Between(from, to),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });
  }

  async getResumenSemana(simulacionId: number, from: string, to: string) {
    // Obtener todas las transacciones del rango con sus categorías
    const transacciones = await this.transaccionRepository.find({
      where: {
        simulacionId,
        fecha: Between(from, to),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías para asegurar que aparezcan todas en el resumen
    const categorias = await this.transaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      ORDER BY r.nombre ASC, c.tipo DESC, c.nombre ASC
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
      const saldoAcumulado = await this.transaccionRepository.query(`
      SELECT
        COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
      FROM cashflow_simulacion_transaccion ct
      INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
      WHERE ct.simulacion_id = ? AND ct.fecha <= ?
      `, [simulacionId, fecha]);

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

  async getResumenMes(simulacionId: number, from: string, to: string) {
    // Obtener todas las transacciones del rango con sus categorías
    const transacciones = await this.transaccionRepository.find({
      where: {
        simulacionId,
        fecha: Between(from, to),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.transaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      ORDER BY r.nombre ASC, c.tipo DESC, c.nombre ASC
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

      const saldoAcumulado = await this.transaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_simulacion_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.simulacion_id = ? AND ct.fecha <= ?
      `, [simulacionId, fechaConsulta]);

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

  async getResumenTrimestre(simulacionId: number, year: number) {
    // Obtener todas las transacciones del año
    const transacciones = await this.transaccionRepository.find({
      where: {
        simulacionId,
        fecha: Between(`${year}-01-01`, `${year}-12-31`),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.transaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      ORDER BY r.nombre ASC, c.tipo DESC, c.nombre ASC
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

      const saldoAcumulado = await this.transaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_simulacion_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.simulacion_id = ? AND ct.fecha <= ?
      `, [simulacionId, ultimoDiaTrimestre]);

      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;

      proyeccionPorTrimestre[trimestre] = proyeccionAcumulada;
    }

    return {
      fechas: trimestres,
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha: totalesPorTrimestre,
      proyeccionPorFecha: proyeccionPorTrimestre
    };
  }

  async getResumenSemanaMes(simulacionId: number, year: number, month: number) {
    // Calcular primer y último día del mes usando date-fns
    const primerDiaMes = parseISO(`${year}-${String(month).padStart(2, '0')}-01`);
    const ultimoDiaMes = lastDayOfMonth(primerDiaMes);

    // Generar semanas del mes usando date-fns
    const semanas = [];
    const semanasInfo = {};

    let currentWeekStart = startOfWeek(primerDiaMes, { weekStartsOn: 1 });
    let weekNumber = 1;

    while (currentWeekStart <= ultimoDiaMes) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

      const lunesMonth = currentWeekStart.getMonth() + 1;
      const lunesYear = currentWeekStart.getFullYear();

      if (lunesYear === year && lunesMonth === month) {
        const weekKey = `S${weekNumber}`;
        semanas.push(weekKey);
        semanasInfo[weekKey] = {
          inicio: format(currentWeekStart, 'yyyy-MM-dd'),
          fin: format(weekEnd, 'yyyy-MM-dd')
        };
        weekNumber++;
      }

      currentWeekStart = addWeeks(currentWeekStart, 1);
    }

    const primeraSemanInfo = semanasInfo['S1'];
    const ultimaSemanInfo = semanasInfo[`S${semanas.length}`];
    const from = primeraSemanInfo.inicio;
    const to = ultimaSemanInfo.fin;

    const transacciones = await this.transaccionRepository.find({
      where: {
        simulacionId,
        fecha: Between(from, to),
      },
      relations: ['categoria', 'banco'],
      order: {
        fecha: 'ASC',
      },
    });

    // Obtener todas las categorías
    const categorias = await this.transaccionRepository.query(`
      SELECT DISTINCT c.id, c.nombre, c.tipo, c.rubro_id, r.nombre as rubro_nombre
      FROM cashflow_categoria c
      LEFT JOIN cashflow_rubro r ON c.rubro_id = r.id
      ORDER BY r.nombre ASC, c.tipo DESC, c.nombre ASC
    `);

    // Función helper para determinar la semana de una fecha (comparación de strings)
    const getSemana = (fecha: string): string => {
      for (const [semana, info] of Object.entries(semanasInfo)) {
        const semanaInfo = info as { inicio: string; fin: string };
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

      const saldoAcumulado = await this.transaccionRepository.query(`
        SELECT
          COALESCE(SUM(CASE WHEN c.tipo = 'ingreso' THEN ct.monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN c.tipo = 'egreso' THEN ct.monto ELSE 0 END), 0) as total_egresos
        FROM cashflow_simulacion_transaccion ct
        INNER JOIN cashflow_categoria c ON ct.categoria_id = c.id
        WHERE ct.simulacion_id = ? AND ct.fecha <= ?
      `, [simulacionId, fechaConsulta]);

      const ingresos = parseFloat(saldoAcumulado[0].total_ingresos || 0);
      const egresos = parseFloat(saldoAcumulado[0].total_egresos || 0);
      const proyeccionAcumulada = ingresos - egresos;

      proyeccionPorSemana[semana] = proyeccionAcumulada;
    }

    return {
      fechas: semanas,
      semanasInfo,
      categorias: Object.values(resumenPorCategoria),
      totalesPorFecha: totalesPorSemana,
      proyeccionPorFecha: proyeccionPorSemana
    };
  }

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
        const monthDate = new Date(year, i, 1);
        fechas.push(format(monthDate, 'yyyy-MM-dd'));
      }
    } else if (vista === 'trimestral') {
      // Vista trimestral: Q1, Q2, Q3, Q4
      fechas.push('Q1', 'Q2', 'Q3', 'Q4');
    } else if (vista === 'semanal-mes') {
      // Vista semanal-mes: semanas del mes especificado
      if (!year || !month) {
        throw new Error('Se requieren los parámetros "year" y "month" para la vista semanal-mes');
      }

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
}
