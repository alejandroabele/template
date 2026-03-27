import { Presupuesto, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'presupuesto'
const fetch = async (query: Query): Promise<Presupuesto[]> => {
    return fetchClient<Presupuesto[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const listar = async (query: Query): Promise<Presupuesto[]> => {
    return fetchClient<Presupuesto[]>(`${basePath}/listar?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(basePath, 'POST', body);
};

const edit = async (id: number, body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};
const fetchExcel = async (query: Query): Promise<Blob> => {
    return fetchClient<Blob>(`${basePath}/excel?${generateQueryParams(query)}`, 'GET');
};

const fetchPdf = async (id: string, type: string): Promise<Blob> => {

    return fetchClient<Blob>(`${basePath}/${id}/${type}/pdf`, 'GET');
};
const verificarAlmacen = async (id: number, body: Presupuesto): Promise<{
    presupuesto: Presupuesto;
    success: boolean;
    productosSinStock: Array<{
        productoId: number;
        productoNombre: string;
        trabajoId: number;
        trabajoNombre: string;
        cantidadNecesaria: number;
        stockDisponible: number;
        faltante: number;
    }>;
}> => {
    return fetchClient(`${basePath}/${id}/verificar-almacen`, 'PATCH', body);
};

const registrarFecha = async (id: number, body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}/fecha`, 'PATCH', body);
};
const confirmarEntrega = async (id: number, body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}/confirmar-entrega`, 'PATCH', body);
};
const verificarServicio = async (id: number, body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}/verificar-servicio`, 'PATCH', body);
};
const certificar = async (id: number, body: Presupuesto): Promise<Presupuesto> => {
    return fetchClient<Presupuesto>(`${basePath}/${id}/certificar`, 'PATCH', body);
};


const fetchMaterialesAnalisis = async (id: number): Promise<Array<{
    productoId: number;
    producto: string;
    precioUnitario: number;
    stock: number;
    stockReservado: number;
    stockDisponible: number;
    cantidadCosteada: number;
    cantidadReal: number;
    diferencia: number;
    esExtra: boolean;
}>> => {
    return fetchClient(`${basePath}/${id}/materiales-analisis`, 'GET');
};

const fetchSuministrosAnalisis = async (id: number): Promise<Array<{
    productoId: number;
    producto: string;
    precioUnitario: number;
    stock: number;
    stockReservado: number;
    stockDisponible: number;
    cantidadCosteada: number;
    cantidadReal: number;
    diferencia: number;
    esExtra: boolean;
}>> => {
    return fetchClient(`${basePath}/${id}/suministros-analisis`, 'GET');
};

const fetchManoDeObraAnalisis = async (id: number): Promise<Array<{
    productoId: number;
    producto: string;
    precioUnitario: number;
    cantidadCosteada: number;
    cantidadReal: number;
    diferencia: number;
    esExtra: boolean;
}>> => {
    return fetchClient(`${basePath}/${id}/mano-de-obra-analisis`, 'GET');
};

const fetchProductosExtrasAnalisis = async (id: number): Promise<Array<{
    productoId: number;
    producto: string;
    precioUnitario: number;
    stock: number;
    stockReservado: number;
    stockDisponible: number;
    cantidadCosteada: number;
    cantidadReal: number;
    diferencia: number;
    esExtra: boolean;
}>> => {
    return fetchClient(`${basePath}/${id}/productos-extras-analisis`, 'GET');
};

export {
    fetch,
    listar,
    fetchById,
    create,
    edit,
    remove,
    fetchExcel,
    fetchPdf,
    verificarAlmacen,
    registrarFecha,
    confirmarEntrega,
    verificarServicio,
    certificar,
    fetchMaterialesAnalisis,
    fetchSuministrosAnalisis,
    fetchManoDeObraAnalisis,
    fetchProductosExtrasAnalisis
};
