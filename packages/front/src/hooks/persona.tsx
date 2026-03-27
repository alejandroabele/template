import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Persona, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/personas';

export const useGetPersonasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['personas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetPersonaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['persona', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreatePersonaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-persona'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personas'] });
        },
    });
};

export const useEditPersonaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-persona'],
        mutationFn: ({ id, data }: { id: number; data: Persona }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personas'] });
        },
    });
};

export const useDeletePersonaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-persona'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
