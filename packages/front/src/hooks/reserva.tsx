import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reserva, ReservaItem, Query, ValidacionStock, EgresoMasivo } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  validarStock,
  fetchPdf,
  fetchPdfEgresoOt,
  fetchExcel,
} from "@/services/reserva";
import { useLoading } from "@/hooks/loading";

export const useGetReservasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["reservas", query],
    queryFn: () => fetch(query),
  });
};

export const useGetReservaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["reserva", id],
    queryFn: () => fetchById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreateReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-reserva"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
  });
};

export const useEditReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-reserva"],
    mutationFn: ({ id, data }: { id: number; data: Partial<Reserva> }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["reserva"] });
    },
  });
};

export const useDeleteReservaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-reserva"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-reservas"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useValidarStockQuery = (
  items: { productoId: number; cantidad: number }[],
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["validar-stock", items],
    queryFn: () => validarStock(items),
    enabled: enabled && items.length > 0,
  });
};

export const useDownloadReservaPdfMutation = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      showLoading();

      const data = await fetchPdf(id);
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Error al abrir el archivo PDF", error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};

export const useDownloadReservasExcel = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async (query: Query) => {
      showLoading();
      const data = await fetchExcel(query);
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reservas.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error al descargar el archivo', error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};

export const useDownloadEgresoOtPdfMutation = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async (payload: EgresoMasivo) => {
      showLoading();

      const data = await fetchPdfEgresoOt(payload);
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Error al abrir el archivo PDF", error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};
