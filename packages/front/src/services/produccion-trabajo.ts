import { ProduccionTrabajo, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'produccion-trabajos'
const fetch = async (query: Query): Promise<ProduccionTrabajo[]> => {

    return fetchClient<ProduccionTrabajo[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ProduccionTrabajo> => {
    return fetchClient<ProduccionTrabajo>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ProduccionTrabajo): Promise<ProduccionTrabajo> => {
    return fetchClient<ProduccionTrabajo>(basePath, 'POST', body);
};

const edit = async (id: number, body: ProduccionTrabajo): Promise<ProduccionTrabajo> => {
    return fetchClient<ProduccionTrabajo>(`${basePath}/${id}`, 'PATCH', body);
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
