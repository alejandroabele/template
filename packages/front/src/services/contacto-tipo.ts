import { ContactoTipo, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'contacto-tipo'

const fetch = async (query: Query): Promise<ContactoTipo[]> => {
    return fetchClient<ContactoTipo[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContactoTipo> => {
    return fetchClient<ContactoTipo>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContactoTipo): Promise<ContactoTipo> => {
    return fetchClient<ContactoTipo>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContactoTipo): Promise<ContactoTipo> => {
    return fetchClient<ContactoTipo>(`${basePath}/${id}`, 'PATCH', body);
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
