import { CashflowCategoria, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'cashflow-categoria'

const fetch = async (query: Query): Promise<CashflowCategoria[]> => {
    return fetchClient<CashflowCategoria[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<CashflowCategoria> => {
    return fetchClient<CashflowCategoria>(`${basePath}/${id}`, 'GET');
};

const create = async (body: CashflowCategoria): Promise<CashflowCategoria> => {
    return fetchClient<CashflowCategoria>(basePath, 'POST', body);
};

const edit = async (id: number, body: CashflowCategoria): Promise<CashflowCategoria> => {
    return fetchClient<CashflowCategoria>(`${basePath}/${id}`, 'PATCH', body);
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
