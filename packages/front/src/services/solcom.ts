import { Solcom, Query, SolcomItem } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'solcom'

const fetch = async (query: Query): Promise<Solcom[]> => {
    return fetchClient<Solcom[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Solcom> => {
    return fetchClient<Solcom>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Solcom): Promise<Solcom> => {
    return fetchClient<Solcom>(basePath, 'POST', body);
};

const edit = async (id: number, body: Solcom): Promise<Solcom> => {
    return fetchClient<Solcom>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const finalizar = async (id: number): Promise<Solcom> => {
    return fetchClient<Solcom>(`${basePath}/${id}/finalizar`, 'PATCH');
};

const asignar = async (id: number): Promise<Solcom> => {
    return fetchClient<Solcom>(`${basePath}/${id}/asignar`, 'PATCH');
};

const modificarEstado = async (id: number, estadoId: number): Promise<Solcom> => {
    return fetchClient<Solcom>(`${basePath}/${id}/modificar-estado`, 'PATCH', { estadoId });
};

const generarPdf = async (id: number, descripcionPdf: string): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/${id}/pdf`, 'POST', { descripcionPdf } as any);
};

const fetchItems = async (solcomId: number): Promise<SolcomItem[]> => {
    return fetchClient<SolcomItem[]>(`${basePath}/${solcomId}/items`, 'GET');
};

const fetchAllItems = async (query: Query): Promise<SolcomItem[]> => {
    return fetchClient<SolcomItem[]>(`solcom-items?${generateQueryParams(query)}`, 'GET');
};

const asignarItems = async (itemIds: number | number[]): Promise<SolcomItem[]> => {
    return fetchClient<SolcomItem[]>(`solcom-items/asignar`, 'PATCH', { itemIds } as any);
};

const fetchItemsByIds = async (itemIds: number[]): Promise<SolcomItem[]> => {
    const query = {
        pagination: { pageIndex: 0, pageSize: 1000 },
        columnFilters: [{ id: 'id', value: itemIds }],
        sorting: [],
        globalFilter: '',
    };
    return fetchClient<SolcomItem[]>(`solcom-items?${generateQueryParams(query)}`, 'GET');
};

const fetchItemsBySolcomIds = async (solcomIds: number[]): Promise<SolcomItem[]> => {
    const query = {
        pagination: { pageIndex: 0, pageSize: 1000 },
        columnFilters: [{ id: 'solcomId', value: solcomIds }],
        sorting: [],
        globalFilter: '',
    };
    return fetchClient<SolcomItem[]>(`solcom-items?${generateQueryParams(query)}`, 'GET');
};

export const solcomService = {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    finalizar,
    asignar,
    modificarEstado,
    generarPdf,
    fetchItems,
    fetchAllItems,
    asignarItems,
    fetchItemsByIds,
    fetchItemsBySolcomIds
};
