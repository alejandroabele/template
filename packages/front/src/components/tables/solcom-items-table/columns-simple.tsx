"use client";

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { CellColumn } from "@/components/ui/cell-column";
import { SolcomItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getColorFromString } from "@/utils/color-hash";

// Columnas simplificadas para cuando se usa como subcomponente dentro de la tabla de SOLCOMs
// No incluye: checkbox select, ID item, SOLCOM ID, Estado SOLCOM (ya se muestran en la fila padre)
export const columnsSimple: ColumnDef<SolcomItem>[] = [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.inventario?.nombre,
    id: "inventario",
    accessorKey: "inventario.nombre",
    header: "Producto",
    cell: ({ row }) => {
      const inventario = row.original.inventario;
      return (
        <CellColumn>
          <span className="font-medium">{inventario?.nombre || "N/A"}</span>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.inventario?.punit,
    id: "precio",
    accessorKey: "inventario.punit",
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
    enableSorting: false,
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
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.comprador?.nombre,
    id: "comprador",
    accessorKey: "comprador.nombre",
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
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "ordenesCompra",
    header: "OCs",
    cell: ({ row }) => {
      const ofertaItems = row.original.ofertaItems || [];
      const ordenesCompra = ofertaItems
        .map(ofertaItem => ofertaItem.oferta?.ordenCompra)
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
            {ordenesCompra.map((oc) => (
              <a
                key={oc!.id}
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
