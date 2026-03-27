import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cuentaContableService from '@/services/cuenta-contable';
import { CuentaContable, Query } from '@/types';

export const useGetCuentasContablesQuery = (query: Query = {}) => {
    return useQuery({
        queryKey: ['cuentas-contables', query],
        queryFn: () => cuentaContableService.fetch(query),
    });
};

export const useGetCuentaContableByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['cuenta-contable', id],
        queryFn: () => cuentaContableService.fetchById(id),
        enabled: !!id,
    });
};

export const useCreateCuentaContableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CuentaContable) => cuentaContableService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuentas-contables'] });
        },
    });
};

export const useUpdateCuentaContableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CuentaContable }) =>
            cuentaContableService.edit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuentas-contables'] });
            queryClient.invalidateQueries({ queryKey: ['cuenta-contable'] });
        },
    });
};

export const useDeleteCuentaContableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => cuentaContableService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuentas-contables'] });
        },
    });
};
