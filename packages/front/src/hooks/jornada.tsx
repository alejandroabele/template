import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Jornada, Query } from '@/types';
import { fetch, fetchById, create, edit, remove, cancelar, fetchMisAsignaciones, iniciarAsignacion, finalizarAsignacion, fetchEnCurso, fetchEstadisticas, fetchTrabajosOt, iniciarPorOt } from '@/services/jornada';

export const useGetJornadasQuery = (query: Query) => {
    return useQuery({
        queryKey: ['jornadas', query],
        queryFn: () => fetch(query),
    });
};

export const useGetJornadaByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['jornada', id],
        queryFn: () => fetchById(id),
    });
};

export const useCreateJornadaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-jornada'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jornadas'] });
        },
    });
};

export const useEditJornadaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-jornada'],
        mutationFn: ({ id, data }: { id: number; data: Jornada }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jornadas'] });
        },
    });
};

export const useDeleteJornadaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-jornada'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jornadas'] });
        },
        onError: (error) => {
            console.error('Error en eliminación:', error);
        },
    });
};

export const useCancelarJornadaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cancelar-jornada'],
        mutationFn: ({ id, motivo }: { id: number; motivo?: string }) => cancelar(id, motivo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jornadas'] });
        },
    });
};

export const useGetMisAsignacionesQuery = (dni: string, fecha?: string) => {
    return useQuery({
        queryKey: ['mis-asignaciones', dni, fecha],
        queryFn: () => fetchMisAsignaciones(dni, fecha),
        enabled: !!dni,
    });
};

export const useIniciarAsignacionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['iniciar-asignacion'],
        mutationFn: iniciarAsignacion,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['mis-asignaciones'] });
            queryClient.invalidateQueries({ queryKey: ['jornada-en-curso'] });
        },
    });
};

export const useFinalizarAsignacionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['finalizar-asignacion'],
        mutationFn: finalizarAsignacion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mis-asignaciones'] });
            queryClient.invalidateQueries({ queryKey: ['jornada-en-curso'] });
            queryClient.invalidateQueries({ queryKey: ['jornada-estadisticas'] });
        },
    });
};

export const useGetEnCursoQuery = () => {
    return useQuery({
        queryKey: ['jornada-en-curso'],
        queryFn: fetchEnCurso,
        refetchInterval: 30000,
    });
};

export const useGetEstadisticasJornadaQuery = (rango?: { desde?: string; hasta?: string }) => {
    return useQuery({
        queryKey: ['jornada-estadisticas', rango],
        queryFn: () => fetchEstadisticas(rango),
    });
};

export const useGetTrabajosOtQuery = (otId: number | null) => {
    return useQuery({
        queryKey: ['trabajos-ot', otId],
        queryFn: () => fetchTrabajosOt(otId!),
        enabled: !!otId,
        retry: false,
    });
};

export const useIniciarPorOtMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['iniciar-por-ot'],
        mutationFn: iniciarPorOt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mis-asignaciones'] });
        },
    });
};
