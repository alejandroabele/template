import { PresupuestoProduccion, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'presupuesto-produccion'
const fetch = async (query: Query): Promise<PresupuestoProduccion[]> => {
    return fetchClient<PresupuestoProduccion[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<PresupuestoProduccion> => {
    return fetchClient<PresupuestoProduccion>(`${basePath}/${id}`, 'GET');
};

const create = async (body: PresupuestoProduccion): Promise<PresupuestoProduccion> => {
    return fetchClient<PresupuestoProduccion>(basePath, 'POST', body);
};

const edit = async (id: number, body: PresupuestoProduccion): Promise<PresupuestoProduccion> => {
    return fetchClient<PresupuestoProduccion>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};
const fetchExcel = async (query: Query): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/excel?${generateQueryParams(query)}`, 'GET');
};

const fetchPdf = async (id: number): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/${id}/pdf`, 'GET');
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    fetchExcel,
    fetchPdf
};
