// src/hooks/contrato-marcoHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContratoMarcoPresupuesto, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/contrato-marco-presupuesto";

export const useGetContratoMarcoPresupuestosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["contrato-marco-presupuestos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetContratoMarcoPresupuestoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["contrato-marco-presupuesto", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContratoMarcoPresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-contrato-marco-presupuesto"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contrato-marco-presupuestos"],
      });
    },
  });
};

export const useEditContratoMarcoPresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-contrato-marco-presupuesto"],
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ContratoMarcoPresupuesto;
    }) => edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contrato-marco-presupuestos"],
      });
    },
  });
};

export const useDeleteContratoMarcoPresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-contrato-marco-presupuesto"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contrato-marco-presupuestos"],
      });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
