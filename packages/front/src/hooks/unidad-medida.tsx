// src/hooks/unidad-medidaHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UnidadMedida, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/unidades-medida';

export const useGetUnidadMedidasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['unidad-medidas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetUnidadMedidaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['unidad-medida', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateUnidadMedidaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-unidad-medida'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unidad-medidas'] });
        },
    });
};

export const useEditUnidadMedidaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-unidad-medida'],
        mutationFn: ({ id, data }: { id: number; data: UnidadMedida }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unidad-medidas'] });
        },
    });
};

export const useDeleteUnidadMedidaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-unidad-medida'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unidad-medidas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
