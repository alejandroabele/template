"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Presupuesto } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";

const baseUrl = "presupuestos";

export const columns: ColumnDef<Presupuesto>[] = [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "N°",
    cell: ({ row }) => (
      <Link href={`/${baseUrl}/${row.original.id}`}>
        <CellColumn className="font-semibold text-primary hover:underline">
          #{row.getValue("id")}
        </CellColumn>
      </Link>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.fecha,
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.original.fecha) || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.descripcionCorta,
    id: "descripcionCorta",
    accessorKey: "descripcionCorta",
    header: "Descripción",
    cell: ({ row }) => (
      <CellColumn>
        <div className="max-w-[300px] truncate">
          {row.getValue("descripcionCorta") || "-"}
        </div>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.procesoGeneral?.nombre,
    id: "procesoGeneral.nombre",
    accessorKey: "procesoGeneral.nombre",
    header: "Proceso",
    cell: ({ row }) => {
      const proceso = row.original.procesoGeneral;
      if (!proceso) return <CellColumn>-</CellColumn>;

      return (
        <CellColumn>
          <Badge
            style={{
              backgroundColor: proceso.color || "#3b82f6",
              color: "white",
            }}
            className=" justify-center text-center"
          >
            {proceso.nombre}
          </Badge>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
];
