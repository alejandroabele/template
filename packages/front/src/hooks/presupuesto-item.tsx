// src/hooks/presupuesto-itemHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PresupuestoItem, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/presupuesto-item';

export const useGetPresupuestoItemsQuery = (query: Query) => {
    return useQuery({
        queryKey: ['presupuesto-items', query],
        queryFn: () => fetch(query),
        refetchInterval: 30000
    });
};

export const useGetPresupuestoItemByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['presupuesto', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreatePresupuestoItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-presupuesto'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-items'] });
        },
    });
};

export const useEditPresupuestoItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-presupuesto-item'],
        mutationFn: ({ id, data }: { id: number; data: PresupuestoItem }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-items'] });
        },
    });
};

export const useDeletePresupuestoItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-presupuesto-item'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-items'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};



