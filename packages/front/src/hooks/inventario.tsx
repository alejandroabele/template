import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inventario, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  createIngresoMercaderia,
  fetchExcel,
  migrarDesdeExcel,
  actualizarPrecioManual,
  getPrecioHistorial,
} from "@/services/inventario";
import { useLoading } from "@/hooks/loading";

export const useGetInventarioQuery = (query: Query, options = {}) => {
  return useQuery({
    queryKey: ["inventario", query],
    queryFn: () => fetch(query),
    select: (data) => {
      return data.map((item: Inventario) => ({
        ...item,
        categoria: item.categoria?.nombre || null,
      }));
    },
    ...options,
  });
};

export const useGetInventarioByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["inventario", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-inventario"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
};

export const useEditInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-inventario"],
    mutationFn: ({ id, data }: { id: number; data: Inventario }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
};

export const useDeleteInventarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-inventario"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useCreateIngresoMercaderia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ingreso-inventario"],
    mutationFn: createIngresoMercaderia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
};

export const useDownloadInventarioExcel = () => {
  const { showLoading, hideLoading } = useLoading();
  return useMutation({
    mutationFn: async (query: Query) => {
      showLoading();
      const data = await fetchExcel(query); // Llama a la función de descarga con el query
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "inventario.xlsx"; // Nombre del archivo descargado
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      // Manejo de errores
      console.error("Error al descargar el archivo", error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};

export const useActualizarPrecioManual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["actualizar-precio-inventario"],
    mutationFn: ({ id, data }: { id: number; data: { precio: string; motivo: string } }) =>
      actualizarPrecioManual(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
      queryClient.invalidateQueries({ queryKey: ["precio-historial", id] });
    },
  });
};

export const usePrecioHistorial = (inventarioId: number) => {
  return useQuery({
    queryKey: ["precio-historial", inventarioId],
    queryFn: () => getPrecioHistorial(inventarioId),
    enabled: !!inventarioId,
  });
};

export const useMigrarInventarioExcel = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationKey: ["migrar-inventario-excel"],
    mutationFn: ({ file, manejaStock }: { file: File; manejaStock: boolean }) =>
      migrarDesdeExcel(file, manejaStock),
    onMutate: () => {
      showLoading();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
    onError: (error) => {
      console.error("Error al migrar desde Excel:", error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};
