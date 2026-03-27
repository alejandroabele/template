import { ContactoCaso, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'contacto-caso'

const fetch = async (query: Query): Promise<ContactoCaso[]> => {
    return fetchClient<ContactoCaso[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContactoCaso> => {
    return fetchClient<ContactoCaso>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContactoCaso): Promise<ContactoCaso> => {
    return fetchClient<ContactoCaso>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContactoCaso): Promise<ContactoCaso> => {
    return fetchClient<ContactoCaso>(`${basePath}/${id}`, 'PATCH', body);
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
