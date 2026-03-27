// src/hooks/AlquilerMantenimientoHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlquilerMantenimiento, Query, } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/alquileres-mantenimiento';

export const useGetAlquilerMantenimientosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['alquiler-mantenimientos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetAlquilerMantenimientoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['alquiler-mantenimiento', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id),
    });
};

export const useCreateAlquilerMantenimientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-alquiler-facturacion'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-mantenimientos'] });
        },
    });
};

export const useEditAlquilerMantenimientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-alquiler-mantenimiento'],
        mutationFn: ({ id, data }: { id: number; data: AlquilerMantenimiento }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-mantenimientos'] });
        },
    });
};

export const useDeleteAlquilerMantenimientoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-alquiler-mantenimiento'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-mantenimientos'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
