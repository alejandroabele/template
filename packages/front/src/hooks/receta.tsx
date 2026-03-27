// src/hooks/RecetaHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Receta, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/receta';

export const useGetRecetasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['recetas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetRecetaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['receta', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateRecetaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-receta'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recetas'] });
        },
    });
};

export const useEditRecetaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-receta'],
        mutationFn: ({ id, data }: { id: number; data: Receta }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recetas'] });
        },
    });
};

export const useDeleteRecetaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-receta'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recetas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
