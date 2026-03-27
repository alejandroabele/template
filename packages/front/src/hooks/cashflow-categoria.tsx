// src/hooks/cashflowCategoriaHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CashflowCategoria, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/cashflow-categoria";

export const useGetCashflowCategoriasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["cashflow-categoria", query],
    queryFn: () => fetch(query),
  });
};

export const useGetCashflowCategoriaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["cashflow-categoria", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateCashflowCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-cashflow-categoria"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflow-categoria"] });
    },
  });
};

export const useEditCashflowCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-cashflow-categoria"],
    mutationFn: ({ id, data }: { id: number; data: CashflowCategoria }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflow-categoria"] });
    },
  });
};

export const useDeleteCashflowCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-cashflow-categoria"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflow-categoria"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
