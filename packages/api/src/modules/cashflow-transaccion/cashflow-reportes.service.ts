import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CashflowTransaccion } from './entities/cashflow-transaccion.entity';
import { format, eachDayOfInterval, eachMonthOfInterval, addHours, endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { getToday } from '@/helpers/date';
import { CashflowHelperService } from './cashflow-helper.service';

export interface DeudaCategoria {
    categoriaId: number;
    categoriaNombre: string;
    rubroId: number | null;
    rubroNombre: string | null;
    total: number;
}

export interface DeudasData {
    totalPasado: number;
    totalFuturo: number;
    porCategoria: DeudaCategoria[];
    porCategoriaPasado: DeudaCategoria[];
}

export interface TotalesPeriodo {
    totalIngresos: number;
    totalEgresos: number;
    saldoAcumulado: number;
    saldoActual: number;
}

export interface EvolucionData {
    fecha: string;
    ingresos: number;
    egresos: number;
}

export interface SaldoAcumuladoData {
    fecha: string;
    saldo: number;
}

@Injectable()
export class CashflowReportesService {
    constructor(
        @InjectRepository(CashflowTransaccion)
        private readonly cashflowTransaccionRepository: Repository<CashflowTransaccion>,
        private readonly cashflowHelperService: CashflowHelperService,
    ) { }

    async getTotalesPeriodo(
        fechaInicio: string,
        fechaFin: string,
        categoriasIngreso?: string[],
        categoriasEgreso?: string[]
    ): Promise<TotalesPeriodo> {
        // Obtener totales del período actual
        const totalesQueryBuilder = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .select([
                'SUM(CASE WHEN categoria.tipo = "ingreso" THEN transaccion.monto ELSE 0 END) as totalIngresos',
                'SUM(CASE WHEN categoria.tipo = "egreso" THEN transaccion.monto ELSE 0 END) as totalEgresos'
            ])
            .where('transaccion.fecha >= :fechaInicio', { fechaInicio })
            .andWhere('transaccion.fecha <= :fechaFin', { fechaFin });

        // Filtros de categorías
        if (categoriasIngreso && categoriasIngreso.length > 0) {
            totalesQueryBuilder.andWhere(
                '(categoria.tipo != "ingreso" OR categoria.id IN (:...categoriasIngreso))',
                { categoriasIngreso }
            );
        }
        if (categoriasEgreso && categoriasEgreso.length > 0) {
            totalesQueryBuilder.andWhere(
                '(categoria.tipo != "egreso" OR categoria.id IN (:...categoriasEgreso))',
                { categoriasEgreso }
            );
        }

        const totalesQuery = await totalesQueryBuilder.getRawOne();

        // Obtener saldo acumulado histórico (todas las transacciones hasta fechaFin)
        const saldoAcumuladoQueryBuilder = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .select([
                'SUM(CASE WHEN categoria.tipo = "ingreso" THEN transaccion.monto ELSE 0 END) as ingresosHistoricos',
                'SUM(CASE WHEN categoria.tipo = "egreso" THEN transaccion.monto ELSE 0 END) as egresosHistoricos'
            ])
            .where('transaccion.fecha <= :fechaFin', { fechaFin });

        // Aplicar filtros de categorías también al histórico
        if (categoriasIngreso && categoriasIngreso.length > 0) {
            saldoAcumuladoQueryBuilder.andWhere(
                '(categoria.tipo != "ingreso" OR categoria.id IN (:...categoriasIngreso))',
                { categoriasIngreso }
            );
        }
        if (categoriasEgreso && categoriasEgreso.length > 0) {
            saldoAcumuladoQueryBuilder.andWhere(
                '(categoria.tipo != "egreso" OR categoria.id IN (:...categoriasEgreso))',
                { categoriasEgreso }
            );
        }

        const saldoAcumuladoQuery = await saldoAcumuladoQueryBuilder.getRawOne();

        const totalIngresos = parseFloat(totalesQuery.totalIngresos) || 0;
        const totalEgresos = parseFloat(totalesQuery.totalEgresos) || 0;
        const ingresosHistoricos = parseFloat(saldoAcumuladoQuery.ingresosHistoricos) || 0;
        const egresosHistoricos = parseFloat(saldoAcumuladoQuery.egresosHistoricos) || 0;

        // Calcular saldo acumulado
        const saldoAcumulado = ingresosHistoricos - egresosHistoricos;

        return {
            totalIngresos,
            totalEgresos,
            saldoAcumulado,
            saldoActual: totalIngresos - totalEgresos
        };
    }

    async getEvolucionIngresosEgresos(
        fechaInicio: string,
        fechaFin: string,
        modo: 'dia' | 'mes',
        categoriasIngreso?: string[],
        categoriasEgreso?: string[]
    ): Promise<EvolucionData[]> {
        let intervals: Date[];
        let formatString: string;

        // Crear fechas locales manualmente (sin UTC ni helpers)
        const [startY, startM, startD] = fechaInicio.split('-').map(Number);
        const [endY, endM, endD] = fechaFin.split('-').map(Number);

        const start = new Date(startY, startM - 1, startD);
        const end = new Date(endY, endM - 1, endD);


        if (modo === 'dia') {
            intervals = eachDayOfInterval({ start, end });
            formatString = 'yyyy-MM-dd';
        } else {
            intervals = eachMonthOfInterval({ start, end });
            formatString = 'yyyy-MM';
        }

        // Obtener transacciones del período
        const transaccionesQueryBuilder = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .select(['transaccion.fecha', 'categoria.tipo', 'transaccion.monto'])
            .where('transaccion.fecha >= :fechaInicio', { fechaInicio })
            .andWhere('transaccion.fecha <= :fechaFin', { fechaFin });

        // Filtros de categorías
        if (categoriasIngreso && categoriasIngreso.length > 0) {
            transaccionesQueryBuilder.andWhere(
                '(categoria.tipo != "ingreso" OR categoria.id IN (:...categoriasIngreso))',
                { categoriasIngreso }
            );
        }
        if (categoriasEgreso && categoriasEgreso.length > 0) {
            transaccionesQueryBuilder.andWhere(
                '(categoria.tipo != "egreso" OR categoria.id IN (:...categoriasEgreso))',
                { categoriasEgreso }
            );
        }

        const transacciones = await transaccionesQueryBuilder.getRawMany();

        // Agrupar transacciones por fecha/período
        const transaccionesPorPeriodo = transacciones.reduce((acc, transaccion) => {
            let key: string;
            if (modo === 'dia') {
                key = transaccion.transaccion_fecha;
            } else {
                key = transaccion.transaccion_fecha.substring(0, 7); // YYYY-MM
            }

            if (!acc[key]) {
                acc[key] = { ingresos: 0, egresos: 0 };
            }

            if (transaccion.categoria_tipo === 'ingreso') {
                acc[key].ingresos += parseFloat(transaccion.transaccion_monto) || 0;
            } else {
                acc[key].egresos += parseFloat(transaccion.transaccion_monto) || 0;
            }

            return acc;
        }, {} as Record<string, { ingresos: number; egresos: number }>);

        // Formatear datos para cada intervalo
        return intervals.map((date) => {
            const key = format(date, formatString);
            const data = transaccionesPorPeriodo[key] || { ingresos: 0, egresos: 0 };

            return {
                fecha:
                    modo === 'dia'
                        ? format(date, 'dd/MM', { locale: es })
                        : format(date, 'MMM yyyy', { locale: es }),
                ingresos: data.ingresos,
                egresos: data.egresos,
            };
        });
    }

    async getEvolucionSaldoAcumulado(
        fechaInicio: string,
        fechaFin: string,
        modo: 'dia' | 'mes',
        categoriasIngreso?: string[],
        categoriasEgreso?: string[]
    ): Promise<SaldoAcumuladoData[]> {
        let intervals: Date[];

        // Crear fechas locales manualmente sin UTC
        const [startY, startM, startD] = fechaInicio.split('-').map(Number);
        const [endY, endM, endD] = fechaFin.split('-').map(Number);

        const start = new Date(startY, startM - 1, startD);
        const end = new Date(endY, endM - 1, endD);

        if (modo === 'dia') {
            intervals = eachDayOfInterval({ start, end });
        } else {
            intervals = eachMonthOfInterval({ start, end });
        }

        // Obtener saldo inicial (todas las transacciones antes del período)
        const saldoInicialQueryBuilder = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .select([
                'SUM(CASE WHEN categoria.tipo = "ingreso" THEN transaccion.monto ELSE 0 END) as ingresosHistoricos',
                'SUM(CASE WHEN categoria.tipo = "egreso" THEN transaccion.monto ELSE 0 END) as egresosHistoricos',
            ])
            .where('transaccion.fecha < :fechaInicio', { fechaInicio });

        // Filtros de categorías para saldo inicial
        if (categoriasIngreso && categoriasIngreso.length > 0) {
            saldoInicialQueryBuilder.andWhere(
                '(categoria.tipo != "ingreso" OR categoria.id IN (:...categoriasIngreso))',
                { categoriasIngreso }
            );
        }
        if (categoriasEgreso && categoriasEgreso.length > 0) {
            saldoInicialQueryBuilder.andWhere(
                '(categoria.tipo != "egreso" OR categoria.id IN (:...categoriasEgreso))',
                { categoriasEgreso }
            );
        }

        const saldoInicialQuery = await saldoInicialQueryBuilder.getRawOne();

        const ingresosHistoricos = parseFloat(saldoInicialQuery.ingresosHistoricos) || 0;
        const egresosHistoricos = parseFloat(saldoInicialQuery.egresosHistoricos) || 0;
        let saldoAcumulado = ingresosHistoricos - egresosHistoricos;

        // Obtener todas las transacciones del período ordenadas por fecha
        const transaccionesPeriodoQueryBuilder = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .select(['transaccion.fecha', 'categoria.tipo', 'transaccion.monto'])
            .where('transaccion.fecha >= :fechaInicio', { fechaInicio })
            .andWhere('transaccion.fecha <= :fechaFin', { fechaFin })
            .orderBy('transaccion.fecha', 'ASC');

        // Filtros de categorías para período
        if (categoriasIngreso && categoriasIngreso.length > 0) {
            transaccionesPeriodoQueryBuilder.andWhere(
                '(categoria.tipo != "ingreso" OR categoria.id IN (:...categoriasIngreso))',
                { categoriasIngreso }
            );
        }
        if (categoriasEgreso && categoriasEgreso.length > 0) {
            transaccionesPeriodoQueryBuilder.andWhere(
                '(categoria.tipo != "egreso" OR categoria.id IN (:...categoriasEgreso))',
                { categoriasEgreso }
            );
        }

        const transaccionesPeriodo = await transaccionesPeriodoQueryBuilder.getRawMany();

        // Agrupar transacciones por fecha
        const transaccionesPorFecha = transaccionesPeriodo.reduce((acc, transaccion) => {
            const fecha = transaccion.transaccion_fecha;
            if (!acc[fecha]) {
                acc[fecha] = { ingresos: 0, egresos: 0 };
            }

            if (transaccion.categoria_tipo === 'ingreso') {
                acc[fecha].ingresos += parseFloat(transaccion.transaccion_monto) || 0;
            } else {
                acc[fecha].egresos += parseFloat(transaccion.transaccion_monto) || 0;
            }

            return acc;
        }, {} as Record<string, { ingresos: number; egresos: number }>);

        const resultados: SaldoAcumuladoData[] = [];
        const fechasProcesadas = new Set<string>();

        // Procesar cada intervalo progresivamente
        for (const date of intervals) {

            if (modo === 'dia') {
                const fechaActual = format(date, 'yyyy-MM-dd');
                // Sumar transacciones del día
                const transaccionesDia = transaccionesPorFecha[fechaActual];
                if (transaccionesDia) {
                    saldoAcumulado += transaccionesDia.ingresos - transaccionesDia.egresos;
                }
            } else {
                // Para modo mensual
                const inicioMes = format(date, 'yyyy-MM-01');
                const finMes = format(endOfMonth(date), 'yyyy-MM-dd');

                Object.keys(transaccionesPorFecha).forEach((fecha) => {
                    if (fecha >= inicioMes && fecha <= finMes && !fechasProcesadas.has(fecha)) {
                        const transaccionesFecha = transaccionesPorFecha[fecha];
                        saldoAcumulado += transaccionesFecha.ingresos - transaccionesFecha.egresos;
                        fechasProcesadas.add(fecha);
                    }
                });
            }

            // Restar descubiertos si la fecha del intervalo es >= hoy
            const saldoFinal = saldoAcumulado;


            resultados.push({
                fecha:
                    modo === 'dia'
                        ? format(date, 'dd/MM', { locale: es })
                        : format(date, 'MMM yyyy', { locale: es }),
                saldo: saldoFinal,
            });
        }

        return resultados;
    }

    async getProyeccion(
        tipo: 'ingreso' | 'egreso',
        fechaInicio?: string,
        fechaFin?: string,
    ): Promise<DeudasData> {
        const hoy = getToday();

        // Transacciones futuras: desde mañana, con límite de fecha solo si se pasa fechaFin
        const qbFuturo = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .leftJoin('transaccion.categoria', 'categoria')
            .leftJoin('categoria.rubro', 'rubro')
            .select([
                'categoria.id AS categoriaId',
                'categoria.nombre AS categoriaNombre',
                'rubro.id AS rubroId',
                'rubro.nombre AS rubroNombre',
                'SUM(transaccion.monto) AS total',
            ])
            .where('transaccion.fecha > :hoy', { hoy })
            .andWhere('categoria.tipo = :tipo', { tipo })
            .groupBy('categoria.id')
            .addGroupBy('rubro.id')
            .orderBy('rubroNombre', 'ASC')
            .addOrderBy('categoriaNombre', 'ASC');

        if (fechaFin) qbFuturo.andWhere('transaccion.fecha <= :fechaFin', { fechaFin });

        const resultadoFuturo = await qbFuturo.getRawMany();

        const porCategoria: DeudaCategoria[] = resultadoFuturo.map((row) => ({
            categoriaId: Number(row.categoriaId),
            categoriaNombre: row.categoriaNombre,
            rubroId: row.rubroId ? Number(row.rubroId) : null,
            rubroNombre: row.rubroNombre || null,
            total: parseFloat(row.total) || 0,
        }));

        const totalFuturo = porCategoria.reduce((sum, item) => sum + item.total, 0);

        // Transacciones pasadas: solo si se pasa un rango (desde fechaInicio hasta hoy)
        let totalPasado = 0;
        let porCategoriaPasado: DeudaCategoria[] = [];
        if (fechaInicio) {
            const resultadoPasado = await this.cashflowTransaccionRepository
                .createQueryBuilder('transaccion')
                .leftJoin('transaccion.categoria', 'categoria')
                .leftJoin('categoria.rubro', 'rubro')
                .select([
                    'categoria.id AS categoriaId',
                    'categoria.nombre AS categoriaNombre',
                    'rubro.id AS rubroId',
                    'rubro.nombre AS rubroNombre',
                    'SUM(transaccion.monto) AS total',
                ])
                .where('transaccion.fecha >= :fechaInicio', { fechaInicio })
                .andWhere('transaccion.fecha <= :hoy', { hoy })
                .andWhere('categoria.tipo = :tipo', { tipo })
                .groupBy('categoria.id')
                .addGroupBy('rubro.id')
                .orderBy('rubroNombre', 'ASC')
                .addOrderBy('categoriaNombre', 'ASC')
                .getRawMany();
            porCategoriaPasado = resultadoPasado.map((row) => ({
                categoriaId: Number(row.categoriaId),
                categoriaNombre: row.categoriaNombre,
                rubroId: row.rubroId ? Number(row.rubroId) : null,
                rubroNombre: row.rubroNombre || null,
                total: parseFloat(row.total) || 0,
            }));
            totalPasado = porCategoriaPasado.reduce((sum, item) => sum + item.total, 0);
        }

        return { totalPasado, totalFuturo, porCategoria, porCategoriaPasado };
    }

    async getTransaccionesCategoria(
        categoriaId: number,
        modo: 'futuro' | 'pasado' | 'futuro-mes' | 'pasado-mes',
        fechaInicio?: string,
        fechaFin?: string,
    ): Promise<{ fecha: string; monto: number; descripcion: string | null }[]> {
        const hoy = getToday();
        const qb = this.cashflowTransaccionRepository
            .createQueryBuilder('transaccion')
            .select(['transaccion.fecha', 'transaccion.monto', 'transaccion.descripcion'])
            .where('transaccion.categoriaId = :categoriaId', { categoriaId })
            .andWhere('transaccion.proyectado = :proyectado', { proyectado: false });

        if (modo === 'futuro') {
            qb.andWhere('transaccion.fecha > :hoy', { hoy });
        } else if (modo === 'pasado') {
            qb.andWhere('transaccion.fecha <= :hoy', { hoy });
            if (fechaInicio) qb.andWhere('transaccion.fecha >= :fechaInicio', { fechaInicio });
        } else if (modo === 'futuro-mes') {
            qb.andWhere('transaccion.fecha > :hoy', { hoy });
            if (fechaFin) qb.andWhere('transaccion.fecha <= :fechaFin', { fechaFin });
        } else if (modo === 'pasado-mes') {
            qb.andWhere('transaccion.fecha >= :fechaInicio', { fechaInicio });
            qb.andWhere('transaccion.fecha <= :hoy', { hoy });
        }

        qb.orderBy('transaccion.fecha', 'ASC');
        const rows = await qb.getMany();
        return rows.map((t) => ({
            fecha: t.fecha,
            monto: Number(t.monto),
            descripcion: t.descripcion ?? null,
        }));
    }

}
