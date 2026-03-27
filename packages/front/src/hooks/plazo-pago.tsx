import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlazoPago, Query } from "@/types";
import { fetch, fetchById, create, edit, remove } from "@/services/plazo-pago";

export const useGetPlazoPagosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["plazo-pago", query],
    queryFn: () => fetch(query),
  });
};

export const useGetPlazoPagoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["plazo-pago", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreatePlazoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-plazo-pago"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plazo-pago"] });
    },
  });
};

export const useEditPlazoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-plazo-pago"],
    mutationFn: ({ id, data }: { id: number; data: PlazoPago }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plazo-pago"] });
    },
  });
};

export const useDeletePlazoPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-plazo-pago"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plazo-pago"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
