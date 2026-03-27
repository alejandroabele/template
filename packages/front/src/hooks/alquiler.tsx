import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alquiler, Query } from '@/types';
import { fetch, fetchById, create, edit, remove, editPrecio, fetchExcel } from '@/services/alquileres';
import { useLoading } from './loading';

export const useGetAlquileresQuery = (query: Query) => {
    return useQuery({
        queryKey: ['alquileres', query],
        queryFn: () => fetch(query),
        select: (data) => {
            return data.map((item: Alquiler) => ({
                ...item,
                cliente: item.cliente?.nombre || null,
                codigo: item.alquilerRecurso?.codigo || null
            }));
        },
    });
};

export const useGetAlquilerByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['alquiler', id],
        queryFn: () => fetchById(id),
        enabled: !!id
    });
};

export const useCreateAlquilerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-alquiler'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquileres'] });
        },
        onError: (error) => {
            console.error('Error en la mutación:', error);
        }
    });
};

export const useEditAlquilerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-alquiler'],
        mutationFn: ({ id, data }: { id: number; data: Alquiler }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquileres'] });
        },
    });
};
export const useEditPrecioAlquilerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-alquiler'],
        mutationFn: ({ id, data }: { id: number; data: Alquiler }) => editPrecio(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquileres'] });
        },
    });
};

export const useDeleteAlquilerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-alquiler'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alquileres'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
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