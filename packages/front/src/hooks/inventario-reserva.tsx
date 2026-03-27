import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventarioReserva, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  fetchByPresupuesto,
  fetchByPresupuestoAndTrabajo,
  fetchByCentroCosto,
} from "@/services/inventario-reserva";

export const useGetInventarioReservasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["inventario-reservas", query],
    queryFn: () => fetch(query),
    enabled: query.enabled,
  });
};

export const useGetInventarioReservaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["inventario-reserva", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateInventarioReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-inventario-reserva"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
  });
};

export const useEditInventarioReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-inventario-reserva"],
    mutationFn: ({ id, data }: { id: number; data: InventarioReserva }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
  });
};

export const useDeleteInventarioReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-inventario-reserva"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useGetReservasByPresupuestoQuery = (presupuestoId: number) => {
  return useQuery({
    queryKey: ["inventario-reserva-presupuesto", presupuestoId],
    queryFn: () => fetchByPresupuesto(presupuestoId),
    enabled: !!presupuestoId && presupuestoId > 0,
  });
};

export const useGetReservasByPresupuestoAndTrabajoQuery = (
  presupuestoId: number,
  trabajoId: number
) => {
  return useQuery({
    queryKey: [
      "inventario-reserva-presupuesto-trabajo",
      presupuestoId,
      trabajoId,
    ],
    queryFn: () => fetchByPresupuestoAndTrabajo(presupuestoId, trabajoId),
    enabled:
      !!presupuestoId && presupuestoId > 0 && !!trabajoId && trabajoId > 0,
  });
};

export const useGetReservasByCentroCostoQuery = (centroCostoId: number) => {
  return useQuery({
    queryKey: ["inventario-reserva-centro-costo", centroCostoId],
    queryFn: () => fetchByCentroCosto(centroCostoId),
    enabled: !!centroCostoId && centroCostoId > 0,
  });
};
