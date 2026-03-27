"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building2, Check, X } from "lucide-react";
import {
  useAprobarOfertaAprobacionMutation,
  useRechazarOfertaAprobacionMutation,
} from "@/hooks/oferta-aprobacion";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { PERMISOS } from "@/constants/permisos";
import {
  APROBACION_OFERTA_TIPO_CODIGOS,
  ESTADO_OFERTA_CODIGOS,
} from "@/constants/compras";
import type { Oferta, OfertaAprobacion } from "@/types";
import { formatMoney } from "@/utils/number";

type AprobacionMasivaOfertasDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ofertas: Oferta[];
};

type TipoAprobacionDisponible = {
  codigo: string;
  nombre: string;
  permiso: string;
};

type DecisionOferta = {
  ofertaId: number;
  aprobacionId: number;
  decision: "aprobar" | "rechazar" | null;
  motivo: string;
};

const TIPOS_APROBACION: TipoAprobacionDisponible[] = [
  {
    codigo: APROBACION_OFERTA_TIPO_CODIGOS.APROB_TEC,
    nombre: "Técnica",
    permiso: PERMISOS.OFERTA_APROBAR_TECNICA,
  },
  {
    codigo: APROBACION_OFERTA_TIPO_CODIGOS.APROB_CAL,
    nombre: "Calidad",
    permiso: PERMISOS.OFERTA_APROBAR_CALIDAD,
  },
  {
    codigo: APROBACION_OFERTA_TIPO_CODIGOS.APROB_GER,
    nombre: "Gerencia",
    permiso: PERMISOS.OFERTA_APROBAR_GERENCIA,
  },
  {
    codigo: APROBACION_OFERTA_TIPO_CODIGOS.APROB_ADM,
    nombre: "Administración",
    permiso: PERMISOS.OFERTA_APROBAR_ADMINISTRACION,
  },
];

