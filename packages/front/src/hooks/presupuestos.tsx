// src/hooks/presupuestoHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Presupuesto, Query } from "@/types";
import {
  fetch,
  listar,
  fetchById,
  create,
  edit,
  remove,
  fetchExcel,
  fetchPdf,
  verificarAlmacen,
  registrarFecha,
  confirmarEntrega,
  verificarServicio,
  certificar,
  fetchMaterialesAnalisis,
  fetchSuministrosAnalisis,
  fetchManoDeObraAnalisis,
  fetchProductosExtrasAnalisis,
} from "@/services/presupuesto";
import { useLoading } from "@/hooks/loading";

export const useGetPresupuestosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["presupuestos", query],
    queryFn: () => fetch(query),
    refetchInterval: 30000,
  });
};

export const useListarPresupuestosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["listar-presupuestos", query],
    queryFn: () => listar(query),
  });
};

export const useGetPresupuestoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["presupuesto", id],
    queryFn: () => fetchById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreatePresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-presupuesto"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useEditPresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-presupuesto"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useDeletePresupuestoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-presupuesto"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
export const useDownloadPresupuestosExcel = () => {
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
      a.download = "presupuestos.xlsx"; // Nombre del archivo descargado
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

export const useDownloadPresupuestosPdf = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: string;
      type: "presupuesto" | "orden";
    }) => {
      showLoading();

      const data = await fetchPdf(id, type);
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.target = "_blank"; // Abre en nueva pestaña
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

export const useVerficarAlmacenMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["verificar-almacen"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      verificarAlmacen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useRegistrarFecha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["registrar-fecha"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      registrarFecha(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useConfirmarEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["confirmar-entrega"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      confirmarEntrega(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};
export const useVerficarServicioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["verificar-servicio"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      verificarServicio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useCertificar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["certificar"],
    mutationFn: ({ id, data }: { id: number; data: Presupuesto }) =>
      certificar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    },
  });
};

export const useGetMaterialesAnalisisQuery = (id: number) => {
  return useQuery({
    queryKey: ["materiales-analisis", id],
    queryFn: () => fetchMaterialesAnalisis(id),
    enabled: !!id && id > 0,
  });
};

export const useGetSuministrosAnalisisQuery = (id: number) => {
  return useQuery({
    queryKey: ["suministros-analisis", id],
    queryFn: () => fetchSuministrosAnalisis(id),
    enabled: !!id && id > 0,
  });
};

export const useGetManoDeObraAnalisisQuery = (id: number) => {
  return useQuery({
    queryKey: ["mano-de-obra-analisis", id],
    queryFn: () => fetchManoDeObraAnalisis(id),
    enabled: !!id && id > 0,
  });
};

export const useGetProductosExtrasAnalisisQuery = (id: number) => {
  return useQuery({
    queryKey: ["productos-extras-analisis", id],
    queryFn: () => fetchProductosExtrasAnalisis(id),
    enabled: !!id && id > 0,
  });
};
