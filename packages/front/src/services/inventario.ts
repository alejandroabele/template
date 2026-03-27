import { Inventario, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'inventario'
const fetch = async (query: Query): Promise<Inventario[]> => {

    return fetchClient<Inventario[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Inventario> => {
    return fetchClient<Inventario>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Inventario): Promise<Inventario> => {
    return fetchClient<Inventario>(basePath, 'POST', body);
};

const edit = async (id: number, body: Inventario): Promise<Inventario> => {
    return fetchClient<Inventario>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const createIngresoMercaderia = async (body: any): Promise<Inventario> => {
    return fetchClient<Inventario>(`${basePath}/ingreso-mercaderia`, 'POST', body);
};
const fetchExcel = async (query: Query): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/excel?${generateQueryParams(query)}`, 'GET');
};

const migrarDesdeExcel = async (file: File, manejaStock: boolean = true): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('manejaStock', String(manejaStock));

    return fetchClient<any>(`${basePath}/migrar-excel`, 'POST', formData);
};

const actualizarPrecioManual = async (id: number, body: { precio: string; motivo: string }): Promise<any> => {
    return fetchClient<any>(`${basePath}/${id}/precio`, 'POST', body);
};

const getPrecioHistorial = async (id: number): Promise<any[]> => {
    return fetchClient<any[]>(`${basePath}/${id}/precio-historial`, 'GET');
};

export {
    fetch,
    fetchById,
    create,
    fetchExcel,
    migrarDesdeExcel,
    edit,
    remove,
    createIngresoMercaderia,
    actualizarPrecioManual,
    getPrecioHistorial,
};
