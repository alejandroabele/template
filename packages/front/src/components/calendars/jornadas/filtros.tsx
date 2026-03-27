"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PersonaSelector } from "@/components/selectors/persona-selector";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { PresupuestoSelector } from "@/components/selectors/presupuesto-selector";
import { ProduccionTrabajoSelector } from "@/components/selectors/produccion-trabajo-selector";

interface FiltrosProps {
  filtroPersonaId?: number;
  filtroClienteId?: number;
  filtroPresupuestoId?: number;
  filtroTrabajoId?: number;
  onFiltroPersonaChange?: (personaId: number | undefined) => void;
  onFiltroClienteChange?: (clienteId: number | undefined) => void;
  onFiltroPresupuestoChange?: (presupuestoId: number | undefined) => void;
  onFiltroTrabajoChange?: (trabajoId: number | undefined) => void;
}

export function Filtros({
  filtroPersonaId,
  filtroClienteId,
  filtroPresupuestoId,
  filtroTrabajoId,
  onFiltroPersonaChange,
  onFiltroClienteChange,
  onFiltroPresupuestoChange,
  onFiltroTrabajoChange,
}: FiltrosProps) {
  const hayFiltrosActivos =
    filtroPersonaId ||
    filtroClienteId ||
    filtroPresupuestoId ||
    filtroTrabajoId;

  return (
    <div className="bg-muted/50 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        {/* Grid de filtros */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          <PersonaSelector
            value={filtroPersonaId}
            onValueChange={(value) => onFiltroPersonaChange?.(value)}
            placeholder="Filtrar por persona..."
          />

          <ClienteSelector
            value={
              filtroClienteId
                ? {
                    id: filtroClienteId,
                    nombre: "",
                    email: "",
                    direccion: "",
                    ciudad: "",
                    codigoPostal: "",
                    telefono: "",
                    contacto: "",
                    razonSocial: "",
                    cuit: "",
                    direccionFiscal: "",
                    telefonoContacto: "",
                    formaDePago: "",
                  }
                : undefined
            }
            onChange={(cliente) => onFiltroClienteChange?.(cliente?.id)}
          />

          <PresupuestoSelector
            selectedResult={
              filtroPresupuestoId
                ? {
                    id: filtroPresupuestoId,
                    descripcionCorta: `#${filtroPresupuestoId}`,
                  }
                : undefined
            }
            onSelectResult={(result) => onFiltroPresupuestoChange?.(result?.id)}
          />

          <ProduccionTrabajoSelector
            value={filtroTrabajoId ? String(filtroTrabajoId) : ""}
            onChange={(value) =>
              onFiltroTrabajoChange?.(value ? Number(value) : undefined)
            }
          />
        </div>

        {/* Botón para limpiar filtros */}
        <Button
          onClick={() => {
            onFiltroPersonaChange?.(undefined);
            onFiltroClienteChange?.(undefined);
            onFiltroPresupuestoChange?.(undefined);
            onFiltroTrabajoChange?.(undefined);
          }}
          size="sm"
          variant="ghost"
          className="shrink-0"
          disabled={!hayFiltrosActivos}
        >
          <X className="h-4 w-4 mr-1.5" />
          Limpiar
        </Button>
      </div>
    </div>
  );
}
