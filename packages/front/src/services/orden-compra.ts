import { OrdenCompra, Query, OrdenCompraItem } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'orden-compra'

const fetch = async (query: Query): Promise<OrdenCompra[]> => {
    return fetchClient<OrdenCompra[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<OrdenCompra> => {
    return fetchClient<OrdenCompra>(`${basePath}/${id}`, 'GET');
};

const create = async (body: { ofertaId: number }): Promise<OrdenCompra> => {
    return fetchClient<OrdenCompra>(basePath, 'POST', body);
};

const edit = async (id: number, body: OrdenCompra): Promise<OrdenCompra> => {
    return fetchClient<OrdenCompra>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const fetchPdf = async (id: string): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/${id}/pdf`, 'GET');
};

const cancelar = async (id: number): Promise<OrdenCompra> => {
    return fetchClient<OrdenCompra>(`${basePath}/${id}/cancelar`, 'PATCH');
};

const updateOrdenCompraItem = async (itemId: number, body: Partial<OrdenCompraItem>): Promise<OrdenCompraItem> => {
    return fetchClient<OrdenCompraItem>(`${basePath}/item/${itemId}`, 'PATCH', body);
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    fetchPdf,
    cancelar,
    updateOrdenCompraItem as editOrdenCompraItem
};
