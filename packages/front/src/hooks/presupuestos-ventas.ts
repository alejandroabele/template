import { useQuery } from "@tanstack/react-query";
import { fetchVentasSemanales, fetchVentasPorCliente } from '@/services/reportes-presupuestos';

export const useGetVentasSemanalesQuery = (anio: number, mes: number) => {
    return useQuery({
        queryKey: ['ventas-semanales', anio, mes],
        queryFn: () => fetchVentasSemanales(anio, mes),
        enabled: !!(anio && mes),
    });
};

export const useGetVentasPorClienteQuery = (anio: number, mes: number, semana: number) => {
    return useQuery({
        queryKey: ['ventas-por-cliente', anio, mes, semana],
        queryFn: () => fetchVentasPorCliente(anio, mes, semana),
        enabled: !!(anio && mes && semana),
    });
};
