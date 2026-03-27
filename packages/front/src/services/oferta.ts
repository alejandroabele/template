import { Oferta, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'oferta'

const fetch = async (query: Query): Promise<Oferta[]> => {
    return fetchClient<Oferta[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Oferta> => {
    return fetchClient<Oferta>(`${basePath}/${id}`, 'GET');
};

const fetchByIds = async (ids: number[]): Promise<Oferta[]> => {
    const query = {
        pagination: { pageIndex: 0, pageSize: 100 },
        columnFilters: [{ id: 'id', value: ids }],
        sorting: [],
        globalFilter: '',
    };
    return fetchClient<Oferta[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const create = async (body: Oferta): Promise<Oferta> => {
    return fetchClient<Oferta>(basePath, 'POST', body);
};

const edit = async (id: number, body: Oferta): Promise<Oferta> => {
    return fetchClient<Oferta>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const enviarAValidar = async (id: number): Promise<Oferta> => {
    return fetchClient<Oferta>(`${basePath}/${id}/enviar-a-validar`, 'PATCH');
};

const rechazar = async (id: number): Promise<Oferta> => {
    return fetchClient<Oferta>(`${basePath}/${id}/rechazar`, 'PATCH');
};

export {
    fetch,
    fetchById,
    fetchByIds,
    create,
    edit,
    remove,
    enviarAValidar,
    rechazar
};
