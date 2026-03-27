import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Banco, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  transferir,
} from "@/services/banco";

export const useGetBancosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["bancos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetBancoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["banco", id],
    queryFn: () => fetchById(id),
    enabled: !!id,
  });
};

export const useCreateBancoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-banco"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bancos"] });
    },
  });
};

export const useEditBancoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-banco"],
    mutationFn: ({ id, data }: { id: number; data: Banco }) => edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bancos"] });
      queryClient.invalidateQueries({ queryKey: ["banco"] });
    },
  });
};

export const useDeleteBancoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-banco"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bancos"] });
    },
  });
};

export const useTransferirBancoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["transferir-banco"],
    mutationFn: transferir,
    onSuccess: () => {
      // Invalidar queries de bancos y saldos
      queryClient.invalidateQueries({ queryKey: ["banco-saldos"] });

      // Invalidar queries de cashflow
    },
  });
};
