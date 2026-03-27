import { InventarioReserva, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'inventario-reservas'
const fetch = async (query: Query): Promise<InventarioReserva[]> => {

    return fetchClient<InventarioReserva[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<InventarioReserva> => {
    return fetchClient<InventarioReserva>(`${basePath}/${id}`, 'GET');
};

const create = async (body: InventarioReserva): Promise<InventarioReserva> => {
    return fetchClient<InventarioReserva>(basePath, 'POST', body);
};

const edit = async (id: number, body: InventarioReserva): Promise<InventarioReserva> => {
    return fetchClient<InventarioReserva>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const fetchByPresupuesto = async (presupuestoId: number): Promise<InventarioReserva[]> => {
    return fetchClient<InventarioReserva[]>(`${basePath}/presupuesto/${presupuestoId}`, 'GET');
};

const fetchByPresupuestoAndTrabajo = async (presupuestoId: number, trabajoId: number): Promise<InventarioReserva[]> => {
    return fetchClient<InventarioReserva[]>(`${basePath}/presupuesto/${presupuestoId}/trabajo/${trabajoId}`, 'GET');
};

const fetchByCentroCosto = async (centroCostoId: number): Promise<InventarioReserva[]> => {
    return fetchClient<InventarioReserva[]>(`${basePath}/centro-costo/${centroCostoId}`, 'GET');
};

export {
    fetch,
    fetchById,
    create,
    fetchByPresupuesto,
    fetchByPresupuestoAndTrabajo,
    fetchByCentroCosto,
    edit,
    remove,
};
