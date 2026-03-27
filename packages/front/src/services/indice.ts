import { Indice, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'indice'
const fetch = async (query: Query): Promise<Indice[]> => {

    return fetchClient<Indice[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Indice> => {
    return fetchClient<Indice>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Indice): Promise<Indice> => {
    return fetchClient<Indice>(basePath, 'POST', body);
};

const edit = async (id: number, body: Indice): Promise<Indice> => {
    return fetchClient<Indice>(`${basePath}/${id}`, 'PATCH', body);
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
