import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Solcom, Query } from "@/types";
import { solcomService } from "@/services/solcom";
import { useLoading } from "@/hooks/loading";

export const useGetSolcomsQuery = (query: Query) => {
  return useQuery({
    queryKey: ["solcom", query],
    queryFn: () => solcomService.fetch(query),
  });
};

export const useGetSolcomByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["solcom", id],
    queryFn: () => solcomService.fetchById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreateSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-solcom"],
    mutationFn: solcomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useEditSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-solcom"],
    mutationFn: ({ id, data }: { id: number; data: Solcom }) =>
      solcomService.edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useDeleteSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-solcom"],
    mutationFn: solcomService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useFinalizarSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["finalizar-solcom"],
    mutationFn: solcomService.finalizar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useAsignarSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["asignar-solcom"],
    mutationFn: solcomService.asignar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useModificarEstadoSolcomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["modificar-estado-solcom"],
    mutationFn: ({ id, estadoId }: { id: number; estadoId: number }) =>
      solcomService.modificarEstado(id, estadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useGenerarPdfSolcomMutation = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async ({ id, descripcionPdf }: { id: number; descripcionPdf: string }) => {
      showLoading();

      const data = await solcomService.generarPdf(id, descripcionPdf);
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
      console.error("Error al generar el PDF", error);
    },
    onSettled: () => {
      hideLoading();
    },
  });
};

export const useGetSolcomItemsQuery = (solcomId: number) => {
  return useQuery({
    queryKey: ["solcom-items", solcomId],
    queryFn: () => solcomService.fetchItems(solcomId),
    enabled: !!solcomId && solcomId > 0,
  });
};

export const useGetAllSolcomItemsQuery = (query: Query) => {
  return useQuery({
    queryKey: ["solcom-all-items", query],
    queryFn: () => solcomService.fetchAllItems(query),
  });
};

export const useAsignarSolcomItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["asignar-solcom-items"],
    mutationFn: solcomService.asignarItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solcom-items"] });
      queryClient.invalidateQueries({ queryKey: ["solcom"] });
    },
  });
};

export const useFetchSolcomItemsByIdsQuery = (itemIds: number[]) => {
  return useQuery({
    queryKey: ["solcom-items-by-ids", itemIds],
    queryFn: () => solcomService.fetchItemsByIds(itemIds),
    enabled: itemIds.length > 0,
  });
};

export const useFetchSolcomItemsBySolcomIdsQuery = (solcomIds: number[]) => {
  return useQuery({
    queryKey: ["solcom-items-by-solcom-ids", solcomIds],
    queryFn: () => solcomService.fetchItemsBySolcomIds(solcomIds),
    enabled: solcomIds.length > 0,
  });
};
