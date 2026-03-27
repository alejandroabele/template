import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Equipamiento, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/equipamiento';

export const useGetEquipamientosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['equipamientos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetEquipamientoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['equipamiento', id],
        queryFn: () => fetchById(id),
        enabled: !!id,
    });
};

export const useCreateEquipamientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-equipamiento'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipamientos'] });
        },
    });
};

export const useEditEquipamientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-equipamiento'],
        mutationFn: ({ id, data }: { id: number; data: Partial<Equipamiento> }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipamientos'] });
        },
    });
};

export const useDeleteEquipamientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-equipamiento'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipamientos'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
