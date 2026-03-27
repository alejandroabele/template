import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EstadoCompras, Query } from "@/types";
import { fetch, fetchById, create, edit, remove } from "@/services/estado-compras";

export const useGetEstadoComprasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["estado-compras", query],
    queryFn: () => fetch(query),
  });
};

export const useGetEstadoComprasByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["estado-compras", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateEstadoComprasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-estado-compras"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estado-compras"] });
    },
  });
};

export const useEditEstadoComprasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-estado-compras"],
    mutationFn: ({ id, data }: { id: number; data: EstadoCompras }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estado-compras"] });
    },
  });
};

export const useDeleteEstadoComprasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-estado-compras"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estado-compras"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
