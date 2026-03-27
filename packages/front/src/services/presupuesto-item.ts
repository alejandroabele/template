import { PresupuestoItem, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'presupuesto-item'
const fetch = async (query: Query): Promise<PresupuestoItem[]> => {
    return fetchClient<PresupuestoItem[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<PresupuestoItem> => {
    return fetchClient<PresupuestoItem>(`${basePath}/${id}`, 'GET');
};

const create = async (body: PresupuestoItem): Promise<PresupuestoItem> => {
    return fetchClient<PresupuestoItem>(basePath, 'POST', body);
};

const edit = async (id: number, body: PresupuestoItem): Promise<PresupuestoItem> => {
    return fetchClient<PresupuestoItem>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};


export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
};
