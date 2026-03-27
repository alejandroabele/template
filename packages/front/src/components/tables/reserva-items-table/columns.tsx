"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import { ReservaItem } from "@/types";

export const columns: ColumnDef<ReservaItem>[] = [
  {
    accessorFn: (row) => row.producto?.nombre,
    id: "producto",
    header: "Producto",
    cell: ({ row }) => (
      <CellColumn className="font-medium">
        {row.original.producto?.nombre}
      </CellColumn>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.producto?.sku,
    id: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <CellColumn className="text-muted-foreground font-mono text-xs">
        {row.original.producto?.sku}
      </CellColumn>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.cantidad,
    id: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => (
      <CellColumn className="tabular-nums font-medium ml-2">
        {row.original.cantidad}
      </CellColumn>
    ),
    enableSorting: false,
  },
  {
    id: "usado",
    header: "Usado",
    cell: ({ row }) => {
      // Cantidad usada calculada en el backend
      const cantidadUsada = row.original.cantidadUsada || 0;

      return (
        <CellColumn className="tabular-nums text-blue-600 font-medium ml-2">
          {cantidadUsada}
        </CellColumn>
      );
    },
    enableSorting: false,
  },
];
