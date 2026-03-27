// src/hooks/provedoreHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Proveedor, Query } from '@/types';
import { fetch, fetchById, create, edit, remove, fetchExcel } from '@/services/proveedores';
import { useLoading } from './loading';
import { } from '@/services/presupuesto';

export const useGetProveedorsQuery = (query: Query) => {
    return useQuery({
        queryKey: ['provedores', query],
        queryFn: () => fetch(query),
    });
};

export const useGetProveedorByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['provedore', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateProveedorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-provedore'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores'] });
        },
    });
};

export const useEditProveedorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-provedore'],
        mutationFn: ({ id, data }: { id: number; data: Proveedor }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores'] });
        },
    });
};

export const useDeleteProveedorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-provedore'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provedores'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};
export const useDownloadProveedorExcel = () => {
    const { showLoading, hideLoading } = useLoading()

    return useMutation({
        mutationFn: async (query: Query) => {
            showLoading()
            const data = await fetchExcel(query); // Llama a la función de descarga con el query
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'proveedores.xlsx'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
            // Manejo de errores
            console.error('Error al descargar el archivo', error);
        },
        onSettled: () => {
            hideLoading();
        }
    });
};