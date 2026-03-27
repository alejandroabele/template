import { CuentaContable, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'cuenta-contable';

const fetch = async (query: Query): Promise<CuentaContable[]> => {
    return fetchClient<CuentaContable[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<CuentaContable> => {
    return fetchClient<CuentaContable>(`${basePath}/${id}`, 'GET');
};

const create = async (body: CuentaContable): Promise<CuentaContable> => {
    return fetchClient<CuentaContable>(basePath, 'POST', body);
};

const edit = async (id: number, body: CuentaContable): Promise<CuentaContable> => {
    return fetchClient<CuentaContable>(`${basePath}/${id}`, 'PATCH', body);
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
