import { Cartel, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'cartel';

const fetch = async (query: Query): Promise<any[]> => {
    return fetchClient<any[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<any> => {
    return fetchClient<any>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Partial<Cartel> & { codigo: string; proveedor: string }): Promise<any> => {
    return fetchClient<any>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<Cartel> & { codigo?: string; proveedor?: string }): Promise<any> => {
    return fetchClient<any>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export { fetch, fetchById, create, edit, remove };
