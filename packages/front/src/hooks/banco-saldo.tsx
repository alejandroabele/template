import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BancoSaldo, Query } from "@/types";
import {
  fetch,
  fetchByBanco,
  fetchById,
  create,
  edit,
  remove,
  fetchUltimosSaldos,
  fetchSaldosPorFechas,
  actualizarSaldosHoy,
} from "@/services/banco-saldo";

export const useGetBancoSaldosQuery = (query: Query) => {
  return useQuery({
    queryKey: ["banco-saldos", query],
    queryFn: () => fetch(query),
  });
};

export const useGetBancoSaldosByBancoQuery = (bancoId: number) => {
  return useQuery({
    queryKey: ["banco-saldos-banco", bancoId],
    queryFn: () => fetchByBanco(bancoId),
    enabled: !!bancoId,
  });
};

export const useGetBancoSaldoByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["banco-saldo", id],
    queryFn: () => fetchById(id),
    enabled: !!id,
  });
};

export const useCreateBancoSaldoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-banco-saldo"],
    mutationFn: create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["banco-saldos"] });
      queryClient.invalidateQueries({
        queryKey: ["banco-saldos-banco", data.bancoId],
      });
    },
  });
};

export const useEditBancoSaldoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-banco-saldo"],
    mutationFn: ({ id, data }: { id: number; data: BancoSaldo }) =>
      edit(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["banco-saldos"] });
      queryClient.invalidateQueries({ queryKey: ["banco-saldo"] });
      queryClient.invalidateQueries({
        queryKey: ["banco-saldos-banco", data?.bancoId],
      });
    },
  });
};

export const useDeleteBancoSaldoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-banco-saldo"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banco-saldos"] });
      queryClient.invalidateQueries({ queryKey: ["banco-saldos-banco"] });
    },
  });
};

export const useGetUltimosSaldosQuery = () => {
  return useQuery({
    queryKey: ["ultimos-saldos-bancos"],
    queryFn: fetchUltimosSaldos,
  });
};

export const useGetSaldosPorFechasQuery = (fechas: string[], enabled: boolean = true) => {
  return useQuery({
    queryKey: ["saldos-bancos-por-fechas", fechas],
    queryFn: () => fetchSaldosPorFechas(fechas),
    enabled: enabled && fechas.length > 0,
  });
};

export const useActualizarSaldosHoyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["actualizar-saldos-hoy"],
    mutationFn: actualizarSaldosHoy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banco-saldos"] });
      queryClient.invalidateQueries({ queryKey: ["ultimos-saldos-bancos"] });
      queryClient.invalidateQueries({ queryKey: ["banco-saldos-banco"] });
    },
  });
};
