import { AlquilerCobranzas, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'alquiler-cobranzas'
const fetch = async (query: Query): Promise<AlquilerCobranzas[]> => {
    return fetchClient<AlquilerCobranzas[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<AlquilerCobranzas> => {
    return fetchClient<AlquilerCobranzas>(`${basePath}/${id}`, 'GET');
};

const create = async (body: AlquilerCobranzas): Promise<AlquilerCobranzas> => {
    try {
        return await fetchClient<AlquilerCobranzas>(basePath, 'POST', body);
    } catch (error) {
        // Asegúrate de lanzar el error para que se capture en el cliente
        throw error;
    }
};

const edit = async (id: number, body: AlquilerCobranzas): Promise<AlquilerCobranzas> => {
    return fetchClient<AlquilerCobranzas>(`${basePath}/${id}`, 'PATCH', body);
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
