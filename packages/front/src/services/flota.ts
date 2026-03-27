import { Flota, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'flota';

const fetch = async (query: Query): Promise<Flota[]> => {
    return fetchClient<Flota[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Flota> => {
    return fetchClient<Flota>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Flota): Promise<Flota> => {
    return fetchClient<Flota>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<Flota>): Promise<Flota> => {
    return fetchClient<Flota>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export { fetch, fetchById, create, edit, remove };
