import { useQuery } from '@tanstack/react-query';
import { fetchFacturacionCobranza, fetchCantidadRecursosTipos, fetchCantidadRecursosEstado } from '@/services/reportes-alquileres';

export const useGetFacturacionCobranzaQuery = () => {
    return useQuery({
        queryKey: ['facturacion-cobranza',],
        queryFn: () => fetchFacturacionCobranza(),
    });
};
export const useGetCantidadRecursosTipoQuery = () => {
    return useQuery({
        queryKey: ['cantidad-recursos-tipo',],
        queryFn: () => fetchCantidadRecursosTipos(),
    });
};
export const useGetCantidadRecursosEstadoQuery = () => {
    return useQuery({
        queryKey: ['cantidad-recursos-estado',],
        queryFn: () => fetchCantidadRecursosEstado(),
    });
};