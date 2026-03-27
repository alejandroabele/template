import { Reserva, ReservaItem, Query, ValidacionStock, EgresoMasivo } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'reserva'

const fetch = async (query: Query): Promise<Reserva[]> => {
    return fetchClient<Reserva[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Reserva> => {
    return fetchClient<Reserva>(`${basePath}/${id}`, 'GET');
};

const create = async (body: { observaciones?: string; items: ReservaItem[] }): Promise<Reserva> => {
    return fetchClient<Reserva>(basePath, 'POST', body as any);
};

const edit = async (id: number, body: Partial<Reserva>): Promise<Reserva> => {
    return fetchClient<Reserva>(`${basePath}/${id}`, 'PATCH', body as any);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const validarStock = async (items: { productoId: number; cantidad: number }[]): Promise<ValidacionStock[]> => {
    const itemsJson = encodeURIComponent(JSON.stringify(items));
    return fetchClient<ValidacionStock[]>(`${basePath}/validar-stock?items=${itemsJson}`, 'GET');
};

const fetchPdf = async (id: number): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/${id}/pdf`, 'GET');
};

const fetchPdfEgresoOt = async (body: EgresoMasivo): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/egreso-ot/pdf`, 'POST', body);
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
    validarStock,
    fetchPdf,
    fetchPdfEgresoOt,
    fetchExcel,
};
