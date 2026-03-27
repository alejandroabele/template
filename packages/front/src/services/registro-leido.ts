import fetchClient from '@/lib/api-client';

const basePath = 'registro-leido';

export const marcarComoLeido = async (modelo: string, modeloId: number): Promise<{ success: boolean }> => {
    return fetchClient<{ success: boolean }>(basePath, 'POST', { modelo, modeloId });
};

export const verificarLectura = async (modelo: string, modeloId: number): Promise<{ leido: boolean }> => {
    return fetchClient<{ leido: boolean }>(`${basePath}/verificar?modelo=${modelo}&modeloId=${modeloId}`, 'GET');
};

export const obtenerListaLeidos = async (modelo: string): Promise<{ ids: number[] }> => {
    return fetchClient<{ ids: number[] }>(`${basePath}/lista?modelo=${modelo}`, 'GET');
};

export const obtenerFechaLectura = async (modelo: string, modeloId: number): Promise<{ fecha: string | null }> => {
    return fetchClient<{ fecha: string | null }>(`${basePath}/fecha?modelo=${modelo}&modeloId=${modeloId}`, 'GET');
};
