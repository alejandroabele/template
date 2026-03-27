import { CashflowRubro, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'cashflow-rubro'

const fetch = async (query: Query): Promise<CashflowRubro[]> => {
    return fetchClient<CashflowRubro[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<CashflowRubro> => {
    return fetchClient<CashflowRubro>(`${basePath}/${id}`, 'GET');
};

const create = async (body: CashflowRubro): Promise<CashflowRubro> => {
    return fetchClient<CashflowRubro>(basePath, 'POST', body);
};

const edit = async (id: number, body: CashflowRubro): Promise<CashflowRubro> => {
    return fetchClient<CashflowRubro>(`${basePath}/${id}`, 'PATCH', body);
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
