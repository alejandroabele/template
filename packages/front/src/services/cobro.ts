import { Cobro, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'cobro'

const fetch = async (query: Query): Promise<Cobro[]> => {
    return fetchClient<Cobro[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Cobro> => {
    return fetchClient<Cobro>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Cobro): Promise<Cobro> => {
    try {
        return await fetchClient<Cobro>(basePath, 'POST', body);
    } catch (error) {
        throw error;
    }
};

const edit = async (id: number, body: Cobro): Promise<Cobro> => {
    return fetchClient<Cobro>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export interface CobroMasivoItem {
    facturaId: number;
    monto: number;
}

export interface CobroMasivoRequest {
    fecha: string;
    metodoPagoId?: number;
    bancoId?: number;
    retenciones?: string;
    facturas: CobroMasivoItem[];
}

const createMasivo = async (body: CobroMasivoRequest): Promise<any> => {
    try {
        return await fetchClient<any>(`${basePath}/masivo`, 'POST', body);
    } catch (error) {
        throw error;
    }
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    createMasivo,
};
