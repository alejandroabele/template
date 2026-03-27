// src/hooks/presupuesto-leidoHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PresupuestoLeido, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/presupuesto-leido';

export const useGetPresupuestoLeidosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['presupuesto-leidos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetPresupuestoLeidoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['presupuesto-leido', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreatePresupuestoLeidoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-presupuesto-leido'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-leidos'] });
        },
    });
};

export const useEditPresupuestoLeidoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-presupuesto-leido'],
        mutationFn: ({ id, data }: { id: number; data: PresupuestoLeido }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-leidos'] });
        },
    });
};

export const useDeletePresupuestoLeidoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-presupuesto-leido'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuesto-leidos'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
