import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdenCompra, Query, OrdenCompraItem } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
  fetchPdf,
  cancelar,
  editOrdenCompraItem,
} from "@/services/orden-compra";
import { useLoading } from "@/hooks/loading";

export const useGetOrdenComprasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["orden-compra", query],
    queryFn: () => fetch(query),
  });
};

export const useGetOrdenCompraByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["orden-compra", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateOrdenCompraMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-orden-compra"],
    mutationFn: (ofertaId: number) => create({ ofertaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orden-compra"] });
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
  });
};

export const useEditOrdenCompraMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-orden-compra"],
    mutationFn: ({ id, data }: { id: number; data: OrdenCompra }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orden-compra"] });
    },
  });
};

export const useDeleteOrdenCompraMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-orden-compra"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orden-compra"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useDownloadOrdenCompraPdf = () => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: async (id: string) => {
      showLoading();

      const data = await fetchPdf(id);
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

export const useCancelarOrdenCompraMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancelar-orden-compra"],
    mutationFn: (id: number) => cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orden-compra"] });
    },
  });
};

export const useEditOrdenCompraItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-orden-compra-item"],
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<OrdenCompraItem>;
    }) => editOrdenCompraItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orden-compra"] });
    },
  });
};
