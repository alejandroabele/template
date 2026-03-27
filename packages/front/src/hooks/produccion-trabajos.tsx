// src/hooks/ProduccionTrabajoHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProduccionTrabajo, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/produccion-trabajo';

export const useGetProduccionTrabajosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['produccion-trabajos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetProduccionTrabajoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['produccion-trabajo', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateProduccionTrabajoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-produccion-trabajo'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produccion-trabajos'] });
        },
    });
};

export const useEditProduccionTrabajoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-produccion-trabajo'],
        mutationFn: ({ id, data }: { id: number; data: ProduccionTrabajo }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produccion-trabajos'] });
        },
    });
};

export const useDeleteProduccionTrabajoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-produccion-trabajo'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produccion-trabajos'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};

