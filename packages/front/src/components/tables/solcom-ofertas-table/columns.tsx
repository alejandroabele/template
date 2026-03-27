"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Solcom } from "@/types";
import { formatDate } from "@/utils/date";

function getOfertaIds(solcom: Solcom): number[] {
  const ids = new Set<number>();
  (solcom.items || []).forEach((item) => {
    (item.ofertaItems || []).forEach((oi) => {
      if (oi.oferta?.id) ids.add(oi.oferta.id);
    });
  });
  return Array.from(ids);
}

export const columns: ColumnDef<Solcom>[] = [
  {
    id: "expander",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-8 w-8"
        onClick={() =>
          table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())
        }
      >
        {table.getIsAllRowsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => row.toggleExpanded()}
        className="p-0 h-8 w-8"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "id",
    header: "SOLCOM",
    cell: ({ row }) => (
      <Link
        href={`/solcom/${row.getValue("id")}`}
        className="font-medium hover:underline"
      >
        <CellColumn>#{row.getValue("id")}</CellColumn>
      </Link>
    ),
  },
  {
    id: "centro.nombre",
    accessorFn: (row) => row.centro?.nombre,
    header: "Centro Costo",
    cell: ({ row }) => {
      const centro = row.original.centro;
      return <CellColumn>{centro?.nombre || "N/A"}</CellColumn>;
    },
  },
  {
    id: "presupuesto.id",
    accessorFn: (row) => row.presupuesto?.id,
    header: "OT",
    cell: ({ row }) => {
      const presupuesto = row.original.presupuesto;
      return presupuesto ? (
        <Link
          href={`/presupuestos/${presupuesto.id}`}
          className="hover:underline"
        >
          <CellColumn>#{presupuesto.id}</CellColumn>
        </Link>
      ) : (
        <CellColumn>N/A</CellColumn>
      );
    },
  },
  {
    id: "usuarioSolicitante.nombre",
    accessorFn: (row) => row.usuarioSolicitante?.nombre,
    header: "Solicitante",
    cell: ({ row }) => {
      const usuario = row.original.usuarioSolicitante;
      return <CellColumn>{usuario?.nombre || "N/A"}</CellColumn>;
    },
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>
        {formatDate(row.getValue("fechaCreacion")) || "N/A"}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    id: "ofertas",
    header: "Ofertas",
    cell: ({ row }) => {
      const count = getOfertaIds(row.original).length;
      return (
        <CellColumn>
          <Badge
            variant={count > 0 ? "secondary" : "outline"}
            className="text-xs"
          >
            {count} oferta{count !== 1 ? "s" : ""}
          </Badge>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
];
