import { AlquilerRecurso, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'alquiler-recurso'
const fetch = async (query: Query): Promise<AlquilerRecurso[]> => {

    return fetchClient<AlquilerRecurso[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<AlquilerRecurso> => {
    return fetchClient<AlquilerRecurso>(`${basePath}/${id}`, 'GET');
};

const create = async (body: AlquilerRecurso): Promise<AlquilerRecurso> => {
    return fetchClient<AlquilerRecurso>(basePath, 'POST', body);
};

const edit = async (id: number, body: AlquilerRecurso): Promise<AlquilerRecurso> => {
    return fetchClient<AlquilerRecurso>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};
const fetchExcel = async (query: Query): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/excel?${generateQueryParams(query)}`, 'GET');
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    fetchExcel
};
