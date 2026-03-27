// src/hooks/IndiceHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Indice, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/indice';

export const useGetIndicesQuery = (query: Query) => {
    return useQuery({
        queryKey: ['indices', query],
        queryFn: () => fetch(query),
    });
};

export const useGetIndiceByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['indice', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateIndiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-indice'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['indices'] });
        },
    });
};

export const useEditIndiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-indice'],
        mutationFn: ({ id, data }: { id: number; data: Indice }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['indices'] });
        },
    });
};

export const useDeleteIndiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-indice'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['indices'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
