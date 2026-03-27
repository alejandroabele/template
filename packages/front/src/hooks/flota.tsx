import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flota, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/flota';

export const useGetFlotasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['flotas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetFlotaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['flota', id],
        queryFn: () => fetchById(id),
        enabled: !!id,
    });
};

export const useCreateFlotaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-flota'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flotas'] });
        },
    });
};

export const useEditFlotaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-flota'],
        mutationFn: ({ id, data }: { id: number; data: Partial<Flota> }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flotas'] });
        },
    });
};

export const useDeleteFlotaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-flota'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flotas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
