import { PresupuestoCobro, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'presupuesto-cobro'
const fetch = async (query: Query): Promise<PresupuestoCobro[]> => {
    return fetchClient<PresupuestoCobro[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<PresupuestoCobro> => {
    return fetchClient<PresupuestoCobro>(`${basePath}/${id}`, 'GET');
};

const create = async (body: PresupuestoCobro): Promise<PresupuestoCobro> => {
    try {
        return await fetchClient<PresupuestoCobro>(basePath, 'POST', body);
    } catch (error) {
        // Asegúrate de lanzar el error para que se capture en el cliente
        throw error;
    }
};

const edit = async (id: number, body: PresupuestoCobro): Promise<PresupuestoCobro> => {
    return fetchClient<PresupuestoCobro>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
};
