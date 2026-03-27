"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Persona, JornadaPersona } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDownloadArchivoByIdQuery } from "@/hooks/archivo";
import Link from "next/link";

export type PersonaConEstado = Persona & {
  asignacionesHoy: JornadaPersona[];
};

function FotoTooltip({ persona }: { persona: PersonaConEstado }) {
  const fotoId = persona.fotoArchivo?.id;
  const { data: blob } = useDownloadArchivoByIdQuery(fotoId);
  const fotoUrl = useMemo(
    () => (blob instanceof Blob ? URL.createObjectURL(blob) : undefined),
    [blob]
  );
  const iniciales = `${persona.nombre?.[0] ?? ""}${persona.apellido?.[0] ?? ""}`.toUpperCase();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/personas/${persona.id}`}
            className="font-medium hover:underline"
          >
            {persona.apellido}, {persona.nombre}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="p-2">
          <Avatar className="h-24 w-24">
            {fotoUrl && <AvatarImage src={fotoUrl} alt={iniciales} />}
            <AvatarFallback className="text-xl">{iniciales}</AvatarFallback>
          </Avatar>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const columns: ColumnDef<PersonaConEstado>[] = [
  {
    accessorFn: (row) => `${row.apellido} ${row.nombre}`,
    id: "nombre",
    accessorKey: "nombre",
    header: "Persona",
    cell: ({ row }) => (
      <CellColumn>
        <FotoTooltip persona={row.original} />
      </CellColumn>
    ),
  },
  {
    accessorFn: (row) => row.asignacionesHoy.length > 0,
    id: "estado",
    accessorKey: "estado",
    header: "Estado",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const trabaja = row.original.asignacionesHoy.length > 0;
      return (
        <CellColumn>
          {trabaja ? (
            <Badge className="bg-green-100 hover:bg-green-100 text-green-800 dark:bg-green-900 dark:hover:bg-green-900 dark:text-green-200 border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 inline-block" />
              Trabajando
            </Badge>
          ) : (
            <Badge className="bg-red-100 hover:bg-red-100 text-red-800 dark:bg-red-900 dark:hover:bg-red-900 dark:text-red-200 border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 inline-block" />
              Sin asignación
            </Badge>
          )}
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row.asignacionesHoy,
    id: "trabajos",
    accessorKey: "trabajos",
    header: "Trabajos",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const asignaciones = row.original.asignacionesHoy;
      if (asignaciones.length === 0) {
        return <CellColumn>—</CellColumn>;
      }
      return (
        <CellColumn>
          <div className="flex flex-wrap gap-1">
            {asignaciones.map((jp) => {
              const otId = jp.jornada?.presupuestoId;
              const partes = [
                otId ? `OT #${otId}` : null,
                jp.produccionTrabajo?.nombre ?? null,
                jp.jornada?.detalle ?? null,
              ].filter(Boolean).join(" · ");
              const label = partes || "—";
              const chip = (
                <span
                  key={jp.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {label}
                </span>
              );
              return otId ? (
                <Link key={jp.id} href={`/presupuestos/${otId}`}>
                  {chip}
                </Link>
              ) : chip;
            })}
          </div>
        </CellColumn>
      );
    },
  },
];
