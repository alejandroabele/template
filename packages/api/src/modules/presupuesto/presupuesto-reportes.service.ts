import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { PROCESO_GENERAL } from '@/constants/proceso-general';
import { ca } from 'date-fns/locale';

// Interfaces para los reportes
export interface PresupuestosReporte {
    id: number;
    ventaTotal: number;
    fecha: string;
    cliente: {
        id: number;
        nombre: string;
    };
}

@Injectable()
export class PresupuestoReportesService {
    constructor(
        @InjectRepository(Presupuesto)
        private readonly presupuestoRepository: Repository<Presupuesto>,
    ) { }

    /**
     * Obtiene las ventas agrupadas por semana para un mes específico
     */
    async getVentasSemanales(anio: number, mes: number, campoFecha: string = 'fechaFabricacionEstimada', procesosGenerales?: number[]) {
        const startDate = `${anio}-${String(mes).padStart(2, "0")}-01`;
        const lastDay = new Date(anio, mes, 0).getDate();
        const endDate = `${anio}-${String(mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

        let query = this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .leftJoinAndSelect('presupuesto.cliente', 'cliente')
            .where(`presupuesto.${campoFecha} >= :startDate`, { startDate })
            .andWhere(`presupuesto.${campoFecha} <= :endDate`, { endDate })
            .andWhere(`presupuesto.${campoFecha} IS NOT NULL`)
            .andWhere('presupuesto.ventaTotal IS NOT NULL');

        // Filtrar por procesos generales si se especifican
        if (procesosGenerales && procesosGenerales.length > 0) {
            query = query.andWhere('presupuesto.procesoGeneral IN (:...procesosGenerales)', { procesosGenerales });
        }

        const presupuestos = await query.getMany();

        // Agrupar por semanas
        const ventasPorSemana = {};

        presupuestos.forEach(presupuesto => {
            const fechaUsada = presupuesto[campoFecha];
            const fecha = new Date(fechaUsada);
            const semana = this.getWeekOfMonth(fecha);

            if (!ventasPorSemana[semana]) {
                ventasPorSemana[semana] = {
                    semana,
                    totalVentas: 0,
                    cantidadPresupuestos: 0
                };
            }

            ventasPorSemana[semana].totalVentas += Number(presupuesto.ventaTotal || 0);
            ventasPorSemana[semana].cantidadPresupuestos += 1;
        });

        return Object.values(ventasPorSemana);
    }

    /**
     * Obtiene las ventas por cliente para una semana específica
     */
    async getVentasPorCliente(anio: number, mes: number, semana: number, campoFecha: string = 'fechaFabricacionEstimada', procesosGenerales?: number[]) {
        const startDate = `${anio}-${String(mes).padStart(2, "0")}-01`;
        const lastDay = new Date(anio, mes, 0).getDate();
        const endDate = `${anio}-${String(mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;



        let query = this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .leftJoinAndSelect('presupuesto.cliente', 'cliente')
            .where(`presupuesto.${campoFecha} >= :startDate`, { startDate })
            .andWhere(`presupuesto.${campoFecha} <= :endDate`, { endDate })
            .andWhere(`presupuesto.${campoFecha} IS NOT NULL`)
            .andWhere('presupuesto.ventaTotal IS NOT NULL');

        // Filtrar por procesos generales si se especifican
        if (procesosGenerales && procesosGenerales.length > 0) {
            query = query.andWhere('presupuesto.procesoGeneral IN (:...procesosGenerales)', { procesosGenerales });
        }

        const presupuestos = await query.getMany();


        // Filtrar por semana y agrupar por cliente
        const ventasPorCliente = {};

        presupuestos.forEach(presupuesto => {
            const fechaUsada = presupuesto[campoFecha];
            const fecha = new Date(fechaUsada);
            const semanaPresupuesto = this.getWeekOfMonth(fecha);


            if (semanaPresupuesto === semana) {
                const clienteId = presupuesto.cliente?.id || 'sin_cliente';
                const clienteNombre = presupuesto.cliente?.nombre || 'Sin cliente';

                if (!ventasPorCliente[clienteId]) {
                    ventasPorCliente[clienteId] = {
                        clienteId,
                        clienteNombre,
                        totalVentas: 0,
                        cantidadPresupuestos: 0
                    };
                }

                ventasPorCliente[clienteId].totalVentas += Number(presupuesto.ventaTotal || 0);
                ventasPorCliente[clienteId].cantidadPresupuestos += 1;
            }
        });

        const resultado = Object.values(ventasPorCliente)
            .sort((a: any, b: any) => b.totalVentas - a.totalVentas); // Ordenar de mayor a menor


        return resultado;
    }

    /**
     * Obtiene los presupuestos de un cliente específico para una semana
     */
    async getPresupuestosPorClienteSemana(
        anio: number,
        mes: number,
        semana: number,
        clienteId: number,
        campoFecha: string = 'fechaFabricacionEstimada',
        procesosGenerales?: number[]
    ) {
        const startDate = `${anio}-${String(mes).padStart(2, "0")}-01`;
        const lastDay = new Date(anio, mes, 0).getDate();
        const endDate = `${anio}-${String(mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

        let query = this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .leftJoinAndSelect('presupuesto.cliente', 'cliente')
            .where(`presupuesto.${campoFecha} >= :startDate`, { startDate })
            .andWhere(`presupuesto.${campoFecha} <= :endDate`, { endDate })
            .andWhere(`presupuesto.${campoFecha} IS NOT NULL`)
            .andWhere('presupuesto.ventaTotal IS NOT NULL')
            .andWhere('presupuesto.clienteId = :clienteId', { clienteId });

        if (procesosGenerales && procesosGenerales.length > 0) {
            query = query.andWhere('presupuesto.procesoGeneral IN (:...procesosGenerales)', { procesosGenerales });
        }

        const presupuestos = await query.getMany();

        // Filtrar por semana
        const presupuestosFiltrados = presupuestos.filter(p => {
            const fechaUsada = p[campoFecha];
            const fecha = new Date(fechaUsada);
            const semanaPresupuesto = this.getWeekOfMonth(fecha);
            return semanaPresupuesto === semana;
        });

        if (!presupuestosFiltrados.length) {
            return [];
        }

        // 🔹 Traer fechaDesdeProceso desde auditoría
        const ids = presupuestosFiltrados.map(p => p.id);
        const auditoriasQuery = `
    SELECT 
      a.registro_id AS presupuestoId,
      a.fecha AS fechaCambio
    FROM auditoria a
    WHERE a.tabla = 'presupuesto'
      AND a.columna = 'procesoGeneralId'
      AND a.registro_id IN (${ids.join(',')})
      AND a.id = (
        SELECT MAX(a2.id)
        FROM auditoria a2
        WHERE a2.tabla = 'presupuesto'
          AND a2.columna = 'procesoGeneralId'
          AND a2.registro_id = a.registro_id
      )
  `;
        const auditorias = await this.presupuestoRepository.query(auditoriasQuery);

        const auditoriaMap = Object.fromEntries(
            auditorias.map(a => [a.presupuestoId, a.fechaCambio])
        );

        // Map final
        return presupuestosFiltrados
            .map(p => {
                const fechaUsada = campoFecha === 'fechaFabricacionEstimada'
                    ? p.fechaFabricacionEstimada
                    : p.fechaEntregaEstimada;

                return {
                    id: p.id,
                    ventaTotal: Number(p.ventaTotal || 0),
                    fecha: fechaUsada,
                    fechaDesdeProceso: auditoriaMap[p.id] ?? null, // ⬅️ nuevo campo
                    cliente: {
                        id: p.cliente?.id,
                        nombre: p.cliente?.nombre
                    }
                };
            })
            .sort((a, b) => b.ventaTotal - a.ventaTotal);
    }


    /**
     * Obtiene presupuestos por cambio de fecha según auditoría
     * Consulta la tabla auditoría unida con presupuesto para obtener el último registro
     * de cada presupuesto que esté actualmente en alguno de los procesos especificados
     */
    async getPresupuestosPorCambioFecha(options: {
        anio?: number;
        mes?: number;
        procesosGenerales?: number[];
        modo?: 'semanal' | 'mensual';
        from?: string;
        to?: string;
        variante?: string;
    } = {}) {
        const {
            anio,
            mes,
            procesosGenerales = [PROCESO_GENERAL.FACTURADO],
            modo = 'semanal',
            from,
            to,
            variante
        } = options;
        try {
            // El rango explícito tiene prioridad sobre anio/mes
            const usaRango = Boolean(from && to);
            const filtraFecha = usaRango || (Boolean(anio && mes) && modo === 'semanal');
            const params: any[] = [];

            let filtroFechaSQL = '';
            if (filtraFecha) {
                if (usaRango) {
                    // Usar rango explícito
                    filtroFechaSQL = `
                        AND a.fecha >= ?
                        AND a.fecha <= ?
                    `;
                    params.push(from, to);
                } else {
                    // Usar anio/mes
                    const startDate = `${anio}-${String(mes).padStart(2, '0')}-01`;
                    const lastDay = new Date(anio!, mes!, 0).getDate();
                    const endDate = `${anio}-${String(mes).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                    filtroFechaSQL = `
                        AND a.fecha >= ?
                        AND a.fecha <= CONCAT(?, ' 23:59:59')
                    `;
                    params.push(startDate, endDate);
                }
            }

            // Auditorías
            const auditoriasQuery = `
        SELECT 
        a.registro_id AS presupuestoId,
        a.fecha AS fechaCambio
      FROM auditoria a
      WHERE a.tabla = 'presupuesto'
        AND a.columna = 'procesoGeneralId'
        AND a.valor_nuevo IN (${procesosGenerales.map(() => '?').join(',')})
        ${filtroFechaSQL}
            `;



            const auditorias = await this.presupuestoRepository.query(
                auditoriasQuery,
                [...procesosGenerales, ...params, ...procesosGenerales]
            );


            if (!auditorias.length) {
                return [];
            }

            // IDs de presupuestos
            const presupuestoIds = auditorias.map(a => a.presupuestoId);

            const qb = this.presupuestoRepository
                .createQueryBuilder('presupuesto')
                .leftJoinAndSelect('presupuesto.cliente', 'cliente')
                .where('presupuesto.id IN (:...ids)', { ids: presupuestoIds })
                .andWhere('presupuesto.venta_total IS NOT NULL');
            if (variante !== 'acumulado') {
                qb.andWhere('presupuesto.procesoGeneralId IN (:...procesosGenerales)', { procesosGenerales });
            }
            const presupuestos = await qb.getMany();


            // Mapear auditorías
            const auditoriaMap = Object.fromEntries(
                auditorias.map(a => [a.presupuestoId, a.fechaCambio])
            );

            // Agrupación unificada por modo
            const ventasPorPeriodo = presupuestos.reduce((acc, presupuesto) => {
                const fechaCambio = new Date(auditoriaMap[presupuesto.id]);
                const periodo = this.agruparPorPeriodo(fechaCambio, modo);

                if (!acc[periodo]) {
                    acc[periodo] = { periodo, totalVentas: 0, cantidadPresupuestos: 0 };
                }

                acc[periodo].totalVentas += Number(presupuesto.ventaTotal || 0);
                acc[periodo].cantidadPresupuestos++;

                return acc;
            }, {} as Record<string, any>);

            const resultado = Object.values(ventasPorPeriodo).sort(
                (a: any, b: any) => {
                    if (modo === 'semanal') {
                        // Para semanal, extraer el número de semana y ordenar
                        const semanaA = parseInt(a.periodo.replace('Semana ', ''));
                        const semanaB = parseInt(b.periodo.replace('Semana ', ''));
                        return semanaA - semanaB;
                    } else {
                        // Para mensual, ordenar por YYYY-MM
                        return a.periodo.localeCompare(b.periodo);
                    }
                }
            );

            return resultado;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtiene cantidad de presupuestos por cambio de fecha según auditoría
     * Basado en getPresupuestosPorCambioFecha pero retorna solo cantidades en lugar de montos
     * Consulta la tabla auditoría unida con presupuesto para obtener el último registro
     * de cada presupuesto que esté actualmente en alguno de los procesos especificados
     */
    async getCantidadPresupuestosPorCambioFecha(options: {
        anio?: number;
        mes?: number;
        procesosGenerales?: number[];
        modo?: 'semanal' | 'mensual';
        from?: string;
        to?: string;
    } = {}) {
        const {
            anio,
            mes,
            procesosGenerales = [PROCESO_GENERAL.FACTURADO],
            modo = 'semanal',
            from,
            to
        } = options;

        // Validar que procesosGenerales solo contenga números válidos
        const procesosValidos = procesosGenerales.filter(p => typeof p === 'number' && !isNaN(p));
        if (procesosValidos.length === 0) {
            procesosValidos.push(PROCESO_GENERAL.FACTURADO);
        }

        try {
            // El rango explícito tiene prioridad sobre anio/mes
            const usaRango = Boolean(from && to);
            const filtraFecha = usaRango || (Boolean(anio && mes) && modo === 'semanal');
            const params: any[] = [];

            let filtroFechaSQL = '';
            if (filtraFecha) {
                if (usaRango) {
                    // Usar rango explícito
                    filtroFechaSQL = `
                        AND a.fecha >= ?
                        AND a.fecha <= ?
                    `;
                    params.push(from, to);
                } else {
                    // Usar anio/mes
                    const startDate = `${anio}-${String(mes).padStart(2, '0')}-01`;
                    // Para obtener el último día del mes: mes actual - 1 (porque Date usa base 0) y día 0 del mes siguiente
                    const lastDay = new Date(anio!, mes!, 0).getDate();
                    const endDate = `${anio}-${String(mes).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;


                    filtroFechaSQL = `
                        AND a.fecha >= ?
                        AND a.fecha <= CONCAT(?, ' 23:59:59')
                    `;
                    params.push(startDate, endDate);
                }
            } else {
            }

            // Auditorías
            const auditoriasQuery = `
      SELECT 
        a.registro_id AS presupuestoId,
        a.fecha AS fechaCambio
      FROM auditoria a
      WHERE a.tabla = 'presupuesto'
        AND a.columna = 'procesoGeneralId'
        AND a.valor_nuevo IN (${procesosGenerales.map(() => '?').join(',')})
        ${filtroFechaSQL}
        AND a.id = (
          SELECT MAX(a2.id)
          FROM auditoria a2
          WHERE a2.tabla = 'presupuesto'
            AND a2.columna = 'procesoGeneralId'
            AND a2.registro_id = a.registro_id
            AND a2.valor_nuevo IN (${procesosGenerales.map(() => '?').join(',')})
        )
      ORDER BY a.fecha
    `;
            const auditorias = await this.presupuestoRepository.query(
                auditoriasQuery,
                [...procesosGenerales, ...params, ...procesosGenerales]
            );

            if (!auditorias.length) {
                return [];
            }

            // IDs de presupuestos
            const presupuestoIds = auditorias.map(a => a.presupuestoId);

            // Presupuestos (solo necesitamos validar que existan y estén en el proceso correcto)
            const presupuestos = await this.presupuestoRepository
                .createQueryBuilder('presupuesto')
                .select(['presupuesto.id'])
                .where('presupuesto.id IN (:...ids)', { ids: presupuestoIds })
                .andWhere('presupuesto.procesoGeneralId IN (:...procesosGenerales)', { procesosGenerales })
                .getMany();


            // Mapear auditorías
            const auditoriaMap = Object.fromEntries(
                auditorias.map(a => [a.presupuestoId, a.fechaCambio])
            );

            // Agrupación unificada por modo
            const cantidadesPorPeriodo = presupuestos.reduce((acc, presupuesto) => {
                const fechaCambio = new Date(auditoriaMap[presupuesto.id]);
                const periodo = this.agruparPorPeriodo(fechaCambio, modo);

                if (!acc[periodo]) {
                    acc[periodo] = { periodo, cantidadPresupuestos: 0 };
                }
                acc[periodo].cantidadPresupuestos++;
                acc[periodo].totalVentas = acc[periodo].cantidadPresupuestos;

                return acc;
            }, {} as Record<string, any>);

            const resultado = Object.values(cantidadesPorPeriodo).sort(
                (a: any, b: any) => {
                    if (modo === 'semanal') {
                        // Para semanal, extraer el número de semana y ordenar
                        const semanaA = parseInt(a.periodo.replace('Semana ', ''));
                        const semanaB = parseInt(b.periodo.replace('Semana ', ''));
                        return semanaA - semanaB;
                    } else {
                        // Para mensual, ordenar por YYYY-MM
                        return a.periodo.localeCompare(b.periodo);
                    }
                }
            );

            return resultado;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtiene presupuestos por cliente para una semana específica basado en cambios de auditoría
     */
    async getPresupuestosPorCambioFechaPorCliente(
        anio: number,
        mes: number,
        semana: number,
        procesosGenerales: number[],
        variante?: string
    ) {
        const startDate = `${anio}-${String(mes).padStart(2, "0")}-01`;
        const lastDay = new Date(anio, mes, 0).getDate();
        const endDate = `${anio}-${String(mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;


        // Primero obtener los IDs y fechas de auditoría
        const auditoriasQuery = `
            SELECT 
                a.registro_id as presupuestoId,
                a.fecha as fechaCambio
            FROM auditoria a
            WHERE a.tabla = 'presupuesto'
                AND a.columna = 'procesoGeneralId'
                AND a.valor_nuevo IN (${procesosGenerales.map(p => `'${p}'`).join(',')})
                AND a.fecha >= ?
                AND a.fecha <= CONCAT(?, ' 23:59:59')
            ORDER BY a.fecha
        `;

        const auditorias = await this.presupuestoRepository.query(auditoriasQuery, [
            startDate,
            endDate
        ]);

        if (!auditorias || auditorias.length === 0) {
            return [];
        }

        // Obtener los IDs de presupuestos
        const presupuestoIds = auditorias.map(a => a.presupuestoId);
        const qb = this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .leftJoinAndSelect('presupuesto.cliente', 'cliente')
            .where('presupuesto.id IN (:...ids)', { ids: presupuestoIds })
            .andWhere('presupuesto.venta_total IS NOT NULL');
        if (variante !== 'acumulado') {
            qb.andWhere('presupuesto.procesoGeneralId IN (:...procesosGenerales)', { procesosGenerales });
        }

        const presupuestos = await qb.getMany();


        // Crear un mapa de auditorías por presupuesto ID
        const auditoriaMap = {};
        auditorias.forEach(a => {
            auditoriaMap[a.presupuestoId] = a.fechaCambio;
        });

        // Filtrar por semana y agrupar por cliente
        const ventasPorCliente = {};

        presupuestos.forEach(presupuesto => {
            const fechaCambio = new Date(auditoriaMap[presupuesto.id]);
            const semanaPresupuesto = this.getWeekOfMonth(fechaCambio);

            if (semanaPresupuesto === semana) {
                const clienteId = presupuesto.cliente?.id || presupuesto.clienteId;
                const clienteNombre = presupuesto.cliente?.nombre || 'Sin cliente';

                if (!ventasPorCliente[clienteId]) {
                    ventasPorCliente[clienteId] = {
                        clienteId: clienteId,
                        clienteNombre: clienteNombre,
                        totalVentas: 0,
                        cantidadPresupuestos: 0
                    };
                }

                ventasPorCliente[clienteId].totalVentas += parseFloat(presupuesto.ventaTotal?.toString() || '0');
                ventasPorCliente[clienteId].cantidadPresupuestos += 1;
            }
        });

        const resultado = Object.values(ventasPorCliente)
            .sort((a: any, b: any) => b.totalVentas - a.totalVentas);

        return resultado;
    }

    /**
     * Obtiene los presupuestos de un cliente específico para una semana basado en cambios de auditoría
     */
    async getPresupuestosClientePorCambioFecha(
        anio: number,
        mes: number,
        semana: number,
        clienteId: number,
        procesosGenerales: number[],
        variante?: string
    ) {
        const startDate = `${anio}-${String(mes).padStart(2, "0")}-01`;
        const lastDay = new Date(anio, mes, 0).getDate();
        const endDate = `${anio}-${String(mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

        // Primero obtener los IDs y fechas de auditoría
        const auditoriasQuery = `
            SELECT 
                a.registro_id as presupuestoId,
                a.fecha as fechaCambio
            FROM auditoria a
            WHERE a.tabla = 'presupuesto'
                AND a.columna = 'procesoGeneralId'
                AND a.valor_nuevo IN (${procesosGenerales.map(p => `'${p}'`).join(',')})
                AND a.fecha >= ?
                AND a.fecha <= CONCAT(?, ' 23:59:59')
                AND a.id = (
                    SELECT MAX(a2.id)
                    FROM auditoria a2
                    WHERE a2.tabla = 'presupuesto'
                        AND a2.columna = 'procesoGeneralId'
                        AND a2.registro_id = a.registro_id
                        AND a2.valor_nuevo IN (${procesosGenerales.map(p => `'${p}'`).join(',')})
                )
            ORDER BY a.fecha
        `;

        const auditorias = await this.presupuestoRepository.query(auditoriasQuery, [
            startDate,
            endDate
        ]);

        if (!auditorias || auditorias.length === 0) {
            return [];
        }

        // Obtener los IDs de presupuestos
        const presupuestoIds = auditorias.map(a => a.presupuestoId);

        // Buscar los presupuestos con esos IDs y del cliente específico
        const qb = this.presupuestoRepository
            .createQueryBuilder('presupuesto')
            .leftJoinAndSelect('presupuesto.cliente', 'cliente')
            .where('presupuesto.id IN (:...ids)', { ids: presupuestoIds })
            .andWhere('presupuesto.venta_total IS NOT NULL')
            .andWhere('presupuesto.clienteId = :clienteId', { clienteId });
        if (variante !== 'acumulado') {
            qb.andWhere('presupuesto.procesoGeneralId IN (:...procesosGenerales)', { procesosGenerales });
        }

        const presupuestos = await qb.getMany();


        // Crear un mapa de auditorías por presupuesto ID
        const auditoriaMap = {};
        auditorias.forEach(a => {
            auditoriaMap[a.presupuestoId] = a.fechaCambio;
        });

        // Filtrar por semana y mapear los datos necesarios
        const presupuestosFiltrados = presupuestos
            .filter(presupuesto => {
                const fechaCambio = new Date(auditoriaMap[presupuesto.id]);
                const semanaPresupuesto = this.getWeekOfMonth(fechaCambio);
                return semanaPresupuesto === semana;
            })
            .map(presupuesto => ({
                id: presupuesto.id,
                ventaTotal: parseFloat(presupuesto.ventaTotal?.toString() || '0'),
                fecha: auditoriaMap[presupuesto.id],
                fechaDesdeProceso: auditoriaMap[presupuesto.id],
                cliente: {
                    id: presupuesto.cliente?.id || presupuesto.clienteId,
                    nombre: presupuesto.cliente?.nombre || 'Sin cliente'
                }
            }));

        return presupuestosFiltrados;
    }

    /**
     * Agrupa una fecha según el modo especificado
     */
    private agruparPorPeriodo(fechaCambio: Date, modo: 'semanal' | 'mensual'): string {
        if (modo === 'semanal') {
            const semana = this.getWeekOfMonth(fechaCambio);
            return `Semana ${semana}`;
        } else {
            const año = fechaCambio.getFullYear();
            const mes = fechaCambio.getMonth() + 1;
            return `${año}-${String(mes).padStart(2, '0')}`;
        }
    }

    /**
     * Calcula la semana del mes (1-5) para una fecha dada
     */
    private getWeekOfMonth(fecha: string | Date): number {
        let dia: number;

        if (fecha instanceof Date) {
            // usar UTC para que no se corra de mes
            dia = fecha.getUTCDate();
        } else {
            // ya es string YYYY-MM-DD
            dia = parseInt(fecha.split("-")[2], 10);
        }

        return Math.min(4, Math.ceil(dia / 7));
    }
}
