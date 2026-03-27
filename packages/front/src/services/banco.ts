import { Banco, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'bancos'
const fetch = async (query: Query): Promise<Banco[]> => {
    return fetchClient<Banco[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Banco> => {
    return fetchClient<Banco>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Banco): Promise<Banco> => {
    return fetchClient<Banco>(basePath, 'POST', body);
};

const edit = async (id: number, body: Banco): Promise<Banco> => {
    return fetchClient<Banco>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const transferir = async (data: { bancoOrigenId: number; bancoDestinoId: number; monto: number }): Promise<any> => {
    return fetchClient<any>(`${basePath}/transferir`, 'POST', data);
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    transferir
};