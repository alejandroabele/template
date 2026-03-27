import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchByOferta, aprobar, rechazar } from "@/services/oferta-aprobacion";

export const useGetOfertaAprobacionByOferta = (ofertaId: number) => {
  return useQuery({
    queryKey: ["oferta-aprobacion", "oferta", ofertaId],
    queryFn: () => fetchByOferta(ofertaId),
    enabled: !!ofertaId,
  });
};

export const useAprobarOfertaAprobacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["aprobar-oferta-aprobacion"],
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) =>
      aprobar(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta-aprobacion"] });
      queryClient.invalidateQueries({ queryKey: ["ofertas"] });
    },
  });
};

export const useRechazarOfertaAprobacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rechazar-oferta-aprobacion"],
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      rechazar(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oferta-aprobacion"] });
      queryClient.invalidateQueries({ queryKey: ["ofertas"] });
    },
  });
};
