import { CashflowAgrupacion } from '@/types';
import fetchClient from '@/lib/api-client';

const basePath = 'cashflow-agrupacion';

const fetch = async (): Promise<CashflowAgrupacion[]> => {
    return fetchClient<CashflowAgrupacion[]>(basePath, 'GET');
};

const fetchById = async (id: number): Promise<CashflowAgrupacion> => {
    return fetchClient<CashflowAgrupacion>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Partial<CashflowAgrupacion>): Promise<CashflowAgrupacion> => {
    return fetchClient<CashflowAgrupacion>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<CashflowAgrupacion>): Promise<CashflowAgrupacion> => {
    return fetchClient<CashflowAgrupacion>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export { fetch, fetchById, create, edit, remove };
