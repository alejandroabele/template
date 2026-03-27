import { ReporteFacturacionCobranza, ReporteCantidadRecursosTipos, ReporteCantidadRecursosEstado } from '@/types';
import fetchClient from '@/lib/api-client';
const basePath = 'alquiler'
const fetchFacturacionCobranza = async (): Promise<ReporteFacturacionCobranza[]> => {
    return fetchClient<ReporteFacturacionCobranza[]>(`${basePath}/facturacion-cobranza`, 'GET');
};

const fetchCantidadRecursosTipos = async (): Promise<ReporteCantidadRecursosTipos[]> => {
    return fetchClient<ReporteCantidadRecursosTipos[]>(`${basePath}/cantidad-recursos-tipo`, 'GET');
};

const fetchCantidadRecursosEstado = async (): Promise<ReporteCantidadRecursosEstado[]> => {
    return fetchClient<ReporteCantidadRecursosEstado[]>(`${basePath}/cantidad-recursos-estado`, 'GET');
};

export {
    fetchFacturacionCobranza,
    fetchCantidadRecursosTipos,
    fetchCantidadRecursosEstado
};
