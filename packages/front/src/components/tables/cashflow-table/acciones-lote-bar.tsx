"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar, Check } from "lucide-react";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { formatMoney } from "@/utils/number";

interface AccionesLoteBarProps {
  cantidadSeleccionadas: number;
  cantidadConciliables: number;
  montoTotal: number;
  onCambiarFecha: () => void;
  onConciliar: () => void;
  onCancelar: () => void;
  simulacionId?: number;
}

export const AccionesLoteBar: React.FC<AccionesLoteBarProps> = ({
  cantidadSeleccionadas,
  cantidadConciliables,
  montoTotal,
  onCambiarFecha,
  onConciliar,
  onCancelar,
  simulacionId,
}) => {
  const canConciliar = hasPermission(PERMISOS.CASHFLOW_CONCILIAR);

  if (cantidadSeleccionadas === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border shadow-lg rounded-lg px-6 py-4 flex items-center gap-4">
        <span className="font-medium text-foreground">
          {cantidadSeleccionadas} - {formatMoney(montoTotal)}
        </span>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onCambiarFecha}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Cambiar fecha
          </Button>
          {!simulacionId && canConciliar && (
            <Button
              variant="secondary"
              size="sm"
              disabled={cantidadConciliables === 0}
              onClick={onConciliar}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Conciliar ({cantidadConciliables})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelar}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
