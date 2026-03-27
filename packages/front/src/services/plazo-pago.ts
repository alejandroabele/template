import { PlazoPago, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'plazo-pago'

const fetch = async (query: Query): Promise<PlazoPago[]> => {
    return fetchClient<PlazoPago[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<PlazoPago> => {
    return fetchClient<PlazoPago>(`${basePath}/${id}`, 'GET');
};

const create = async (body: PlazoPago): Promise<PlazoPago> => {
    return fetchClient<PlazoPago>(basePath, 'POST', body);
};

const edit = async (id: number, body: PlazoPago): Promise<PlazoPago> => {
    return fetchClient<PlazoPago>(`${basePath}/${id}`, 'PATCH', body);
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
