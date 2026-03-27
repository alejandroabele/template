import { useQuery } from "@tanstack/react-query";
import {
  fetchEstadoConsumo,
  fetchOrdenesPorTipo,
} from "@/services/reportes-contrato-marco";

export const useGetEstadoConsumoContratoQuery = (id: number) => {
  return useQuery({
    queryKey: ["estado-consumo-contrato", id],
    queryFn: () => fetchEstadoConsumo(id),
    enabled: !!id, // solo ejecuta si hay id
  });
};
export const useGetOrdenesPorTipoQuery = (id: number) => {
  return useQuery({
    queryKey: ["ordenes-tipo-contrato", id],
    queryFn: () => fetchOrdenesPorTipo(id),
    enabled: !!id,
  });
};
