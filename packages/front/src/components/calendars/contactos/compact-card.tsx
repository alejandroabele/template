"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ContactoProximo, Contacto } from "@/types";
import { cn } from "@/lib/utils";

interface CompactCardProps {
  data: (ContactoProximo | Contacto) & { esProximo: boolean };
}

export function CompactCard({ data }: CompactCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/contacto-casos/?id=${data.casoId}`);
  };

  // Colores según tipo - consistente con Card
  const cardClassName = data.esProximo
    ? "bg-blue-50 border-blue-200" // Próximos: azul claro
    : "bg-gray-50 border-gray-200"; // Históricos: gris

  // Color del tipo de contacto
  const iconColor = data.tipo?.color || "#3b82f6";

  // Obtener vendedor
  const vendedor = data.esProximo ? data.vendedor : data.caso?.vendedor;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 p-1 rounded text-[10px] hover:opacity-80 transition-opacity border cursor-pointer",
        cardClassName
      )}
    >
      {/* Indicador de tipo de contacto */}
      {data.tipo && (
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: iconColor,
          }}
        />
      )}

      {/* Vendedor y Cliente */}
      <div className="truncate font-medium flex-1">
        {vendedor?.nombre && <>{vendedor.nombre} - </>}
        {data.caso?.cliente?.nombre}
      </div>
    </div>
  );
}
