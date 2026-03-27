"use client";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { Wrench } from "lucide-react";
import { AlquilerRecurso } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { Currency } from "@/components/ui/currency";
import { SelectFilter } from "@/components/select-filter";
import { EstadoBadge } from "@/components/estado-badget";
import { Badge } from "@/components/ui/badge";

const baseUrl = "recursos";

export const columns: ColumnDef<AlquilerRecurso>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <CellColumn> {row.getValue("id")} </CellColumn>,
  },
  {
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        <> {row.getValue("codigo")} </>
      </Link>
    ),
  },
  {
    accessorKey: "proveedor",
    header: "Proveedor",
    cell: ({ row }) => <CellColumn> {row.getValue("proveedor")} </CellColumn>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    meta: {
      customFilter: (table: TableType<AlquilerRecurso>) => (
        <SelectFilter table={table} columnId="estado" type="recurso" />
      ),
    },
    enableSorting: false,
    cell: ({ row }) => (
      <CellColumn>
        <div className="flex items-center gap-2">
          <EstadoBadge estado={row.getValue("estado")} />
          {row.original.otActivaId != null && (
            <Badge className="bg-orange-500 flex items-center gap-1 w-fit">
              <Wrench className="h-3 w-3" />
              #{row.original.otActivaId}
            </Badge>
          )}
        </div>
      </CellColumn>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <CellColumn> {row.getValue("tipo")} </CellColumn>,
  },
  {
    accessorKey: "precio",
    header: "Precio mensual del recurso",
    meta: {
      filterVariant: "range",
    },
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        <Currency>{row.getValue("precio")}</Currency>{" "}
      </Link>
    ),
  },
];
