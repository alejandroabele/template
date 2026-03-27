import { ContratoMarcoPresupuesto, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'contrato-marco-presupuesto'
const fetch = async (query: Query): Promise<ContratoMarcoPresupuesto[]> => {

    return fetchClient<ContratoMarcoPresupuesto[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContratoMarcoPresupuesto> => {
    return fetchClient<ContratoMarcoPresupuesto>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContratoMarcoPresupuesto): Promise<ContratoMarcoPresupuesto> => {
    return fetchClient<ContratoMarcoPresupuesto>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContratoMarcoPresupuesto): Promise<ContratoMarcoPresupuesto> => {
    return fetchClient<ContratoMarcoPresupuesto>(`${basePath}/${id}`, 'PATCH', body);
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
