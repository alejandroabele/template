import { ProveedorRubro, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'proveedor-rubro'
const fetch = async (query: Query): Promise<ProveedorRubro[]> => {

    return fetchClient<ProveedorRubro[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ProveedorRubro> => {
    return fetchClient<ProveedorRubro>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ProveedorRubro): Promise<ProveedorRubro> => {
    return fetchClient<ProveedorRubro>(basePath, 'POST', body);
};

const edit = async (id: number, body: ProveedorRubro): Promise<ProveedorRubro> => {
    return fetchClient<ProveedorRubro>(`${basePath}/${id}`, 'PATCH', body);
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
