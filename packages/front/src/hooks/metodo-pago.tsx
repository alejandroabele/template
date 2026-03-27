// src/hooks/provedoreHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetodoPago, Query } from "@/types";
import { fetch, fetchById, create, edit, remove } from "@/services/metodo-pago";

export const useGetMetodoPagosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["metodo-pago", query],
    queryFn: () => fetch(query),
  });
};

export const useGetMetodoPagoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["metodo-pago", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-metodo-pago"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metodo-pago"] });
    },
  });
};

export const useEditMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-metodo-pago"],
    mutationFn: ({ id, data }: { id: number; data: MetodoPago }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metodo-pago"] });
    },
  });
};

export const useDeleteMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-metodo-pago"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metodo-pago"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
