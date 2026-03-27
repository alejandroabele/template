import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Factura, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/factura';

export const useGetFacturasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['facturas', query],
        queryFn: () => fetch(query),
        select: (data) => {
            return data.map((item: Factura) => ({
                ...item
            }));
        },
    });
};

export const useGetFacturaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['factura', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id),
    });
};

export const useCreateFacturaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-factura'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
    });
};

export const useEditFacturaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-factura'],
        mutationFn: ({ id, data }: { id: number; data: Factura }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
    });
};

export const useDeleteFacturaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-factura'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['presupuesto'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
