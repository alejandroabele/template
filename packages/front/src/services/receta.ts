import { Receta, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'receta'
const fetch = async (query: Query): Promise<Receta[]> => {

    return fetchClient<Receta[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Receta> => {
    return fetchClient<Receta>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Receta): Promise<Receta> => {
    return fetchClient<Receta>(basePath, 'POST', body);
};

const edit = async (id: number, body: Receta): Promise<Receta> => {
    return fetchClient<Receta>(`${basePath}/${id}`, 'PATCH', body);
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
