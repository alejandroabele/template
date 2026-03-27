import { Area, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'area'
const fetch = async (query: Query): Promise<Area[]> => {

    return fetchClient<Area[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Area> => {
    return fetchClient<Area>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Area): Promise<Area> => {
    return fetchClient<Area>(basePath, 'POST', body);
};

const edit = async (id: number, body: Area): Promise<Area> => {
    return fetchClient<Area>(`${basePath}/${id}`, 'PATCH', body);
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
