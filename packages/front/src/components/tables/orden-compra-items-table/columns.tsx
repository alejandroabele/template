import { ColumnDef } from "@tanstack/react-table";
import { OrdenCompraItem } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import React from "react";
import { formatMoney } from "@/utils/number";
import { CellColumn } from "@/components/ui/cell-column";

export const columns: ColumnDef<OrdenCompraItem>[] = [
  {
    id: "expander",
    header: () => null,
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
    accessorKey: "inventario.sku",
    id: "codigo",
    header: "Código",
    cell: ({ row }) => (
      <CellColumn>{row.original.inventario?.sku || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "inventario.nombre",
    id: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <CellColumn>{row.original.inventario?.nombre || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "cantidad",
    id: "cantidad",
    header: "Cant.",
    cell: ({ row }) => <CellColumn>{row.original.cantidad || "-"}</CellColumn>,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "precio",
    id: "precioUnitario",
    header: "P. Unit.",
    cell: ({ row }) => (
      <CellColumn>
        {formatMoney(parseFloat(row.original.precio || "0"))}
      </CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "alicuota",
    id: "iva",
    header: "IVA %",
    cell: ({ row }) => <CellColumn>{row.original.alicuota || "-"}</CellColumn>,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      const cantidad = parseFloat(row.original.cantidad || "0");
      const precio = parseFloat(row.original.precio || "0");
      const subtotal = cantidad * precio;
      return (
        <CellColumn className="font-medium">{formatMoney(subtotal)}</CellColumn>
      );
    },
  },
];

export const ExpandedRowComponent = ({
  item,
  onEditItem,
  showEditButton,
}: {
  item: OrdenCompraItem;
  onEditItem: (item: OrdenCompraItem) => void;
  showEditButton: boolean;
}) => (
  <div className="space-y-3">
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">
        Observaciones
      </p>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm flex-1 whitespace-pre-wrap">
          {item.descripcion ? (
            <span>{item.descripcion}</span>
          ) : (
            <span className="text-muted-foreground italic">
              Sin observaciones
            </span>
          )}
        </p>
        {showEditButton && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEditItem(item)}
            className="flex-shrink-0"
          >
            <Edit className="h-4 w-4 mr-1" />
          </Button>
        )}
      </div>
    </div>
  </div>
);
