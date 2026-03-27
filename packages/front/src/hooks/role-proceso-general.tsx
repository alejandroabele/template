import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleProcesoGeneral, Query, CreateRoleProcesoGeneralDto, UpdateRoleProcesoGeneralDto } from "@/types";
import { fetch, fetchById, fetchByRoleId, create, edit, remove, removeByRoleAndProceso } from "@/services/role-proceso-general";

export const useGetRoleProcesoGeneralQuery = (query: Query) => {
  return useQuery({
    queryKey: ["role-proceso-general", query],
    queryFn: () => fetch(query),
  });
};

export const useGetRoleProcesoGeneralByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["role-proceso-general", id],
    queryFn: () => fetchById(id),
    enabled: !!id,
  });
};

export const useGetProcesosByRoleIdQuery = (roleId: number) => {
  return useQuery({
    queryKey: ["role-proceso-general", "by-role", roleId],
    queryFn: () => fetchByRoleId(roleId),
    enabled: !!roleId,
  });
};

export const useCreateRoleProcesoGeneralMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-role-proceso-general"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-proceso-general"] });
    },
  });
};

export const useEditRoleProcesoGeneralMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-role-proceso-general"],
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleProcesoGeneralDto }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-proceso-general"] });
    },
  });
};

export const useDeleteRoleProcesoGeneralMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-role-proceso-general"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-proceso-general"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useDeleteByRoleAndProcesoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-role-proceso-by-role-proceso"],
    mutationFn: ({ roleId, procesoGeneralId }: { roleId: number; procesoGeneralId: number }) =>
      removeByRoleAndProceso(roleId, procesoGeneralId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-proceso-general"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};

export const useDeleteRoleProcesoByRoleAndProcesoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-role-proceso-by-role-proceso"],
    mutationFn: ({ roleId, procesoGeneralId }: { roleId: number; procesoGeneralId: number }) =>
      removeByRoleAndProceso(roleId, procesoGeneralId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-proceso-general"] });
    },
    onError: (error) => {
      console.error("Error en eliminación:", error);
    },
  });
};
