// src/hooks/presupuesto-produccionHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PresupuestoProduccion, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/presupuesto-produccion';

export const useGetPresupuestoProduccionsQuery = (query: Query) => {
    return useQuery({
        queryKey: ['presupuesto-produccions', query],
        queryFn: () => fetch(query),
    });
};

export const useGetPresupuestoProduccionByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['presupuesto-leido', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreatePresupuestoProduccionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-presupuesto-leido'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-produccions'] });
        },
    });
};

export const useEditPresupuestoProduccionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-presupuesto-produccion'],
        mutationFn: ({ id, data }: { id: number; data: PresupuestoProduccion }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-produccions'] });
        },
    });
};

export const useDeletePresupuestoProduccionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-presupuesto-produccion'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-produccions'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
