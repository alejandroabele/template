import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/cartel';

export const useGetCartelesQuery = (query: Query) => {
    return useQuery({
        queryKey: ['carteles', query],
        queryFn: () => fetch(query),
    });
};

export const useGetCartelByIdQuery = (id: string | number) => {
    return useQuery({
        queryKey: ['cartel', id],
        queryFn: () => fetchById(Number(id)),
        enabled: Boolean(id),
    });
};

export const useCreateCartelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-cartel'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['carteles'] });
        },
    });
};

export const useEditCartelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-cartel'],
        mutationFn: ({ id, data }: { id: number; data: any }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['carteles'] });
        },
    });
};

export const useDeleteCartelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-cartel'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['carteles'] });
        },
    });
};

export const useGetCartelesMapaQuery = () => {
    return useQuery({
        queryKey: ['carteles-mapa'],
        queryFn: () => fetch({
            pagination: { pageIndex: 0, pageSize: 1000 },
            columnFilters: [{ id: 'tipo', value: 'CARTELES' }],
        } as Query),
    });
};
