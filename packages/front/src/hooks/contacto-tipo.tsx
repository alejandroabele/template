import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactoTipo, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/contacto-tipo';

export const useGetContactoTiposQuery = (query: Query) => {
    return useQuery({
        queryKey: ['contacto-tipos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetContactoTipoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['contacto-tipo', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateContactoTipoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-contacto-tipo'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacto-tipos'] });
        },
    });
};

export const useEditContactoTipoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-contacto-tipo'],
        mutationFn: ({ id, data }: { id: number; data: ContactoTipo }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacto-tipos'] });
        },
    });
};

export const useDeleteContactoTipoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-contacto-tipo'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacto-tipos'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
