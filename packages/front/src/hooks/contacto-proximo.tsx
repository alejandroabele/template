import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactoProximo, Query } from '@/types';
import { fetch, fetchById, create, edit, remove } from '@/services/contacto-proximo';

export const useGetContactoProximosQuery = (query: Query) => {
  return useQuery({
    queryKey: ['contacto-proximos', query],
    queryFn: () => fetch(query),
  });
};

export const useGetContactoProximoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['contacto-proximo', id],
    queryFn: () => fetchById(id),
  });
};

export const useCreateContactoProximoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-contacto-proximo'],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacto-proximos'] });
    },
  });
};

export const useEditContactoProximoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['edit-contacto-proximo'],
    mutationFn: ({ id, data }: { id: number; data: ContactoProximo }) => edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacto-proximos'] });
    },
  });
};

export const useDeleteContactoProximoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-contacto-proximo'],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacto-proximos'] });
    },
    onError: (error) => {
      console.error('Error en eliminación:', error);
    },
  });
};
