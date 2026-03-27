import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';
import { Query } from '@/types';

const basePath = 'herramientas';

const getHerramientas = async (query: Query): Promise<any[]> => {
    return fetchClient<any[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const getHerramienta = async (id: number): Promise<any> => {
    return fetchClient<any>(`${basePath}/${id}`, 'GET');
};

const getHistorial = async (id: number): Promise<any[]> => {
    return fetchClient<any[]>(`${basePath}/${id}/historial`, 'GET');
};

const getPrestamosActivos = async (): Promise<any[]> => {
    return fetchClient<any[]>(`${basePath}/prestamos-activos`, 'GET');
};

const registrarMovimiento = async (id: number, body: { tipo: 'PRESTAMO' | 'DEVOLUCION'; personaId: number; cantidad: number; observaciones?: string }): Promise<any> => {
    return fetchClient<any>(`${basePath}/${id}/movimiento`, 'POST', body);
};

export {
    getHerramientas,
    getHerramienta,
    getHistorial,
    getPrestamosActivos,
    registrarMovimiento,
};
