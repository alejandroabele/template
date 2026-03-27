import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from '@/types';
import {
    getHerramientas,
    getHerramienta,
    getHistorial,
    getPrestamosActivos,
    registrarMovimiento,
} from '@/services/herramienta';

export const useHerramientas = (query: Query, options = {}) => {
    return useQuery({
        queryKey: ['herramientas', query],
        queryFn: () => getHerramientas(query),
        ...options,
    });
};

export const useHerramienta = (id: number) => {
    return useQuery({
        queryKey: ['herramientas', id],
        queryFn: () => getHerramienta(id),
        enabled: !!id,
    });
};

export const useHistorialHerramienta = (id: number) => {
    return useQuery({
        queryKey: ['herramientas-historial', id],
        queryFn: () => getHistorial(id),
        enabled: !!id,
    });
};

export const usePrestamosActivos = () => {
    return useQuery({
        queryKey: ['herramientas-prestamos-activos'],
        queryFn: getPrestamosActivos,
    });
};

export const useMovimientoHerramienta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['movimiento-herramienta'],
        mutationFn: ({ id, data }: { id: number; data: { tipo: 'PRESTAMO' | 'DEVOLUCION'; personaId: number; cantidad: number; observaciones?: string } }) =>
            registrarMovimiento(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herramientas'] });
            queryClient.invalidateQueries({ queryKey: ['herramientas-historial'] });
            queryClient.invalidateQueries({ queryKey: ['herramientas-prestamos-activos'] });
        },
    });
};
