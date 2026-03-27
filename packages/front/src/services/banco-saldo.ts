import { BancoSaldo, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'banco-saldos'
const fetch = async (query: Query): Promise<BancoSaldo[]> => {
    return fetchClient<BancoSaldo[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchByBanco = async (bancoId: number): Promise<BancoSaldo[]> => {
    return fetchClient<BancoSaldo[]>(`${basePath}?bancoId=${bancoId}`, 'GET');
};

const fetchById = async (id: number): Promise<BancoSaldo> => {
    return fetchClient<BancoSaldo>(`${basePath}/${id}`, 'GET');
};

const create = async (body: BancoSaldo): Promise<BancoSaldo> => {
    return fetchClient<BancoSaldo>(basePath, 'POST', body);
};

const edit = async (id: number, body: BancoSaldo): Promise<BancoSaldo> => {
    return fetchClient<BancoSaldo>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const fetchUltimosSaldos = async (): Promise<{
    saldos: any[];
    total: number;
    disponible: number;
}> => {
    return fetchClient<{
        saldos: any[];
        total: number;
        disponible: number;
    }>(`${basePath}/ultimos-saldos`, 'GET');
};

const fetchSaldosPorFechas = async (fechas: string[]): Promise<Record<string, { saldos: any[]; total: number; disponible: number }>> => {
    return fetchClient<Record<string, { saldos: any[]; total: number; disponible: number }>>(
        `${basePath}/saldos-por-fechas?fechas=${encodeURIComponent(JSON.stringify(fechas))}`,
        'GET'
    );
};

const actualizarSaldosHoy = async (saldos: Array<{ bancoId: number; monto: number; descubiertoMonto: number }>): Promise<void> => {
    return fetchClient<void>(`${basePath}/actualizar-saldos-hoy`, 'POST', { saldos });
};

export {
    fetch,
    fetchByBanco,
    fetchById,
    create,
    edit,
    remove,
    fetchUltimosSaldos,
    fetchSaldosPorFechas,
    actualizarSaldosHoy
};