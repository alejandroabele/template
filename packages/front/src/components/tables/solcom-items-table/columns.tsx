"use client";

import type { ColumnDef, Table as TableType } from "@tanstack/react-table";
import React from "react";
import { CellColumn } from "@/components/ui/cell-column";
import { SolcomItem } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getColorFromString } from "@/utils/color-hash";
import { EstadoSolcomSelector } from "@/components/selectors/estado-solcom-selector";
import Link from "next/link";
import { formatDate } from "@/utils/date";
const baseUrl = "solcom";

export const columns: ColumnDef<SolcomItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <CellColumn>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      </CellColumn>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.solcom?.id,
    id: "solcomId",
    accessorKey: "solcomId",
    header: "SOLCOM",
    cell: ({ row }) => {
      const solcomId = row.original.solcom?.id;
      return (
        <CellColumn>
          <Link href={`/${baseUrl}/${solcomId}`}># {solcomId}</Link>
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.inventario?.nombre,
    id: "inventario.nombre",
    header: "Producto",
    cell: ({ row }) => {
      const inventario = row.original.inventario;
      return (
        <CellColumn>
          <span className="font-medium">{inventario?.nombre || "N/A"}</span>
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row.inventario?.punit,
    id: "inventario.punit",
    header: "Último Precio",
    cell: ({ row }) => {
      const inventario = row.original.inventario;
      const precio = inventario?.punit || 0;
      return (
        <CellColumn>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(precio)}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.inventarioConversion,
    id: "presentacion",
    accessorKey: "inventarioConversion",
    header: "Presentación",
    cell: ({ row }) => {
      const inventarioConversion = row.original.inventarioConversion;
      const inventario = row.original.inventario;

      let presentacion = inventario?.unidadMedida || "N/A";

      if (inventarioConversion) {
        presentacion = `${inventarioConversion.cantidad} ${inventarioConversion.unidadDestino}`;
      }

      return <CellColumn>{presentacion}</CellColumn>;
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.cantidad,
    id: "cantidad",
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => {
      const cantidad = row.getValue("cantidad") as string;
      return (
        <CellColumn className="font-medium">{cantidad || "N/A"}</CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.comprador?.nombre,
    id: "comprador.nombre",
    header: "Comprador",
    cell: ({ row }) => {
      const comprador = row.original.comprador;
      return (
        <CellColumn>
          {comprador?.nombre ? (
            <Badge
              className={getColorFromString(comprador.nombre)}
              variant="outline"
            >
              {comprador.nombre}
            </Badge>
          ) : (
            "Sin asignar"
          )}
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row.solcom?.estado?.id,
    id: "solcom.estado.id",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.solcom?.estado;
      return <CellColumn>{estado?.nombre || "N/A"}</CellColumn>;
    },
    meta: {
      customFilter: (table: TableType<SolcomItem>) => {
        const estadoId = table
          .getColumn("solcom.estado.id")
          ?.getFilterValue() as string;
        return (
          <EstadoSolcomSelector
            value={estadoId}
            onChange={(value) => {
              table.getColumn("solcom.estado.id")?.setFilterValue(value);
            }}
            placeholder="Filtrar por estado"
          />
        );
      },
    },
  },
  {
    accessorFn: (row) => row.solcom?.fechaLimite,
    id: "solcom.fechaLimite",
    header: "Fecha Límite",
    cell: ({ row }) => {
      const fechaLimite = row.original.solcom?.fechaLimite;
      if (!fechaLimite) {
        return <CellColumn>N/A</CellColumn>;
      }

      return <CellColumn>{formatDate(fechaLimite)}</CellColumn>;
    },
    enableColumnFilter: false,
  },
  {
    id: "ordenesCompra",
    header: "OCs",
    cell: ({ row }) => {
      const ofertaItems = row.original.ofertaItems || [];
      const ordenesCompra = ofertaItems
        .map((ofertaItem) => ofertaItem.oferta?.ordenCompra)
        .filter(Boolean);

      if (ordenesCompra.length === 0) {
        return (
          <CellColumn>
            <span className="text-xs text-gray-500">Sin OCs</span>
          </CellColumn>
        );
      }

      return (
        <CellColumn>
          <div className="space-y-1">
            {ordenesCompra.map((oc, key) => (
              <a
                key={`${oc!.id}-${key}`}
                href={`/orden-compra/${oc!.id}`}
                className="block text-xs text-blue-600 hover:text-blue-800"
              >
                OC #{oc!.id} - {oc!.estado?.nombre || "N/A"}
              </a>
            ))}
          </div>
        </CellColumn>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];
