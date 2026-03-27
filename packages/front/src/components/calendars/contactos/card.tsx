"use client";

import React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Circle } from "lucide-react";
import { ContactoProximo, Contacto } from "@/types";
import { getTime } from "@/utils/date";

// Helper para obtener el icono dinámicamente
const getIconComponent = (iconName: string | null | undefined) => {
  if (!iconName) return Circle;

  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent =
    (LucideIcons as any)[iconKey] || (LucideIcons as any)[iconName] || Circle;

  return IconComponent;
};

interface CardProps {
  data: (ContactoProximo | Contacto) & { esProximo: boolean };
}

export function Card({ data }: CardProps) {
  // Color del icono: siempre del tipo de contacto
  const iconColor = data.tipo?.color || "#3b82f6";

  // Determinar icono
  const IconComponent = getIconComponent(data.tipo?.icono);

  // Colores sobrios de la tarjeta
  const cardClassName = data.esProximo
    ? "bg-blue-50 border-blue-200" // Próximos: azul claro
    : "bg-gray-50 border-gray-200"; // Históricos: gris

  return (
    <Link
      href={`/contacto-casos/?id=${data.casoId}`}
      className={`block p-2 sm:p-2.5 rounded-lg border hover:shadow-md transition-shadow ${cardClassName}`}
    >
      <div className="space-y-1">
        {/* Header con icono y cliente */}
        <div className="flex items-start gap-1.5 sm:gap-2">
          <IconComponent
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0"
            style={{ color: iconColor }}
          />
          {data.caso?.cliente && (
            <div className="font-semibold text-xs sm:text-sm truncate flex-1">
              {data.caso.cliente.nombre}
            </div>
          )}
        </div>

        {/* Hora */}
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
          {getTime(data.fecha)}
        </div>

        {/* Descripción (para contactos históricos) o Nota (para próximos) */}
        {data.esProximo
          ? data?.nota && (
              <div className="text-xs text-muted-foreground line-clamp-2">
                {data?.nota}
              </div>
            )
          : (data as Contacto).descripcion && (
              <div className="text-xs text-muted-foreground line-clamp-2">
                {(data as Contacto).descripcion}
              </div>
            )}

        {/* Vendedor */}
        {(data.esProximo ? data.vendedor : data.caso?.vendedor) && (
          <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
            <span className="font-medium">
              {(
                data.esProximo
                  ? data.vendedor?.nombre
                  : data.caso?.vendedor?.nombre
              )?.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
