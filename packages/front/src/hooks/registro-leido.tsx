import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    marcarComoLeido,
    verificarLectura,
    obtenerListaLeidos,
    obtenerFechaLectura
} from '@/services/registro-leido';

export const useMarcarRegistroLeidoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['marcar-registro-leido'],
        mutationFn: ({ modelo, modeloId }: { modelo: string; modeloId: number }) =>
            marcarComoLeido(modelo, modeloId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['verificar-lectura', variables.modelo, variables.modeloId] });
            queryClient.invalidateQueries({ queryKey: ['lista-leidos', variables.modelo] });
            queryClient.invalidateQueries({ queryKey: ['fecha-lectura', variables.modelo, variables.modeloId] });
        },
    });
};

export const useVerificarLecturaQuery = (modelo: string, modeloId: number, enabled = true) => {
    return useQuery({
        queryKey: ['verificar-lectura', modelo, modeloId],
        queryFn: () => verificarLectura(modelo, modeloId),
        enabled: enabled && !!modelo && !!modeloId,
    });
};

export const useObtenerListaLeidosQuery = (modelo: string, enabled = true) => {
    return useQuery({
        queryKey: ['lista-leidos', modelo],
        queryFn: () => obtenerListaLeidos(modelo),
        enabled: enabled && !!modelo,
    });
};

export const useObtenerFechaLecturaQuery = (modelo: string, modeloId: number, enabled = true) => {
    return useQuery({
        queryKey: ['fecha-lectura', modelo, modeloId],
        queryFn: () => obtenerFechaLectura(modelo, modeloId),
        enabled: enabled && !!modelo && !!modeloId,
    });
};
