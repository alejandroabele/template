import { Factura, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'factura'

const fetch = async (query: Query): Promise<Factura[]> => {
    return fetchClient<Factura[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Factura> => {
    return fetchClient<Factura>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Factura): Promise<Factura> => {
    try {
        return await fetchClient<Factura>(basePath, 'POST', body);
    } catch (error) {
        throw error;
    }
};

const edit = async (id: number, body: Factura): Promise<Factura> => {
    return fetchClient<Factura>(`${basePath}/${id}`, 'PATCH', body);
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
