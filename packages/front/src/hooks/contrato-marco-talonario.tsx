// src/hooks/contrato-marcoHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContratoMarcoTalonario, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/contrato-marco-talonario";

export const useGetContratoMarcoTalonariosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["contrato-marco-talonarios", query],
    queryFn: () => fetch(query),
  });
};

export const useGetContratoMarcoTalonarioByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["contrato-marco-talonario", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContratoMarcoTalonarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-contrato-marco-talonario"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-marcos"] });
    },
  });
};

export const useEditContratoMarcoTalonarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-contrato-marco-talonario"],
    mutationFn: ({ id, data }: { id: number; data: ContratoMarcoTalonario }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contrato-marco-talonarios"],
      });
    },
  });
};

export const useDeleteContratoMarcoTalonarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-contrato-marco-talonario"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-marcos"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
