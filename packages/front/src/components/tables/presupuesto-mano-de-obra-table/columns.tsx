"use client";

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { CellColumn } from "@/components/ui/cell-column";
import { formatCurrency } from "@/utils/number";
interface ManoDeObraAnalisis {
  productoId: number;
  producto: string;
  precioUnitario: number;
  cantidadCosteada: number;
  cantidadReal: number;
  diferencia: number;
  esExtra: boolean;
}

const formatNumber = (value: number, decimals = 2) => {
  return value.toFixed(decimals);
};

export const columns: ColumnDef<ManoDeObraAnalisis>[] = [
  {
    accessorKey: "producto",
    header: "Concepto",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const producto = row.getValue("producto") as string;

      return (
        <CellColumn>
          <span className="font-medium">{producto}</span>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "cantidadCosteada",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Horas Costeadas",
    cell: ({ row }) => {
      const cantidad = row.getValue("cantidadCosteada") as number;
      return <CellColumn className="">{formatNumber(cantidad)}</CellColumn>;
    },
  },
  {
    accessorKey: "precioUnitario",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Precio/Hora",
    cell: ({ row }) => {
      const precio = row.getValue("precioUnitario") as number;
      return (
        <CellColumn className=" text-muted-foreground">
          {formatCurrency(precio)}
        </CellColumn>
      );
    },
  },

  {
    id: "importeCosteado",
    header: "Imp. Costeado",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const cantidad = row.original.cantidadCosteada;
      const precio = row.original.precioUnitario;
      const importe = cantidad * precio;
      return <CellColumn className="">{formatCurrency(importe)}</CellColumn>;
    },
  },
  {
    accessorKey: "cantidadReal",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Horas Reales",
    cell: ({ row }) => {
      const cantidad = row.getValue("cantidadReal") as number;
      return (
        <CellColumn className=" font-medium">
          {formatNumber(cantidad)}
        </CellColumn>
      );
    },
  },
  {
    id: "importeReal",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Imp. Real",
    cell: ({ row }) => {
      const cantidad = row.original.cantidadReal;
      const precio = row.original.precioUnitario;
      const importe = cantidad * precio;
      return (
        <CellColumn className=" font-medium">
          {formatCurrency(importe)}
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "diferencia",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Diferencia",
    cell: ({ row }) => {
      const diferencia = row.getValue("diferencia") as number;
      return (
        <CellColumn className="">
          <span
            className={
              diferencia > 0
                ? "text-red-600 font-semibold"
                : diferencia < 0
                  ? "text-green-600 font-semibold"
                  : ""
            }
          >
            {diferencia > 0 ? "+" : ""}
            {formatNumber(diferencia)} hs
          </span>
        </CellColumn>
      );
    },
  },
  {
    id: "diferenciaImporte",
    enableColumnFilter: false,
    enableSorting: false,
    header: "Dif. Importe",
    cell: ({ row }) => {
      const diferencia = row.original.diferencia;
      const precio = row.original.precioUnitario;
      const diferenciaImporte = diferencia * precio;
      return (
        <CellColumn className="">
          <span
            className={
              diferenciaImporte > 0
                ? "text-red-600 font-semibold"
                : diferenciaImporte < 0
                  ? "text-green-600 font-semibold"
                  : ""
            }
          >
            {diferenciaImporte > 0 ? "+" : ""}
            {formatCurrency(Math.abs(diferenciaImporte))}
          </span>
        </CellColumn>
      );
    },
  },
];
