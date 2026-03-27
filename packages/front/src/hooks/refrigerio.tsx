import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRefrigeriosEnCurso, fetchRefrigerioActivo, fetchRefrigerioEstadisticas, iniciarRefrigerio, finalizarRefrigerio } from '@/services/refrigerio';

export const useGetRefrigerioActivoQuery = (personaId: number) => {
    return useQuery({
        queryKey: ['refrigerio-activo', personaId],
        queryFn: () => fetchRefrigerioActivo(personaId),
        enabled: !!personaId,
        refetchInterval: 30000,
    });
};

export const useIniciarRefrigerioMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['iniciar-refrigerio'],
        mutationFn: (personaId: number) => iniciarRefrigerio(personaId),
        onSuccess: (_, personaId) => {
            queryClient.invalidateQueries({ queryKey: ['refrigerio-activo', personaId] });
            queryClient.invalidateQueries({ queryKey: ['refrigerios-en-curso'] });
        },
    });
};

export const useFinalizarRefrigerioMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['finalizar-refrigerio'],
        mutationFn: ({ id, personaId }: { id: number; personaId: number }) => finalizarRefrigerio(id),
        onSuccess: (_, { personaId }) => {
            queryClient.invalidateQueries({ queryKey: ['refrigerio-activo', personaId] });
            queryClient.invalidateQueries({ queryKey: ['refrigerios-en-curso'] });
        },
    });
};

export const useGetRefrigeriosEnCursoQuery = () => {
    return useQuery({
        queryKey: ['refrigerios-en-curso'],
        queryFn: fetchRefrigeriosEnCurso,
        refetchInterval: 30000,
    });
};

export const useGetRefrigerioEstadisticasQuery = (rango?: { desde?: string; hasta?: string }) => {
    return useQuery({
        queryKey: ['refrigerio-estadisticas', rango],
        queryFn: () => fetchRefrigerioEstadisticas(rango),
    });
};
