import { ContratoMarcoTalonario, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'contrato-marco-talonario'
const fetch = async (query: Query): Promise<ContratoMarcoTalonario[]> => {

    return fetchClient<ContratoMarcoTalonario[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContratoMarcoTalonario> => {
    return fetchClient<ContratoMarcoTalonario>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContratoMarcoTalonario): Promise<ContratoMarcoTalonario> => {
    return fetchClient<ContratoMarcoTalonario>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContratoMarcoTalonario): Promise<ContratoMarcoTalonario> => {
    return fetchClient<ContratoMarcoTalonario>(`${basePath}/${id}`, 'PATCH', body);
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
