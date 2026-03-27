import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventarioSubcategoria, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/inventario-subcategorias';

export const useGetInventarioSubcategoriasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['inventario-subcategorias', query],
        queryFn: () => fetch(query),
    });
};

export const useGetInventarioSubcategoriaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['inventario-subcategoria', id],
        queryFn: () => fetchById(id),
        enabled: !!id,
    });
};

export const useCreateInventarioSubcategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-inventario-subcategoria'],
        mutationFn: (data: InventarioSubcategoria) => create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-subcategorias'] });
        },
    });
};

export const useEditInventarioSubcategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-inventario-subcategoria'],
        mutationFn: ({ id, data }: { id: number; data: InventarioSubcategoria }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-subcategorias'] });
        },
    });
};

export const useDeleteInventarioSubcategoriaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-inventario-subcategoria'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventario-subcategorias'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
