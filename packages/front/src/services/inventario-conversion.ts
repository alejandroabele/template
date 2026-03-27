import { InventarioConversion, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'inventario-conversion'
const fetch = async (query: Query): Promise<InventarioConversion[]> => {
    return fetchClient<InventarioConversion[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<InventarioConversion> => {
    return fetchClient<InventarioConversion>(`${basePath}/${id}`, 'GET');
};

const create = async (body: InventarioConversion): Promise<InventarioConversion> => {
    return fetchClient<InventarioConversion>(basePath, 'POST', body);
};

const edit = async (id: number, body: InventarioConversion): Promise<InventarioConversion> => {
    return fetchClient<InventarioConversion>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};


export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
};
