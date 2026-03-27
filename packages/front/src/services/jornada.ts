import { Jornada, JornadaPersona, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'jornada'

const fetch = async (query: Query): Promise<Jornada[]> => {
    return fetchClient<Jornada[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Jornada> => {
    return fetchClient<Jornada>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Jornada): Promise<Jornada> => {
    return fetchClient<Jornada>(basePath, 'POST', body);
};

const edit = async (id: number, body: Jornada): Promise<Jornada> => {
    return fetchClient<Jornada>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const cancelar = async (id: number, motivo?: string): Promise<Jornada> => {
    return fetchClient<Jornada>(`${basePath}/${id}/cancelar`, 'PATCH', { motivo });
};

const updateFlota = async (jornadaId: number, flotaIds: number[]): Promise<Jornada> => {
    return fetchClient<Jornada>(`${basePath}/${jornadaId}/flota`, 'PATCH', { equipamientoIds: flotaIds });
};

const fetchMisAsignaciones = async (dni: string, fecha?: string): Promise<JornadaPersona[]> => {
    const params = new URLSearchParams({ dni });
    if (fecha) params.append('fecha', fecha);
    return fetchClient<JornadaPersona[]>(`${basePath}/mis-asignaciones?${params.toString()}`, 'GET');
};

const iniciarAsignacion = async (id: number): Promise<JornadaPersona> => {
    return fetchClient<JornadaPersona>(`${basePath}/persona/${id}/iniciar`, 'PATCH');
};

const finalizarAsignacion = async (id: number): Promise<JornadaPersona> => {
    return fetchClient<JornadaPersona>(`${basePath}/persona/${id}/finalizar`, 'PATCH');
};

const fetchEnCurso = async (): Promise<JornadaPersona[]> => {
    return fetchClient<JornadaPersona[]>(`${basePath}/en-curso`, 'GET');
};

const fetchEstadisticas = async (rango?: { desde?: string; hasta?: string }): Promise<JornadaPersona[]> => {
    const params = new URLSearchParams();
    if (rango?.desde) params.append('desde', rango.desde);
    if (rango?.hasta) params.append('hasta', rango.hasta);
    const query = params.toString();
    return fetchClient<JornadaPersona[]>(`${basePath}/estadisticas${query ? `?${query}` : ''}`, 'GET');
};

const fetchTrabajosOt = async (otId: number) => {
    return fetchClient<{ presupuesto: any; trabajos: any[] }>(`${basePath}/ot/${otId}/trabajos`, 'GET');
};

const iniciarPorOt = async (data: { otId: number; produccionTrabajoId: number; personaDni: string }): Promise<JornadaPersona> => {
    return fetchClient<JornadaPersona>(`${basePath}/iniciar-por-ot`, 'POST', data);
};

export {
    fetch,
    fetchById,
    create,
    edit,
    remove,
    cancelar,
    updateFlota,
    fetchMisAsignaciones,
    iniciarAsignacion,
    finalizarAsignacion,
    fetchEnCurso,
    fetchEstadisticas,
    fetchTrabajosOt,
    iniciarPorOt,
};
