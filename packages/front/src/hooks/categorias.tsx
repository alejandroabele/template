import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Categoria, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/categorias';

export const useGetCategoriasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['categorias', query],
        queryFn: () => fetch(query),
    });
};

export const useGetCategoriaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['categoria', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateCategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-categoria'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });
};

export const useEditCategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-categoria'],
        mutationFn: ({ id, data }: { id: number; data: Categoria }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
    });
};

export const useDeleteCategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-categoria'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
