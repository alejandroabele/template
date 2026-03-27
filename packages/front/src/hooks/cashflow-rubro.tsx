import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CashflowRubro, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/cashflow-rubro';

export const useGetCashflowRubrosQuery = (query: Query) => {
    return useQuery({
        queryKey: ['cashflow-rubros', query],
        queryFn: () => fetch(query),
    });
};

export const useGetCashflowRubroByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['cashflow-rubro', id],
        queryFn: () => fetchById(id),
        enabled: Boolean(id),
    });
};

export const useCreateCashflowRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-cashflow-rubro'],
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-rubros'] });
        },
    });
};

export const useEditCashflowRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-cashflow-rubro'],
        mutationFn: ({ id, data }: { id: number; data: CashflowRubro }) => edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-rubros'] });
            queryClient.invalidateQueries({ queryKey: ['cashflow-rubro'] });
        },
    });
};

export const useDeleteCashflowRubroMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-cashflow-rubro'],
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cashflow-rubros'] });
        },
    });
};
