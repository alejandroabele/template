import { ReporteEstadoConsumoContrato, ReporteOrdenesPorTipo } from '@/types';
import fetchClient from '@/lib/api-client';

const basePath = 'contrato-marco/reportes';

const fetchEstadoConsumo = async (id: number): Promise<ReporteEstadoConsumoContrato> => {
    return fetchClient<ReporteEstadoConsumoContrato>(`${basePath}/estado-consumo/${id}`, 'GET');
};


const fetchOrdenesPorTipo = async (id: number): Promise<ReporteOrdenesPorTipo[]> => {
    return fetchClient<ReporteOrdenesPorTipo[]>(`${basePath}/ordenes-tipo/${id}`, 'GET');
};

export {
    fetchEstadoConsumo,
    fetchOrdenesPorTipo
};
