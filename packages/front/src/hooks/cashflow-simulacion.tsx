"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CashflowSimulacion, CashflowSimulacionTransaccion, Query } from "@/types";
import {
    fetchAll,
    fetchById,
    create,
    edit,
    remove,
    createTransaccion,
    editTransaccion,
    removeTransaccion,
    fetchBusqueda,
    fetchResumenSemana,
    fetchResumenMes,
    fetchResumenTrimestre,
    fetchResumenSemanaMes,
    fetchColumnas,
} from "@/services/cashflow-simulacion";
import type { ColumnasResponse } from "@/services/cashflow-transaccion";

// ========== GESTIÓN DE SIMULACIONES ==========

export const useGetSimulaciones = (query?: Query) => {
    return useQuery<CashflowSimulacion[]>({
        queryKey: ["cashflow-simulaciones", query],
        queryFn: () => fetchAll(query),
    });
};

export const useGetSimulacion = (id: number) => {
    return useQuery<CashflowSimulacion>({
        queryKey: ["cashflow-simulacion", id],
        queryFn: () => fetchById(id),
        enabled: !!id,
    });
};

export const useCreateSimulacion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-cashflow-simulacion"],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulaciones"] });
        },
    });
};

export const useEditSimulacion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["edit-cashflow-simulacion"],
        mutationFn: ({ id, data }: { id: number; data: Partial<Pick<CashflowSimulacion, 'nombre' | 'descripcion'>> }) =>
            edit(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulaciones"] });
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulacion", data.id] });
        },
    });
};

export const useRemoveSimulacion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["remove-cashflow-simulacion"],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulaciones"] });
        },
    });
};

export const useSearchSimulacionTransaccionesQuery = (simulacionId: number, query: Query, enabled: boolean) => {
    return useQuery<CashflowSimulacionTransaccion[]>({
        queryKey: ["cashflow-simulacion-busqueda", simulacionId, query],
        queryFn: () => fetchBusqueda(simulacionId, query),
        enabled: !!simulacionId && enabled,
    });
};

// ========== MUTACIONES DE TRANSACCIONES ==========

export const useCreateTransaccionSimulacion = (simulacionId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-cashflow-simulacion-transaccion", simulacionId],
        mutationFn: (data: Omit<CashflowSimulacionTransaccion, 'id' | 'simulacionId'>) =>
            createTransaccion(simulacionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulacion-resumen", simulacionId] });
        },
    });
};

export const useEditTransaccionSimulacion = (simulacionId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["edit-cashflow-simulacion-transaccion", simulacionId],
        mutationFn: ({ id, data }: { id: number; data: Partial<CashflowSimulacionTransaccion> }) =>
            editTransaccion(simulacionId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulacion-resumen", simulacionId] });
        },
    });
};

export const useRemoveTransaccionSimulacion = (simulacionId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["remove-cashflow-simulacion-transaccion", simulacionId],
        mutationFn: (id: number) => removeTransaccion(simulacionId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashflow-simulacion-resumen", simulacionId] });
        },
    });
};

// ========== RESÚMENES ==========

export const useGetResumenSemanaSimulacion = (simulacionId: number, from: string, to: string) => {
    return useQuery({
        queryKey: ["cashflow-simulacion-resumen", simulacionId, "semana", from, to],
        queryFn: () => fetchResumenSemana(simulacionId, from, to),
        enabled: Boolean(simulacionId && from && to),
    });
};

export const useGetResumenMesSimulacion = (simulacionId: number, from: string, to: string) => {
    return useQuery({
        queryKey: ["cashflow-simulacion-resumen", simulacionId, "mes", from, to],
        queryFn: () => fetchResumenMes(simulacionId, from, to),
        enabled: Boolean(simulacionId && from && to),
    });
};

export const useGetResumenTrimestreSimulacion = (simulacionId: number, year: number) => {
    return useQuery({
        queryKey: ["cashflow-simulacion-resumen", simulacionId, "trimestre", year],
        queryFn: () => fetchResumenTrimestre(simulacionId, year),
        enabled: Boolean(simulacionId && year),
    });
};

export const useGetResumenSemanaMesSimulacion = (simulacionId: number, year: number, month: number) => {
    return useQuery({
        queryKey: ["cashflow-simulacion-resumen", simulacionId, "semana-mes", year, month],
        queryFn: () => fetchResumenSemanaMes(simulacionId, year, month),
        enabled: Boolean(simulacionId && year && month),
    });
};

export const useGetColumnasSimulacion = (
    simulacionId: number,
    vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
    params: { from?: string; year?: number; month?: number },
) => {
    return useQuery<ColumnasResponse>({
        queryKey: ["cashflow-simulacion-columnas", simulacionId, vista, params],
        queryFn: () => fetchColumnas(simulacionId, vista, params),
        enabled: Boolean(simulacionId && vista),
    });
};
