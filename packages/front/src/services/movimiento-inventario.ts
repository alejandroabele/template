import { MovimientoInventario, EgresoMasivo, ResultadoEgreso, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'
const basePath = 'movimiento-inventario'
const fetch = async (query: Query): Promise<MovimientoInventario[]> => {

    return fetchClient<MovimientoInventario[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<MovimientoInventario> => {
    return fetchClient<MovimientoInventario>(`${basePath}/${id}`, 'GET');
};

const create = async (body: MovimientoInventario): Promise<MovimientoInventario> => {
    return fetchClient<MovimientoInventario>(basePath, 'POST', body);
};

const edit = async (id: number, body: MovimientoInventario): Promise<MovimientoInventario> => {
    return fetchClient<MovimientoInventario>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};



const egresoMasivo = async (body: EgresoMasivo): Promise<ResultadoEgreso[]> => {
    return fetchClient<ResultadoEgreso[]>(`${basePath}/egreso-masivo`, 'POST', body);
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    egresoMasivo
};
