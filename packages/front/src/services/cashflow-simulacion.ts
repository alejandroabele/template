import { CashflowSimulacion, CashflowSimulacionTransaccion, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';
import { ColumnasResponse } from './cashflow-transaccion';

const basePath = 'cashflow/simulaciones';

// ========== GESTIÓN DE SIMULACIONES ==========

const fetchAll = async (query?: Query): Promise<CashflowSimulacion[]> => {
    const params = query ? `?${generateQueryParams(query)}` : '';
    return fetchClient<CashflowSimulacion[]>(`${basePath}${params}`, 'GET');
};

const fetchById = async (id: number): Promise<CashflowSimulacion> => {
    return fetchClient<CashflowSimulacion>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Omit<CashflowSimulacion, 'id' | 'createdAt'>): Promise<CashflowSimulacion> => {
    return fetchClient<CashflowSimulacion>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<Pick<CashflowSimulacion, 'nombre' | 'descripcion'>>): Promise<CashflowSimulacion> => {
    return fetchClient<CashflowSimulacion>(`${basePath}/${id}`, 'PUT', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

// ========== TRANSACCIONES DE SIMULACIÓN ==========

const createTransaccion = async (simulacionId: number, body: Omit<CashflowSimulacionTransaccion, 'id' | 'simulacionId'>): Promise<CashflowSimulacionTransaccion> => {
    return fetchClient<CashflowSimulacionTransaccion>(`${basePath}/${simulacionId}/transacciones`, 'POST', body);
};

const editTransaccion = async (simulacionId: number, id: number, body: Partial<CashflowSimulacionTransaccion>): Promise<CashflowSimulacionTransaccion> => {
    return fetchClient<CashflowSimulacionTransaccion>(`${basePath}/${simulacionId}/transacciones/${id}`, 'PUT', body);
};

const removeTransaccion = async (simulacionId: number, id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${simulacionId}/transacciones/${id}`, 'DELETE');
};

const fetchBusqueda = async (simulacionId: number, query: Query): Promise<CashflowSimulacionTransaccion[]> => {
    return fetchClient<CashflowSimulacionTransaccion[]>(
        `${basePath}/${simulacionId}/transacciones/busqueda?${generateQueryParams(query)}`,
        'GET',
    );
};

// ========== RESÚMENES DE SIMULACIÓN ==========

const fetchResumenSemana = async (simulacionId: number, from: string, to: string) => {
    return fetchClient(`${basePath}/${simulacionId}/resumen-semana?from=${from}&to=${to}`, 'GET');
};

const fetchResumenMes = async (simulacionId: number, from: string, to: string) => {
    return fetchClient(`${basePath}/${simulacionId}/resumen-mes?from=${from}&to=${to}`, 'GET');
};

const fetchResumenTrimestre = async (simulacionId: number, year: number) => {
    return fetchClient(`${basePath}/${simulacionId}/resumen-trimestre?year=${year}`, 'GET');
};

const fetchResumenSemanaMes = async (simulacionId: number, year: number, month: number) => {
    return fetchClient(`${basePath}/${simulacionId}/resumen-semana-mes?year=${year}&month=${month}`, 'GET');
};

const fetchColumnas = async (
    simulacionId: number,
    vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
    params: { from?: string; year?: number; month?: number },
): Promise<ColumnasResponse> => {
    const queryParams = new URLSearchParams({ vista });
    if (params.from) queryParams.append('from', params.from);
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.month) queryParams.append('month', params.month.toString());
    return fetchClient<ColumnasResponse>(`${basePath}/${simulacionId}/columnas?${queryParams.toString()}`, 'GET');
};

export {
    fetchAll,
    fetchById,
    create,
    edit,
    remove,
    createTransaccion,
    editTransaccion,
    removeTransaccion,
    fetchBusqueda,
    fetchResumenSemana,
    fetchResumenMes,
    fetchResumenTrimestre,
    fetchResumenSemanaMes,
    fetchColumnas,
};
