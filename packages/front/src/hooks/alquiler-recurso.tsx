// src/hooks/AlquilerRecursoHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlquilerRecurso, Query } from '@/types';
import { fetch, fetchById, create, edit, remove, fetchExcel } from '@/services/alquiler-recurso';
import { useLoading } from './loading';

export const useGetAlquilerRecursosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['alquiler-recursos', query],
        queryFn: () => fetch(query),
    });
};

export const useGetAlquilerRecursoByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['alquiler-recurso', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id)
    });
};

export const useCreateAlquilerRecursoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-alquiler-recurso'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-recursos'] });
        },
    });
};

export const useEditAlquilerRecursoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-alquiler-recurso'],
        mutationFn: ({ id, data }: { id: number; data: AlquilerRecurso }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquiler-recursos'] });
        },
    });
};

export const useDeleteAlquilerRecursoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-alquiler-recurso'],
        mutationFn: remove,
        onSuccess: () => {
            // TODO: Agregar aca todas las invalidaciones
            queryClient.invalidateQueries({ queryKey: ['alquiler-recursos'] });
            queryClient.invalidateQueries({ queryKey: ['alquiler-facturacions'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};



export const useGetCartelesMapaQuery = () => {
    return useQuery({
        queryKey: ['alquiler-recursos-carteles-mapa'],
        queryFn: () => fetch({
            pagination: { pageIndex: 0, pageSize: 1000 },
            columnFilters: [{ id: 'tipo', value: 'CARTELES' }],
        } as Query),
    });
};

export const useDownloadAlquilerRecursosExcel = () => {
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
            a.download = 'alquiler_recursos.xlsx'; // Nombre del archivo descargado
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