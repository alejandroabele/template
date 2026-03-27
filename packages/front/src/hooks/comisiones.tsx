import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comision, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/comisiones';

export const useGetComisionsQuery = (query: Query) => {
    return useQuery({
        queryKey: ['comisiones', query],
        queryFn: () => fetch(query),
    });
};

export const useGetComisionByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['comision', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateComisionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-comision'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comisiones'] });
        },
    });
};

export const useEditComisionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-comision'],
        mutationFn: ({ id, data }: { id: number; data: Comision }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comisiones'] });
        },
    });
};

export const useDeleteComisionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-comision'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comisiones'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
