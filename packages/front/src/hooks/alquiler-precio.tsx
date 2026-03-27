// src/hooks/AlquilerPrecioHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlquilerPrecio, Query, } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/alquileres-precio';

export const useGetAlquilerPreciosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['alquiler-precios', query],
        queryFn: () => fetch(query),
        select: (data) => {
            return data.map((item: AlquilerPrecio) => ({
                ...item,
                cliente: item.cliente?.nombre || null,
            }));
        },
    });
};

export const useGetAlquilerPrecioByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['alquiler-precio', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateAlquilerPrecioMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-alquiler-precio'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-precios'] });
        },
    });
};

export const useEditAlquilerPrecioMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-alquiler-precio'],
        mutationFn: ({ id, data }: { id: number; data: AlquilerPrecio }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-precios'] });
        },
    });
};

export const useDeleteAlquilerPrecioMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-alquiler-precio'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-precios'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
