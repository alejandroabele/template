// src/hooks/movimiento-inventarioHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovimientoInventario, Query, EgresoMasivo } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  egresoMasivo,
} from "@/services/movimiento-inventario";

export const useGetMovimientoInventariosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["movimiento-inventarios", query],
    queryFn: () => fetch(query),
  });
};

export const useGetMovimientoInventarioByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["movimiento-inventario", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateMovimientoInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-movimiento-inventario"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimiento-inventarios"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
  });
};

export const useEditMovimientoInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-movimiento-inventario"],
    mutationFn: ({ id, data }: { id: number; data: MovimientoInventario }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimiento-inventarios"] });
    },
  });
};

export const useDeleteMovimientoInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-movimiento-inventario"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimiento-inventarios"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useCreateIngresoMercaderiaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-ingreso-mercaderia"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingreso-mercaderia"] });
    },
  });
};

export const useEgresoMasivoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["egreso-masivo"],
    mutationFn: (data: EgresoMasivo) => egresoMasivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimiento-inventarios"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
      queryClient.invalidateQueries({ queryKey: ["inventarios"] });
    },
  });
};
