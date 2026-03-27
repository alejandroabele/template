import { useQuery } from "@tanstack/react-query";
import {
    fetchTotalesPeriodo,
    fetchEvolucionIngresosEgresos,
    fetchEvolucionSaldo,
    fetchProyeccion,
    type TotalesPeriodo,
    type EvolucionData,
    type SaldoAcumuladoData,
    type DeudasData,
} from "@/services/cashflow-transaccion";

export const useGetTotalesPeriodo = (
    fechaInicio: string,
    fechaFin: string,
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
) => {
    return useQuery<TotalesPeriodo>({
        queryKey: ["cashflow-totales-periodo", fechaInicio, fechaFin, categoriasIngreso, categoriasEgreso],
        queryFn: () => fetchTotalesPeriodo(fechaInicio, fechaFin, categoriasIngreso, categoriasEgreso),
        enabled: Boolean(fechaInicio && fechaFin),
    });
};

export const useGetEvolucionIngresosEgresos = (
    fechaInicio: string,
    fechaFin: string,
    modo: 'dia' | 'mes',
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
) => {
    return useQuery<EvolucionData[]>({
        queryKey: ["cashflow-evolucion-ingresos-egresos", fechaInicio, fechaFin, modo, categoriasIngreso, categoriasEgreso],
        queryFn: () => fetchEvolucionIngresosEgresos(fechaInicio, fechaFin, modo, categoriasIngreso, categoriasEgreso),
        enabled: Boolean(fechaInicio && fechaFin && modo),
    });
};

export const useGetProyeccion = (tipo: 'ingreso' | 'egreso', fechaInicio?: string, fechaFin?: string) => {
    return useQuery<DeudasData>({
        queryKey: ["cashflow-proyeccion", tipo, fechaInicio, fechaFin],
        queryFn: () => fetchProyeccion(tipo, fechaInicio, fechaFin),
    });
};

export const useGetEvolucionSaldoAcumulado = (
    fechaInicio: string,
    fechaFin: string,
    modo: 'dia' | 'mes',
    categoriasIngreso?: string[],
    categoriasEgreso?: string[]
) => {
    return useQuery<SaldoAcumuladoData[]>({
        queryKey: ["cashflow-evolucion-saldo", fechaInicio, fechaFin, modo, categoriasIngreso, categoriasEgreso],
        queryFn: () => fetchEvolucionSaldo(fechaInicio, fechaFin, modo, categoriasIngreso, categoriasEgreso),
        enabled: Boolean(fechaInicio && fechaFin && modo),
    });
};