"use client";

import React, { useState } from "react";
import { OfertaAprobacion } from "@/types";
import { Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfertaAprobacionDialog } from "@/components/dialogs/oferta-aprobacion-dialog";
import { formatTime } from "@/utils/date";
import { PERMISOS } from "@/constants/permisos";
import {
  APROBACION_OFERTA_TIPO_CODIGOS,
  ESTADO_OFERTA_CODIGOS,
} from "@/constants/compras";
import { useStore } from "@/lib/store";

type OfertaAprobacionFormProps = {
  aprobaciones: OfertaAprobacion[];
  estadoOferta?: string;
};

export default function OfertaAprobacionForm({
  aprobaciones,
  estadoOferta,
}: OfertaAprobacionFormProps) {
  const [selectedAprobacion, setSelectedAprobacion] =
    useState<OfertaAprobacion | null>(null);
  const [accion, setAccion] = useState<"aprobar" | "rechazar" | null>(null);
  const [motivo, setMotivo] = useState("");
  const [open, setOpen] = useState(false);

  // Obtener permisos del usuario en el nivel superior
  const permissions = useStore((state) => state.permissions);

  const handleAprobar = (aprobacion: OfertaAprobacion) => {
    setSelectedAprobacion(aprobacion);
    setAccion("aprobar");
    setMotivo("");
    setOpen(true);
  };

  const handleRechazar = (aprobacion: OfertaAprobacion) => {
    setSelectedAprobacion(aprobacion);
    setAccion("rechazar");
    setMotivo("");
    setOpen(true);
  };

  const getStepIcon = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return <Check className="w-4 h-4 text-white" />;
      case "RECHAZADO":
        return <X className="w-4 h-4 text-white" />;
      case "PENDIENTE":
      default:
        return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const getStepColor = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return "bg-green-500 border-green-600";
      case "RECHAZADO":
        return "bg-red-500 border-red-600";
      case "PENDIENTE":
      default:
        return "bg-blue-500 border-blue-600";
    }
  };

  const tienePermisoParaAprobar = (aprobacion: OfertaAprobacion): boolean => {
    // Verificar primero si la oferta está en estado de validación
    if (estadoOferta !== ESTADO_OFERTA_CODIGOS.OF_VALIDACION) {
      return false;
    }

    const codigo = aprobacion.ofertaAprobacionTipo?.codigo;

    let permisoRequerido: string | null = null;

    switch (codigo) {
      case APROBACION_OFERTA_TIPO_CODIGOS.APROB_TEC:
        permisoRequerido = PERMISOS.OFERTA_APROBAR_TECNICA;
        break;
      case APROBACION_OFERTA_TIPO_CODIGOS.APROB_CAL:
        permisoRequerido = PERMISOS.OFERTA_APROBAR_CALIDAD;
        break;
      case APROBACION_OFERTA_TIPO_CODIGOS.APROB_GER:
        permisoRequerido = PERMISOS.OFERTA_APROBAR_GERENCIA;
        break;
      case APROBACION_OFERTA_TIPO_CODIGOS.APROB_ADM:
        permisoRequerido = PERMISOS.OFERTA_APROBAR_ADMINISTRACION;
        break;
      default:
        return false;
    }

    return permissions.some(
      (permission) => permission?.codigo === permisoRequerido
    );
  };

  return (
    <>
      <Card className="w-full mb-3">
        <CardContent className="py-3">
          <div className="flex items-top pt-2 justify-between gap-8">
            {aprobaciones.map((aprobacion, index) => (
              <div
                key={aprobacion.id}
                className="flex flex-col items-center gap-1"
              >
                {/* Círculo del paso */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                    getStepColor(aprobacion.estado)
                  )}
                >
                  {getStepIcon(aprobacion.estado)}
                </div>

                {/* Información del paso */}
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700">
                    {aprobacion.ofertaAprobacionTipo?.nombre ||
                      `Aprobación ${index + 1}`}
                  </p>

                  {/* Información del aprobador */}
                  {aprobacion.aprobador && (
                    <div className="mt-0.5">
                      <p className="text-xs text-gray-500">
                        {aprobacion.aprobador.nombre}
                      </p>
                      {aprobacion.fechaAprobacion && (
                        <p className="text-[10px] text-gray-400">
                          {formatTime(aprobacion.fechaAprobacion)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Botones de acción para pendientes - Solo iconos */}
                  {aprobacion.estado === "PENDIENTE" &&
                    tienePermisoParaAprobar(aprobacion) && (
                      <div className="flex gap-1 mt-1 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleAprobar(aprobacion)}
                          title="Aprobar"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRechazar(aprobacion)}
                          title="Rechazar"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                  {/* Motivo directo */}
                  {aprobacion.motivo && (
                    <p
                      className="text-[10px] text-gray-500 italic mt-0.5 max-w-[150px] truncate"
                      title={aprobacion.motivo}
                    >
                      {aprobacion.motivo}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <OfertaAprobacionDialog
        open={open}
        setOpen={setOpen}
        aprobacion={selectedAprobacion}
        accion={accion}
        motivo={motivo}
        setMotivo={setMotivo}
      />
    </>
  );
}
