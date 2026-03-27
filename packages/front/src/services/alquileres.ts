import { Alquiler, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'alquiler'
const fetch = async (query: Query): Promise<Alquiler[]> => {

    return fetchClient<Alquiler[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Alquiler> => {
    return fetchClient<Alquiler>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Alquiler): Promise<Alquiler> => {
    try {
        return await fetchClient<Alquiler>(basePath, 'POST', body);
    } catch (error) {
        // Asegúrate de lanzar el error para que se capture en el cliente
        throw error;
    }
};

const edit = async (id: number, body: Alquiler): Promise<Alquiler> => {
    return fetchClient<Alquiler>(`${basePath}/${id}`, 'PATCH', body);
};
const editPrecio = async (id: number, body: Alquiler): Promise<Alquiler> => {
    return fetchClient<Alquiler>(`${basePath}/${id}/precio`, 'PATCH', body);
};


const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};
const fetchExcel = async (query: Query): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/excel?${generateQueryParams(query)}`, 'GET');
};


export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    editPrecio,
    fetchExcel
};
