import { InventarioSubcategoria, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'inventario-subcategoria';

const fetch = async (query: Query): Promise<InventarioSubcategoria[]> => {
    return fetchClient<InventarioSubcategoria[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<InventarioSubcategoria> => {
    return fetchClient<InventarioSubcategoria>(`${basePath}/${id}`, 'GET');
};

const create = async (body: InventarioSubcategoria): Promise<InventarioSubcategoria> => {
    return fetchClient<InventarioSubcategoria>(basePath, 'POST', body);
};

const edit = async (id: number, body: InventarioSubcategoria): Promise<InventarioSubcategoria> => {
    return fetchClient<InventarioSubcategoria>(`${basePath}/${id}`, 'PATCH', body);
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
