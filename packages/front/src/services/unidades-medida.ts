import { UnidadMedida, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'unidad-medida'
const fetch = async (query: Query): Promise<UnidadMedida[]> => {

    return fetchClient<UnidadMedida[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<UnidadMedida> => {
    return fetchClient<UnidadMedida>(`${basePath}/${id}`, 'GET');
};

const create = async (body: UnidadMedida): Promise<UnidadMedida> => {
    return fetchClient<UnidadMedida>(basePath, 'POST', body);
};

const edit = async (id: number, body: UnidadMedida): Promise<UnidadMedida> => {
    return fetchClient<UnidadMedida>(`${basePath}/${id}`, 'PATCH', body);
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
