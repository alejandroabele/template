import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { CashflowTransaccion, Query } from "@/types";
import {
  fetchById,
  fetchBusqueda,
  create,
  edit,
  remove,
  fetchConciliar,
  fetchResumenSemana,
  fetchResumenMes,
  fetchResumenTrimestre,
  fetchResumenSemanaMes,
  fetchColumnas,
  migrarDesdeExcel,
} from "@/services/cashflow-transaccion";
import {
  fetchResumenSemana as fetchResumenSemanaSimulacion,
  fetchResumenMes as fetchResumenMesSimulacion,
  fetchResumenTrimestre as fetchResumenTrimestreSimulacion,
  fetchResumenSemanaMes as fetchResumenSemanaMesSimulacion,
  fetchColumnas as fetchColumnasSimulacion,
} from "@/services/cashflow-simulacion";

export const useSearchCashflowTransaccionesQuery = (query: Query, enabled: boolean) => {
  return useQuery({
    queryKey: ["cashflow-transacciones-busqueda", query],
    queryFn: () => fetchBusqueda(query),
    enabled,
  });
};

export const useGetCashflowTransaccionByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["cashflow-transaccion", id],
    queryFn: () => fetchById(id),
    enabled: Boolean(id),
  });
};

export const useCreateCashflowTransaccionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-cashflow-transaccion"],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashflow-resumen-semana"],
      });
    },
  });
};

export const useEditCashflowTransaccionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-cashflow-transaccion"],
    mutationFn: ({ id, data }: { id: number; data: CashflowTransaccion }) =>
      edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashflow-resumen-semana"],
      });
    },
  });
};

export const useDeleteCashflowTransaccionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-cashflow-transaccion"],
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashflow-resumen-semana"],
      });
    },
  });
};

export const useConciliarCashflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["conciliar-cashflow-transaccion"],
    mutationFn: fetchConciliar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashflow-resumen-semana"],
      });
    },
  });
};

export const useGetCashflowResumenSemanaQuery = (
  from: string,
  to: string,
  incluirProyectado: boolean,
  options?: { enabled?: boolean },
  simulacionId?: number
) => {
  return useQuery({
    queryKey: ["cashflow-resumen-semana", from, to, incluirProyectado, simulacionId],
    queryFn: () =>
      simulacionId
        ? fetchResumenSemanaSimulacion(simulacionId, from, to)
        : fetchResumenSemana(from, to, incluirProyectado),
    ...options,
  });
};

export const useGetCashflowResumenMesQuery = (
  from: string,
  to: string,
  incluirProyectado: boolean,
  options?: { enabled?: boolean },
  simulacionId?: number
) => {
  return useQuery({
    queryKey: ["cashflow-resumen-mes", from, to, incluirProyectado, simulacionId],
    queryFn: () =>
      simulacionId
        ? fetchResumenMesSimulacion(simulacionId, from, to)
        : fetchResumenMes(from, to, incluirProyectado),
    ...options,
  });
};

export const useGetCashflowResumenTrimestreQuery = (
  year: number,
  incluirProyectado: boolean,
  options?: { enabled?: boolean },
  simulacionId?: number
) => {
  return useQuery({
    queryKey: ["cashflow-resumen-trimestre", year, incluirProyectado, simulacionId],
    queryFn: () =>
      simulacionId
        ? fetchResumenTrimestreSimulacion(simulacionId, year)
        : fetchResumenTrimestre(year, incluirProyectado),
    ...options,
  });
};

export const useGetCashflowResumenSemanaMesQuery = (
  year: number,
  month: number,
  incluirProyectado: boolean,
  options?: { enabled?: boolean },
  simulacionId?: number
) => {
  return useQuery({
    queryKey: ["cashflow-resumen-semana-mes", year, month, incluirProyectado, simulacionId],
    queryFn: () =>
      simulacionId
        ? fetchResumenSemanaMesSimulacion(simulacionId, year, month)
        : fetchResumenSemanaMes(year, month, incluirProyectado),
    ...options,
  });
};

export const useGetCashflowColumnasQuery = (
  vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
  params: { from?: string; year?: number; month?: number },
  options?: { enabled?: boolean },
  simulacionId?: number
) => {
  return useQuery({
    queryKey: ["cashflow-columnas", vista, params, simulacionId],
    queryFn: () =>
      simulacionId
        ? fetchColumnasSimulacion(simulacionId, vista, params)
        : fetchColumnas(vista, params),
    ...options,
  });
};

export const useMigrarCashflowExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["migrar-cashflow-excel"],
    mutationFn: (file: File) => migrarDesdeExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cashflow-resumen-semana"],
      });
    },
  });
};