export function AprobacionMasivaOfertasDialog({
  open,
  onOpenChange,
  ofertas,
}: AprobacionMasivaOfertasDialogProps) {
  const { toast } = useToast();
  const permissions = useStore((state) => state.permissions);
  const [selectedTipoAprobacion, setSelectedTipoAprobacion] = useState<
    string | null
  >(null);
  const [decisiones, setDecisiones] = useState<Map<number, DecisionOferta>>(
    new Map()
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: aprobar } = useAprobarOfertaAprobacionMutation();
  const { mutateAsync: rechazar } = useRechazarOfertaAprobacionMutation();

  // Obtener los tipos de aprobación disponibles según los permisos del usuario
  const tiposAprobacionDisponibles = useMemo(() => {
    return TIPOS_APROBACION.filter((tipo) =>
      permissions.some((p) => p?.codigo === tipo.permiso)
    );
  }, [permissions]);

  // Inicializar con el primer tipo disponible cuando se abre el diálogo
  useEffect(() => {
    if (
      open &&
      tiposAprobacionDisponibles.length > 0 &&
      !selectedTipoAprobacion
    ) {
      setSelectedTipoAprobacion(tiposAprobacionDisponibles[0].codigo);
    }
  }, [open, tiposAprobacionDisponibles, selectedTipoAprobacion]);

  // Filtrar ofertas que están en estado de validación
  const ofertasEnValidacion = useMemo(() => {
    return ofertas.filter(
      (oferta) => oferta.estado?.codigo === ESTADO_OFERTA_CODIGOS.OF_VALIDACION
    );
  }, [ofertas]);

  // Verificar si una oferta tiene aprobación pendiente del tipo seleccionado
  const tieneAprobacionPendiente = (oferta: Oferta) => {
    if (!selectedTipoAprobacion || !oferta.aprobaciones) return false;
    return oferta.aprobaciones.some(
      (a) =>
        a.estado === "PENDIENTE" &&
        a.ofertaAprobacionTipo?.codigo === selectedTipoAprobacion
    );
  };

  // Ofertas con aprobación pendiente del tipo seleccionado
  const ofertasConAprobacionPendiente = useMemo(() => {
    if (!selectedTipoAprobacion) return ofertasEnValidacion;
    return ofertasEnValidacion.filter(tieneAprobacionPendiente);
  }, [ofertasEnValidacion, selectedTipoAprobacion]);

  // Obtener la aprobación pendiente de una oferta para el tipo seleccionado
  const getAprobacionPendiente = (
    oferta: Oferta
  ): OfertaAprobacion | undefined => {
    if (!selectedTipoAprobacion || !oferta.aprobaciones) return undefined;
    return oferta.aprobaciones.find(
      (a) =>
        a.estado === "PENDIENTE" &&
        a.ofertaAprobacionTipo?.codigo === selectedTipoAprobacion
    );
  };

  // Manejar cambio de decisión para una oferta
  const handleDecisionChange = (
    ofertaId: number,
    aprobacionId: number,
    decision: "aprobar" | "rechazar" | null
  ) => {
    setDecisiones((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(ofertaId);
      newMap.set(ofertaId, {
        ofertaId,
        aprobacionId,
        decision,
        motivo: current?.motivo || "",
      });
      return newMap;
    });
  };

  // Manejar cambio de motivo para una oferta
  const handleMotivoChange = (ofertaId: number, motivo: string) => {
    setDecisiones((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(ofertaId);
      if (current) {
        newMap.set(ofertaId, { ...current, motivo });
      }
      return newMap;
    });
  };

  // Resetear decisiones cuando cambia el tipo de aprobación
  useEffect(() => {
    setDecisiones(new Map());
  }, [selectedTipoAprobacion]);

  const resetState = () => {
    setDecisiones(new Map());
    setSelectedTipoAprobacion(null);
  };

  // Procesar todas las decisiones
  const handleAceptar = async () => {
    const decisionesArray = Array.from(decisiones.values()).filter(
      (d) => d.decision !== null
    );

    if (decisionesArray.length === 0) {
      toast({
        description: "No hay decisiones para procesar",
        variant: "destructive",
      });
      return;
    }

    // Verificar que los rechazos tengan motivo
    const rechazossinMotivo = decisionesArray.filter(
      (d) => d.decision === "rechazar" && !d.motivo.trim()
    );
    if (rechazossinMotivo.length > 0) {
      toast({
        description:
          "Debes ingresar un motivo para todas las ofertas rechazadas",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    let procesadas = 0;
    let errores = 0;

    try {
      for (const decision of decisionesArray) {
        try {
          if (decision.decision === "aprobar") {
            await aprobar({
              id: decision.aprobacionId,
              motivo: decision.motivo || undefined,
            });
          } else if (decision.decision === "rechazar") {
            await rechazar({
              id: decision.aprobacionId,
              motivo: decision.motivo,
            });
          }
          procesadas++;
        } catch (error) {
          console.error(`Error procesando oferta ${decision.ofertaId}:`, error);
          errores++;
        }
      }

      toast({
        description: `${procesadas} decisión(es) procesada(s) exitosamente${errores > 0 ? `. ${errores} error(es).` : ""}`,
        variant: errores > 0 ? "destructive" : "default",
      });

      if (procesadas > 0) {
        onOpenChange(false);
        resetState();
      }
    } catch (error) {
      console.error("Error procesando decisiones:", error);
      toast({
        description: "Error al procesar las decisiones",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Contar decisiones tomadas
  const decisionesTomadas = Array.from(decisiones.values()).filter(
    (d) => d.decision !== null
  ).length;

  if (tiposAprobacionDisponibles.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aprobación Masiva de Ofertas</DialogTitle>
          <DialogDescription>
            Selecciona aprobar o rechazar para cada oferta y confirma con el
            botón Aceptar.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={
            selectedTipoAprobacion || tiposAprobacionDisponibles[0]?.codigo
          }
          onValueChange={(value) => {
            setSelectedTipoAprobacion(value);
          }}
          className="w-full py-2"
        >
          <TabsList
            className="w-full grid"
            style={{
              gridTemplateColumns: `repeat(${tiposAprobacionDisponibles.length}, 1fr)`,
            }}
          >
            {tiposAprobacionDisponibles.map((tipo) => (
              <TabsTrigger
                key={tipo.codigo}
                value={tipo.codigo}
                className="text-xs"
              >
                {tipo.nombre.replace("Aprobación ", "").replace(" de ", " ")}
              </TabsTrigger>
            ))}
          </TabsList>

          {tiposAprobacionDisponibles.map((tipo) => (
            <TabsContent
              key={tipo.codigo}
              value={tipo.codigo}
              className="space-y-4 mt-4"
            >
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Ofertas en Validación ({ofertasConAprobacionPendiente.length})
                </Label>

                {ofertasConAprobacionPendiente.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">
                    No hay ofertas con aprobación pendiente de este tipo
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto border rounded-lg p-3">
                    {ofertasConAprobacionPendiente.map((oferta) => {
                      const aprobacion = getAprobacionPendiente(oferta);
                      if (!aprobacion) return null;

                      const decision = decisiones.get(oferta.id!);
                      const isAprobado = decision?.decision === "aprobar";
                      const isRechazado = decision?.decision === "rechazar";

                      return (
                        <div
                          key={oferta.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            isAprobado
                              ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800"
                              : isRechazado
                                ? "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800"
                                : "bg-card"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Oferta #{oferta.id}
                                </span>
                                {oferta.favorito && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Favorita
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate">
                                  {oferta.proveedor?.razonSocial ||
                                    "Sin proveedor"}
                                </span>
                              </div>
                              <p className="text-sm font-semibold mt-1">
                                {formatMoney(oferta.montoTotal || 0)}
                              </p>
                            </div>

                            {/* Switch de decisión */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecisionChange(
                                      oferta.id!,
                                      aprobacion.id,
                                      isRechazado ? null : "rechazar"
                                    )
                                  }
                                  className={`p-2 rounded-full transition-colors ${
                                    isRechazado
                                      ? "bg-red-500 text-white"
                                      : "bg-muted hover:bg-red-100 dark:hover:bg-red-900/30"
                                  }`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecisionChange(
                                      oferta.id!,
                                      aprobacion.id,
                                      isAprobado ? null : "aprobar"
                                    )
                                  }
                                  className={`p-2 rounded-full transition-colors ${
                                    isAprobado
                                      ? "bg-green-500 text-white"
                                      : "bg-muted hover:bg-green-100 dark:hover:bg-green-900/30"
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Campo de motivo - visible cuando hay decisión */}
                          {decision?.decision && (
                            <div className="mt-3">
                              <Textarea
                                placeholder={
                                  decision.decision === "rechazar"
                                    ? "Motivo del rechazo (obligatorio)"
                                    : "Motivo (opcional)"
                                }
                                value={decision.motivo}
                                onChange={(e) =>
                                  handleMotivoChange(oferta.id!, e.target.value)
                                }
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="flex gap-2 py-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetState();
            }}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAceptar}
            disabled={isProcessing || decisionesTomadas === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>Aceptar {decisionesTomadas > 0 && `(${decisionesTomadas})`}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
