// src/hooks/contrato-marcoHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContratoMarco, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/contrato-marco";

export const useGetContratoMarcosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["contrato-marcos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetContratoMarcoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["contrato-marco", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContratoMarcoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-contrato-marco"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-marcos"] });
    },
  });
};

export const useEditContratoMarcoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-contrato-marco"],
    mutationFn: ({ id, data }: { id: number; data: ContratoMarco }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-marcos"] });
    },
  });
};

export const useDeleteContratoMarcoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-contrato-marco"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrato-marcos"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
