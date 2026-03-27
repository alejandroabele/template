import { Comision, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'comision'
const fetch = async (query: Query): Promise<Comision[]> => {

    return fetchClient<Comision[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Comision> => {
    return fetchClient<Comision>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Comision): Promise<Comision> => {
    return fetchClient<Comision>(basePath, 'POST', body);
};

const edit = async (id: number, body: Comision): Promise<Comision> => {
    return fetchClient<Comision>(`${basePath}/${id}`, 'PATCH', body);
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
