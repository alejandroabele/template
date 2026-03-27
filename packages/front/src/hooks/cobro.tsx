import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cobro, Query } from '@/types';
import { fetch, fetchById, create, edit, remove, createMasivo, CobroMasivoRequest } from '@/services/cobro';

export const useGetCobrosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['cobros', query],
        queryFn: () => fetch(query),
        select: (data) => {
            return data.map((item: Cobro) => ({
                ...item
            }));
        },
    });
};

export const useGetCobroByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['cobro', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id),
    });
};

export const useCreateCobroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-cobro'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cobros'] });
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
    });
};

export const useEditCobroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-cobro'],
        mutationFn: ({ id, data }: { id: number; data: Cobro }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cobros'] });
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
    });
};

export const useDeleteCobroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-cobro'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cobros'] });
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};

export const useCreateCobroMasivoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-cobro-masivo'],
        mutationFn: createMasivo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cobros'] });
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
            queryClient.invalidateQueries({ queryKey: ['transacciones'] });
        },
    });
};
