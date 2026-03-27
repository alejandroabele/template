import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactoCaso, Query } from "@/types";
import {
  fetch,
  fetchById,
  create,
  edit,
  remove,
} from "@/services/contacto-caso";

export const useGetContactoCasosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["contacto-casos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetContactoCasoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["contacto-caso", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContactoCasoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-contacto-caso"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacto-casos"] });
      queryClient.invalidateQueries({ queryKey: ["contacto-caso"] });
      queryClient.invalidateQueries({ queryKey: ["contacto-proximo"] });
    },
  });
};

export const useEditContactoCasoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-contacto-caso"],
    mutationFn: ({ id, data }: { id: number; data: ContactoCaso }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacto-casos"] });
      queryClient.invalidateQueries({ queryKey: ["contacto-caso"] });
      queryClient.invalidateQueries({ queryKey: ["contacto-proximo"] });
    },
  });
};

export const useDeleteContactoCasoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-contacto-caso"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacto-casos"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
