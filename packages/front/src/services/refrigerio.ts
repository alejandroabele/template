import { Refrigerio } from '@/types';
import fetchClient from '@/lib/api-client';

const basePath = 'refrigerio';

const fetchRefrigeriosEnCurso = async (): Promise<Refrigerio[]> => {
    return fetchClient<Refrigerio[]>(`${basePath}/en-curso`, 'GET');
};

const fetchRefrigerioActivo = async (personaId: number): Promise<Refrigerio | null> => {
    return fetchClient<Refrigerio | null>(`${basePath}/activo?personaId=${personaId}`, 'GET');
};

const fetchRefrigerioHistorial = async (personaId: number, fecha?: string): Promise<Refrigerio[]> => {
    const params = new URLSearchParams({ personaId: String(personaId) });
    if (fecha) params.append('fecha', fecha);
    return fetchClient<Refrigerio[]>(`${basePath}?${params.toString()}`, 'GET');
};

const fetchRefrigerioEstadisticas = async (rango?: { desde?: string; hasta?: string }): Promise<Refrigerio[]> => {
    const params = new URLSearchParams();
    if (rango?.desde) params.append('desde', rango.desde);
    if (rango?.hasta) params.append('hasta', rango.hasta);
    const query = params.toString();
    return fetchClient<Refrigerio[]>(`${basePath}/estadisticas${query ? `?${query}` : ''}`, 'GET');
};

const iniciarRefrigerio = async (personaId: number): Promise<Refrigerio> => {
    return fetchClient<Refrigerio>(`${basePath}/iniciar`, 'POST', { personaId });
};

const finalizarRefrigerio = async (id: number): Promise<Refrigerio> => {
    return fetchClient<Refrigerio>(`${basePath}/${id}/finalizar`, 'PATCH');
};

export {
    fetchRefrigeriosEnCurso,
    fetchRefrigerioActivo,
    fetchRefrigerioHistorial,
    fetchRefrigerioEstadisticas,
    iniciarRefrigerio,
    finalizarRefrigerio,
};
