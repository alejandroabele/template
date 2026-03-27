// src/hooks/provedoreHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProveedorRubro, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/proveedores-rubro';

export const useGetProveedorRubrosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['provedores-rubro', query],
        queryFn: () => fetch(query),
    });
};

export const useGetProveedorRubroByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['provedore-rubro', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateProveedorRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-provedore-rubro'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores-rubro'] });
        },
    });
};

export const useEditProveedorRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-provedore-rubro'],
        mutationFn: ({ id, data }: { id: number; data: ProveedorRubro }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores-rubro'] });
        },
    });
};

export const useDeleteProveedorRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-provedore-rubro'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores-rubro'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
