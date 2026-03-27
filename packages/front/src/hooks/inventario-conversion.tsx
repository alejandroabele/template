// src/hooks/inventario-conversionHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventarioConversion, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/inventario-conversion';

export const useGetInventarioConversionsQuery = (query: Query) => {
    return useQuery({
        queryKey: ['inventario-conversions', query],
        queryFn: () => fetch(query),
    });
};

export const useGetInventarioConversionByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['inventario-conversion', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id)
    });
};

export const useCreateInventarioConversionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-inventario-conversion'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-conversions'] });
        },
    });
};

export const useEditInventarioConversionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-inventario-conversion'],
        mutationFn: ({ id, data }: { id: number; data: InventarioConversion }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-conversions'] });
        },
    });
};

export const useDeleteInventarioConversionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-inventario-conversion'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-conversions'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
