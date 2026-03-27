"use client";

import React from "react";
import { ContactoCaso } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/ui/icon";
import { formatTime } from "@/utils/date";
import { isFuture } from "date-fns";

interface Props {
  data: ContactoCaso;
}

export function Item({ data }: Props) {
  const proximoContacto = data?.contactosProximos?.find(
    (c) => c.fecha && isFuture(c.fecha)
  );

  // Calcular días restantes para el próximo contacto
  const getDiasRestantes = (fecha?: string) => {
    if (!fecha) return null;

    const today = new Date();
    const target = new Date(fecha);

    // Normalizar a medianoche para evitar problemas de horas
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const diasRestantes = getDiasRestantes(proximoContacto?.fecha);
  const iconoColor = proximoContacto?.tipo?.color;
  return (
    <div className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{data.titulo}</h4>
          {data.nombreContacto && (
            <p className="text-xs text-muted-foreground mt-1">
              {data.nombreContacto}
            </p>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          #{data.id}
        </Badge>
      </div>

      {data.cliente?.razonSocial && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Cliente:</span>
          <span className="text-xs">{data.cliente.razonSocial}</span>
        </div>
      )}

      {data.emailContacto && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Email:</span>
          <span className="text-xs">{data.emailContacto}</span>
        </div>
      )}

      {data.telefonoContacto && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Teléfono:</span>
          <span className="text-xs">{data.telefonoContacto}</span>
        </div>
      )}

      {proximoContacto && proximoContacto.fecha && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t text-xs">
          <DynamicIcon
            name={proximoContacto.tipo?.icono}
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: iconoColor }}
          />
          <span className="font-medium" style={{ color: iconoColor }}>
            {diasRestantes !== null &&
              (diasRestantes < 0
                ? `Vencido hace ${Math.abs(diasRestantes)} días`
                : diasRestantes === 0
                  ? "Hoy"
                  : `En ${diasRestantes} días`)}
          </span>
          <span className="text-muted-foreground">
            - {formatTime(proximoContacto.fecha)}
          </span>
        </div>
      )}
    </div>
  );
}
