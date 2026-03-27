"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import { formatTime } from "@/utils/date";
import { formatMoney } from "@/utils/number";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type PrecioHistorial = {
  id: number;
  inventarioId: number;
  ordenCompraId: number | null;
  ordenCompra?: {
    id: number;
    oferta?: {
      proveedor?: {
        id: number;
        razonSocial: string;
        nombreFantasia?: string;
      };
    };
  } | null;
  precioUnitario: string;
  motivo: string | null;
  createdAt: string;
  createdByUser?: { nombre: string; apellido: string } | null;
};

export const columns: ColumnDef<PrecioHistorial>[] = [
  {
    accessorKey: "createdAt",
    enableColumnFilter: false,
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>{formatTime(row.getValue("createdAt"))}</CellColumn>
    ),
  },
  {
    accessorKey: "precioUnitario",
    header: "Precio unitario",
    enableColumnFilter: false,

    cell: ({ row }) => (
      <CellColumn>
        {formatMoney(parseFloat(row.getValue("precioUnitario") || "0"))}
      </CellColumn>
    ),
  },
  {
    id: "proveedor",
    header: "Proveedor",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const proveedor = row.original.ordenCompra?.oferta?.proveedor;
      const ordenCompraId = row.original.ordenCompraId;

      if (!proveedor) return <CellColumn>-</CellColumn>;

      const nombre = proveedor.nombreFantasia
        ? `${proveedor.razonSocial} (${proveedor.nombreFantasia})`
        : proveedor.razonSocial;

      return (
        <CellColumn>
          <Link
            href={`/orden-compra/${ordenCompraId}`}
            className="text-blue-600 hover:underline"
          >
            {nombre}
          </Link>
        </CellColumn>
      );
    },
  },
  {
    id: "origen",
    header: "Origen",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const ordenCompraId = row.original.ordenCompraId;
      if (ordenCompraId) {
        return (
          <CellColumn>
            <Link href={`/orden-compra/${ordenCompraId}`}>
              <Badge variant="outline" className="bg-blue-50">
                OC-{ordenCompraId}
              </Badge>
            </Link>
          </CellColumn>
        );
      }
      return (
        <CellColumn>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
            Manual
          </Badge>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const motivo = row.original.motivo;
      return (
        <CellColumn>
          {motivo ? (
            motivo
          ) : (
            <span className="text-muted-foreground italic text-xs">
              Ingreso automático
            </span>
          )}
        </CellColumn>
      );
    },
  },
];
