// src/hooks/proceso-generalHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProcesoGeneral, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/proceso-general';

export const useGetProcesoGeneralQuery = (query: Query) => {
    return useQuery({
        queryKey: ['proceso-general', query],
        queryFn: () => fetch(query),
    });
};

export const useGetProcesoGeneralByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['proceso-general', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateProcesoGeneralMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-proceso-general'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proceso-general'] });
        },
    });
};

export const useEditProcesoGeneralMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-proceso-general'],
        mutationFn: ({ id, data }: { id: number; data: ProcesoGeneral }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proceso-general'] });
        },
    });
};

export const useDeleteProcesoGeneralMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-proceso-general'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proceso-general'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
