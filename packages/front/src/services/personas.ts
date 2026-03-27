import { Persona, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'persona'

const fetch = async (query: Query): Promise<Persona[]> => {
    return fetchClient<Persona[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Persona> => {
    return fetchClient<Persona>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Persona): Promise<Persona> => {
    return fetchClient<Persona>(basePath, 'POST', body);
};

const edit = async (id: number, body: Persona): Promise<Persona> => {
    return fetchClient<Persona>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const fetchPorDni = async (dni: string): Promise<Persona> => {
    return fetchClient<Persona>(`${basePath}/por-dni/${dni}`, 'GET');
};

export {
    fetch,
    fetchById,
    fetchPorDni,
    create,
    edit,
    remove
};
