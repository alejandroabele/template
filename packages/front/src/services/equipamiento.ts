import { Equipamiento, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'equipamiento';

const fetch = async (query: Query): Promise<Equipamiento[]> => {
    return fetchClient<Equipamiento[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Equipamiento> => {
    return fetchClient<Equipamiento>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Equipamiento): Promise<Equipamiento> => {
    return fetchClient<Equipamiento>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<Equipamiento>): Promise<Equipamiento> => {
    return fetchClient<Equipamiento>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export { fetch, fetchById, create, edit, remove };
