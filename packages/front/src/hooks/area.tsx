// src/hooks/areaHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Area, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/areas';

export const useGetAreasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['areas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetAreaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['area', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateAreaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-area'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['areas'] });
        },
    });
};

export const useEditAreaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-area'],
        mutationFn: ({ id, data }: { id: number; data: Area }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['areas'] });
        },
    });
};

export const useDeleteAreaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-area'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['areas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
