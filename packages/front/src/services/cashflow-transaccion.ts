import { CashflowTransaccion, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'cashflow/transacciones';



const fetchById = async (id: number): Promise<CashflowTransaccion> => {
    return fetchClient<CashflowTransaccion>(`${basePath}/${id}`, 'GET');
};

const create = async (body: CashflowTransaccion): Promise<CashflowTransaccion> => {
    return fetchClient<CashflowTransaccion>(basePath, 'POST', body);
};

const edit = async (id: number, body: CashflowTransaccion): Promise<CashflowTransaccion> => {
    return fetchClient<CashflowTransaccion>(`${basePath}/${id}`, 'PUT', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};



// Nuevo servicio optimizado para obtener resumen completo de la semana
const fetchResumenSemana = async (from: string, to: string, incluirProyectado: boolean) => {
    // Siempre enviar el parámetro incluirProyectado explícitamente
    const url = `cashflow/resumen-semana?from=${from}&to=${to}&incluirProyectado=${incluirProyectado}`;

    return fetchClient(url, 'GET');
};

// Nuevo servicio para obtener resumen completo del mes
const fetchResumenMes = async (from: string, to: string, incluirProyectado: boolean) => {
    const url = `cashflow/resumen-mes?from=${from}&to=${to}&incluirProyectado=${incluirProyectado}`;

    return fetchClient(url, 'GET');
};

// Servicio para obtener resumen por trimestre
const fetchResumenTrimestre = async (year: number, incluirProyectado: boolean) => {
    const url = `cashflow/resumen-trimestre?year=${year}&incluirProyectado=${incluirProyectado}`;

    return fetchClient(url, 'GET');
};

// Servicio para obtener resumen por semanas del mes
const fetchResumenSemanaMes = async (year: number, month: number, incluirProyectado: boolean) => {
    const url = `cashflow/resumen-semana-mes?year=${year}&month=${month}&incluirProyectado=${incluirProyectado}`;

    return fetchClient(url, 'GET');
};

// Servicio para obtener columnas según vista
const fetchColumnas = async (
    vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
    params: { from?: string; year?: number; month?: number }
): Promise<ColumnasResponse> => {
    const queryParams = new URLSearchParams({ vista });

    if (params.from) queryParams.append('from', params.from);
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.month) queryParams.append('month', params.month.toString());

    const url = `cashflow/columnas?${queryParams.toString()}`;
    return fetchClient<ColumnasResponse>(url, 'GET');
};

// Interfaces para columnas
export interface ColumnasResponse {
    fechas: string[];
    semanasInfo?: {
        [key: string]: {
            inicio: string;
            fin: string;
        };
    };
}

// Interfaces para reportes
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

// Servicios para reportes de dashboard
const fetchTotalesPeriodo = async (
    fechaInicio: string,
    fechaFin: string,
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
): Promise<TotalesPeriodo> => {
    const params = new URLSearchParams({
        fechaInicio,
        fechaFin,
    });

    if (categoriasIngreso && categoriasIngreso.length > 0) {
        params.append('categoriasIngreso', categoriasIngreso.join(','));
    }

    if (categoriasEgreso && categoriasEgreso.length > 0) {
        params.append('categoriasEgreso', categoriasEgreso.join(','));
    }

    return fetchClient<TotalesPeriodo>(`cashflow/reportes/totales?${params.toString()}`, 'GET');
};

const fetchEvolucionIngresosEgresos = async (
    fechaInicio: string,
    fechaFin: string,
    modo: 'dia' | 'mes',
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
): Promise<EvolucionData[]> => {
    const params = new URLSearchParams({
        fechaInicio,
        fechaFin,
        modo,
    });

    if (categoriasIngreso && categoriasIngreso.length > 0) {
        params.append('categoriasIngreso', categoriasIngreso.join(','));
    }

    if (categoriasEgreso && categoriasEgreso.length > 0) {
        params.append('categoriasEgreso', categoriasEgreso.join(','));
    }

    return fetchClient<EvolucionData[]>(`cashflow/reportes/evolucion-ingresos-egresos?${params.toString()}`, 'GET');
};

const fetchEvolucionSaldo = async (
    fechaInicio: string,
    fechaFin: string,
    modo: 'dia' | 'mes',
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
): Promise<SaldoAcumuladoData[]> => {
    const params = new URLSearchParams({
        fechaInicio,
        fechaFin,
        modo,
    });

    if (categoriasIngreso && categoriasIngreso.length > 0) {
        params.append('categoriasIngreso', categoriasIngreso.join(','));
    }

    if (categoriasEgreso && categoriasEgreso.length > 0) {
        params.append('categoriasEgreso', categoriasEgreso.join(','));
    }

    return fetchClient<SaldoAcumuladoData[]>(`cashflow/reportes/evolucion-saldo?${params.toString()}`, 'GET');
};

const fetchProyeccion = async (tipo: 'ingreso' | 'egreso', fechaInicio?: string, fechaFin?: string): Promise<DeudasData> => {
    const params = new URLSearchParams({ tipo });
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    return fetchClient<DeudasData>(`cashflow/reportes/proyeccion?${params.toString()}`, 'GET');
};

const fetchBusqueda = async (query: Query): Promise<CashflowTransaccion[]> => {
    return fetchClient<CashflowTransaccion[]>(`cashflow/transacciones/busqueda?${generateQueryParams(query)}`, 'GET');
};

export interface TransaccionCategoriaItem {
    fecha: string;
    monto: number;
    descripcion: string | null;
}

const fetchTransaccionesCategoria = async (
    categoriaId: number,
    modo: 'futuro' | 'pasado' | 'futuro-mes' | 'pasado-mes',
    fechaInicio?: string,
    fechaFin?: string,
): Promise<TransaccionCategoriaItem[]> => {
    const params = new URLSearchParams({ categoriaId: String(categoriaId), modo });
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    return fetchClient<TransaccionCategoriaItem[]>(`cashflow/reportes/transacciones-categoria?${params.toString()}`, 'GET');
};

const fetchConciliar = async (id: number): Promise<CashflowTransaccion> => {
    return fetchClient<CashflowTransaccion>(`${basePath}/${id}/conciliar`, 'POST');
};

const migrarDesdeExcel = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetchClient<any>('cashflow/migrar-excel', 'POST', formData);
};

const exportarExcel = async (
    from: string,
    to: string,
    modo: 'dia' | 'semana' | 'mes' | 'trimestre',
    incluirProyectado?: boolean,
): Promise<Blob> => {
    const params = new URLSearchParams({ from, to, modo });
    if (incluirProyectado !== undefined) params.set('incluirProyectado', String(incluirProyectado));
    return fetchClient<Blob>(`cashflow/exportar-excel?${params.toString()}`, 'GET');
};

export {
    fetchById,
    fetchBusqueda,
    fetchTransaccionesCategoria,
    create,
    edit,
    remove,
    fetchConciliar,
    fetchProyeccion,
    fetchResumenSemana,
    fetchResumenMes,
    fetchResumenTrimestre,
    fetchResumenSemanaMes,
    fetchColumnas,
    fetchTotalesPeriodo,
    fetchEvolucionIngresosEgresos,
    fetchEvolucionSaldo,
    migrarDesdeExcel,
    exportarExcel,
};
