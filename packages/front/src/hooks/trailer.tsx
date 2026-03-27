import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/trailer';

export const useGetTrailersQuery = (query: Query) => {
    return useQuery({
        queryKey: ['trailers', query],
        queryFn: () => fetch(query),
    });
};

export const useGetTrailerByIdQuery = (id: string | number) => {
    return useQuery({
        queryKey: ['trailer', id],
        queryFn: () => fetchById(Number(id)),
        enabled: Boolean(id),
    });
};

export const useCreateTrailerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-trailer'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trailers'] });
        },
    });
};

export const useEditTrailerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-trailer'],
        mutationFn: ({ id, data }: { id: number; data: any }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trailers'] });
        },
    });
};

export const useDeleteTrailerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-trailer'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trailers'] });
        },
    });
};
