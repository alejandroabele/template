"use client";

import React from "react";
import { Jornada } from "@/types";
import { Users, Truck, Wrench } from "lucide-react";
import Link from "next/link";

interface CardProps {
  data: Jornada;
  presupuestoId?: number;
  onClick?: (jornada: Jornada) => void;
}

export function Card({ data, onClick }: CardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(data);
    }
  };

  // Colores según estado y tipo - con soporte para modo oscuro
  const getCardClassName = () => {
    // Prioridad: cancelado
    if (data.cancelado === 1) {
      return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
    }

    // Discriminación por tipo de jornada
    if (data.tipo === "servicio") {
      return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
    }

    if (data.tipo === "producto") {
      return "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800";
    }

    // Default
    return "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700";
  };

  const cardClassName = getCardClassName();

  const cantidadFlota = React.useMemo(() => {
    return data.jornadaFlotas?.length ?? 0;
  }, [data.jornadaFlotas]);

  const cantidadEquipamiento = React.useMemo(() => {
    return data.jornadaEquipamientos?.length ?? 0;
  }, [data.jornadaEquipamientos]);

  return (
    <div
      onClick={handleClick}
      className={`block p-2 sm:p-2.5 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${cardClassName}`}
    >
      <div className="space-y-1">
        {/* Header: Presupuesto */}
        <div className="flex items-center justify-between gap-2">
          {data.presupuestoId && (
            <Link
              href={`/presupuestos/${data.presupuestoId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-primary hover:underline"
            >
              OT #{data.presupuestoId}
            </Link>
          )}
        </div>

        {/* Cantidad de personas */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            {data.jornadaPersonas && data.jornadaPersonas.length > 0
              ? `${data.jornadaPersonas.length} persona${data.jornadaPersonas.length > 1 ? "s" : ""}`
              : "Sin asignar"}
          </span>
        </div>

        {/* Flota y equipamiento */}
        {(cantidadFlota > 0 || cantidadEquipamiento > 0) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {cantidadFlota > 0 && (
              <div className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                <span>{cantidadFlota}</span>
              </div>
            )}
            {cantidadEquipamiento > 0 && (
              <div className="flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5" />
                <span>{cantidadEquipamiento}</span>
              </div>
            )}
          </div>
        )}

        {/* Cliente */}
        {data.presupuesto?.cliente && (
          <div className="text-xs text-muted-foreground">
            {data.presupuesto.cliente.nombre ||
              data.presupuesto.cliente.razonSocial}
          </div>
        )}
      </div>
    </div>
  );
}
