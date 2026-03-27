import { MetodoPago, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'metodo-pago'
const fetch = async (query: Query): Promise<MetodoPago[]> => {

    return fetchClient<MetodoPago[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<MetodoPago> => {
    return fetchClient<MetodoPago>(`${basePath}/${id}`, 'GET');
};

const create = async (body: MetodoPago): Promise<MetodoPago> => {
    return fetchClient<MetodoPago>(basePath, 'POST', body);
};

const edit = async (id: number, body: MetodoPago): Promise<MetodoPago> => {
    return fetchClient<MetodoPago>(`${basePath}/${id}`, 'PATCH', body);
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
