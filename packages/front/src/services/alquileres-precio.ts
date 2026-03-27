import { AlquilerPrecio, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'alquiler-precio'
const fetch = async (query: Query): Promise<AlquilerPrecio[]> => {

    return fetchClient<AlquilerPrecio[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<AlquilerPrecio> => {
    return fetchClient<AlquilerPrecio>(`${basePath}/${id}`, 'GET');
};

const create = async (body: AlquilerPrecio): Promise<AlquilerPrecio> => {
    try {
        return await fetchClient<AlquilerPrecio>(basePath, 'POST', body);
    } catch (error) {
        // Asegúrate de lanzar el error para que se capture en el cliente
        throw error;
    }
};

const edit = async (id: number, body: AlquilerPrecio): Promise<AlquilerPrecio> => {
    return fetchClient<AlquilerPrecio>(`${basePath}/${id}`, 'PATCH', body);
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
