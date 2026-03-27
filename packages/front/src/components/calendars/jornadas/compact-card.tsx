"use client";

import React from "react";
import { Jornada } from "@/types";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface CompactCardProps {
  data: Jornada;
  onClick?: (jornada: Jornada) => void;
}

export function CompactCard({ data, onClick }: CompactCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(data);
    }
  };

  // Colores según estado - con soporte para modo oscuro
  const cardClassName =
    data.cancelado === 1
      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700";

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 p-1 rounded text-[10px] cursor-pointer hover:opacity-80 transition-opacity border",
        cardClassName
      )}
    >
      {/* Badge del trabajo (si existe) */}
      {data.produccionTrabajo && (
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: data.produccionTrabajo.color || "#6b7280",
          }}
        />
      )}

      {/* Cantidad de personas */}
      <Users className="h-3 w-3 flex-shrink-0" />
      <span className="font-medium dark:text-gray-100">
        {data.jornadaPersonas?.length || 0}
      </span>

      {/* Info de la jornada */}
      <div className="truncate flex-1 dark:text-gray-100">
        OT {data.presupuestoId}{" "}
        <span className="dark:text-gray-300">
          {data.presupuesto?.cliente?.nombre}
        </span>
      </div>
    </div>
  );
}
