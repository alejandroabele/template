import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contacto, Query } from "@/types";
import { fetch, fetchById, create, edit, remove } from "@/services/contacto";

export const useGetContactosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["contactos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetContactoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["contacto", id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContactoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-contacto"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactos"] });
      queryClient.invalidateQueries({ queryKey: ["contacto-caso"] });
    },
  });
};

export const useEditContactoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-contacto"],
    mutationFn: ({ id, data }: { id: number; data: Contacto }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactos"] });
    },
  });
};

export const useDeleteContactoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-contacto"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactos"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
