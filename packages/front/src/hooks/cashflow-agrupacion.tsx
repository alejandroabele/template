import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CashflowAgrupacion } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/cashflow-agrupacion';

export const useGetCashflowAgrupacionesQuery = () => {
    return useQuery({
        queryKey: ['cashflow-agrupaciones'],
        queryFn: () => fetch(),
    });
};

export const useGetCashflowAgrupacionByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['cashflow-agrupacion', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id),
    });
};

export const useCreateCashflowAgrupacionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-cashflow-agrupacion'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-agrupaciones'] });
        },
    });
};

export const useEditCashflowAgrupacionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-cashflow-agrupacion'],
        mutationFn: ({ id, data }: { id: number; data: Partial<CashflowAgrupacion> }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-agrupaciones'] });
            queryClient.invalidateQueries({ queryKey: ['cashflow-agrupacion'] });
        },
    });
};

export const useDeleteCashflowAgrupacionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-cashflow-agrupacion'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-agrupaciones'] });
        },
    });
};
