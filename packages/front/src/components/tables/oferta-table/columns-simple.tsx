"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/utils/number";
import type { Oferta } from "@/types";
import { ESTADO_OFERTA_CODIGOS } from "@/constants/compras";
import { Checkbox } from "@/components/ui/checkbox";

const baseUrl = "/ofertas";

function isRechazada(ctx: CellContext<Oferta, unknown>) {
  return ctx.row.original.estado?.codigo === ESTADO_OFERTA_CODIGOS.OF_RECHAZADA;
}

function rowClass(ctx: CellContext<Oferta, unknown>) {
  if (isRechazada(ctx)) return "opacity-50";
  return "";
}

export const columnsSimple: ColumnDef<Oferta>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "Oferta",
    cell: (ctx) => {
      const { color, favorito, id } = ctx.row.original;
      return (
        <div className={rowClass(ctx)}>
          <Link
            className="flex items-center gap-2 hover:underline"
            href={`${baseUrl}/${id}`}
          >
            <span className="font-medium">#{id}</span>
            {favorito && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            )}
            {color && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 ring-1 ring-gray-300"
                style={{ backgroundColor: color }}
              />
            )}
          </Link>
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "estado",
    accessorKey: "estadoId",
    header: "Estado",
    cell: (ctx) => {
      const estado = ctx.row.original.estado;
      return (
        <CellColumn className={rowClass(ctx)}>
          {estado ? <Badge variant="outline">{estado.nombre}</Badge> : "N/A"}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "aprobaciones",
    header: "Aprobaciones",
    cell: (ctx) => {
      const aprobaciones = ctx.row.original.aprobaciones || [];
      const ordenCompra = ctx.row.original.ordenCompra;

      const pendientes = aprobaciones.filter(
        (a) => a.estado === "PENDIENTE"
      ).length;
      const aprobadas = aprobaciones.filter(
        (a) => a.estado === "APROBADO"
      ).length;
      const rechazadas = aprobaciones.filter(
        (a) => a.estado === "RECHAZADO"
      ).length;

      const total = aprobaciones.length;
      const todasAprobadas = total > 0 && aprobadas === total;
      const listaParaAprobar = todasAprobadas && !ordenCompra;

      if (total === 0) {
        return (
          <CellColumn className={rowClass(ctx)}>
            <span className="text-xs text-gray-400">Sin aprobaciones</span>
          </CellColumn>
        );
      }

      return (
        <CellColumn className={rowClass(ctx)}>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-0.5 h-2 w-20 rounded-full overflow-hidden bg-gray-200">
              {aprobadas > 0 && (
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(aprobadas / total) * 100}%` }}
                  title={`${aprobadas} aprobada${aprobadas > 1 ? "s" : ""}`}
                />
              )}
              {rechazadas > 0 && (
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${(rechazadas / total) * 100}%` }}
                  title={`${rechazadas} rechazada${rechazadas > 1 ? "s" : ""}`}
                />
              )}
              {pendientes > 0 && (
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${(pendientes / total) * 100}%` }}
                  title={`${pendientes} pendiente${pendientes > 1 ? "s" : ""}`}
                />
              )}
            </div>

            <div className="flex gap-2 text-xs">
              {aprobadas > 0 && (
                <span className="flex items-center gap-0.5 text-green-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {aprobadas}
                </span>
              )}
              {rechazadas > 0 && (
                <span className="flex items-center gap-0.5 text-red-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {rechazadas}
                </span>
              )}
              {pendientes > 0 && (
                <span className="flex items-center gap-0.5 text-blue-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {pendientes}
                </span>
              )}
            </div>
          </div>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "proveedor",
    accessorKey: "proveedor.razonSocial",
    header: "Proveedor",
    cell: (ctx) => {
      const proveedor = ctx.row.original.proveedor;
      return (
        <CellColumn className={rowClass(ctx)}>
          {proveedor?.razonSocial || "N/A"}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.montoTotal,
    id: "montoTotal",
    accessorKey: "montoTotal",
    header: "Monto Total",
    cell: (ctx) => {
      const montoTotal = ctx.row.original.montoTotal;
      return (
        <CellColumn className={rowClass(ctx)}>
          {formatMoney(montoTotal || 0)}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "ordenCompra",
    header: "OC",
    cell: (ctx) => {
      const ordenCompra = ctx.row.original.ordenCompra;
      if (!ordenCompra) {
        return (
          <CellColumn className={rowClass(ctx)}>
            <span className="text-xs text-gray-500">Sin OC</span>
          </CellColumn>
        );
      }
      return (
        <CellColumn className={rowClass(ctx)}>
          <Link
            href={`/orden-compra/${ordenCompra.id}`}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            OC #{ordenCompra.id}
          </Link>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
];
