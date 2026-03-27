import { EstadoCompras, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'estado-compras'

const fetch = async (query: Query): Promise<EstadoCompras[]> => {
    return fetchClient<EstadoCompras[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<EstadoCompras> => {
    return fetchClient<EstadoCompras>(`${basePath}/${id}`, 'GET');
};

const create = async (body: EstadoCompras): Promise<EstadoCompras> => {
    return fetchClient<EstadoCompras>(basePath, 'POST', body);
};

const edit = async (id: number, body: EstadoCompras): Promise<EstadoCompras> => {
    return fetchClient<EstadoCompras>(`${basePath}/${id}`, 'PATCH', body);
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
