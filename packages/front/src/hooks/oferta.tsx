import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Oferta, Query } from "@/types";
import {
  fetch,
  fetchById,
  fetchByIds,
  create,
  edit,
  remove,
  enviarAValidar,
  rechazar,
} from "@/services/oferta";

export const useGetOfertasQuery = (query: Query) => {
  return useQuery({
    queryKey: ["oferta", query],
    queryFn: () => fetch(query),
  });
};

export const useGetOfertaByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["oferta", id],
    queryFn: () => fetchById(id),
    enabled: !!id,
  });
};

export const useGetOfertasByIdsQuery = (ids: number[]) => {
  return useQuery({
    queryKey: ["ofertas", "by-ids", ids],
    queryFn: () => fetchByIds(ids),
    enabled: ids.length > 0,
  });
};

export const useCreateOfertaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-oferta"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
  });
};

export const useEditOfertaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-oferta"],
    mutationFn: ({ id, data }: { id: number; data: Oferta }) => edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
  });
};

export const useDeleteOfertaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-oferta"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useEnviarAValidarOfertaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["enviar-a-validar-oferta"],
    mutationFn: (id: number) => enviarAValidar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
  });
};

export const useRechazarOfertaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rechazar-oferta"],
    mutationFn: (id: number) => rechazar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta"] });
    },
  });
};
