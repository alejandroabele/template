import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventarioCategoria, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/inventario-categorias";

export const useGetInventarioCategoriasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["inventario-categorias", query],
    queryFn: () => fetch(query),
  });
};

export const useGetInventarioCategoriaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["inventario-categoria", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateInventarioCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-inventario-categoria"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-categorias"] });
    },
  });
};

export const useEditInventarioCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-inventario-categoria"],
    mutationFn: ({ id, data }: { id: number; data: InventarioCategoria }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-categorias"] });
    },
  });
};

export const useDeleteInventarioCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-inventario-categoria"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-categorias"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
