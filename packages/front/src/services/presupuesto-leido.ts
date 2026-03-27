import { PresupuestoLeido, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'presupuesto-leido'
const fetch = async (query: Query): Promise<PresupuestoLeido[]> => {

    return fetchClient<PresupuestoLeido[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<PresupuestoLeido> => {
    return fetchClient<PresupuestoLeido>(`${basePath}/${id}`, 'GET');
};

const create = async (body: PresupuestoLeido): Promise<PresupuestoLeido> => {
    return fetchClient<PresupuestoLeido>(basePath, 'POST', body);
};

const edit = async (id: number, body: PresupuestoLeido): Promise<PresupuestoLeido> => {
    return fetchClient<PresupuestoLeido>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove
};
