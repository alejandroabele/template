import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CentroCosto, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/centro-costo";

export const useGetCentroCostosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["centro-costo", query],
    queryFn: () => fetch(query),
  });
};

export const useGetCentroCostoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["centro-costo", id],
    queryFn: () => fetchById(id),
    enabled: !!id,
  });
};

export const useCreateCentroCostoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-centro-costo"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centro-costo"] });
    },
  });
};

export const useEditCentroCostoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-centro-costo"],
    mutationFn: ({ id, data }: { id: number; data: CentroCosto }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centro-costo"] });
    },
  });
};

export const useDeleteCentroCostoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-centro-costo"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centro-costo"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
