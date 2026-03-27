import { AlquilerMantenimiento, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'alquiler-mantenimiento'
const fetch = async (query: Query): Promise<AlquilerMantenimiento[]> => {
    return fetchClient<AlquilerMantenimiento[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<AlquilerMantenimiento> => {
    return fetchClient<AlquilerMantenimiento>(`${basePath}/${id}`, 'GET');
};

const create = async (body: AlquilerMantenimiento): Promise<AlquilerMantenimiento> => {
    try {
        return await fetchClient<AlquilerMantenimiento>(basePath, 'POST', body);
    } catch (error) {
        // Asegúrate de lanzar el error para que se capture en el cliente
        throw error;
    }
};

const edit = async (id: number, body: AlquilerMantenimiento): Promise<AlquilerMantenimiento> => {
    return fetchClient<AlquilerMantenimiento>(`${basePath}/${id}`, 'PATCH', body);
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
