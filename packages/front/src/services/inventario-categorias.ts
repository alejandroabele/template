import { InventarioCategoria, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'inventario-categoria'
const fetch = async (query: Query): Promise<InventarioCategoria[]> => {
    return fetchClient<InventarioCategoria[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<InventarioCategoria> => {
    return fetchClient<InventarioCategoria>(`${basePath}/${id}`, 'GET');
};

const create = async (body: InventarioCategoria): Promise<InventarioCategoria> => {
    return fetchClient<InventarioCategoria>(basePath, 'POST', body);
};

const edit = async (id: number, body: InventarioCategoria): Promise<InventarioCategoria> => {
    return fetchClient<InventarioCategoria>(`${basePath}/${id}`, 'PATCH', body);
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
