import { Categoria, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'categoria'
const fetch = async (query: Query): Promise<Categoria[]> => {
    return fetchClient<Categoria[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Categoria> => {
    return fetchClient<Categoria>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Categoria): Promise<Categoria> => {
    return fetchClient<Categoria>(basePath, 'POST', body);
};

const edit = async (id: number, body: Categoria): Promise<Categoria> => {
    return fetchClient<Categoria>(`${basePath}/${id}`, 'PATCH', body);
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
