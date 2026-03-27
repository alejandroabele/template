import { ProcesoGeneral, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'proceso-general'
const fetch = async (query: Query): Promise<ProcesoGeneral[]> => {

    return fetchClient<ProcesoGeneral[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ProcesoGeneral> => {
    return fetchClient<ProcesoGeneral>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ProcesoGeneral): Promise<ProcesoGeneral> => {
    return fetchClient<ProcesoGeneral>(basePath, 'POST', body);
};

const edit = async (id: number, body: ProcesoGeneral): Promise<ProcesoGeneral> => {
    return fetchClient<ProcesoGeneral>(`${basePath}/${id}`, 'PATCH', body);
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
