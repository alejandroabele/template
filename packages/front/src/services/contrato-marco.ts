import { ContratoMarco, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'contrato-marco'
const fetch = async (query: Query): Promise<ContratoMarco[]> => {

    return fetchClient<ContratoMarco[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContratoMarco> => {
    return fetchClient<ContratoMarco>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContratoMarco): Promise<ContratoMarco> => {
    return fetchClient<ContratoMarco>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContratoMarco): Promise<ContratoMarco> => {
    return fetchClient<ContratoMarco>(`${basePath}/${id}`, 'PATCH', body);
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
