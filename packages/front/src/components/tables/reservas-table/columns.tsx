"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteReservaMutation } from "@/hooks/reserva";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import { Reserva } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const baseUrl = "reservas";

const DataTableRowActions = ({ data }: { data: Reserva }) => {
  const { mutate } = useDeleteReservaMutation();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <Link href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem>Ver detalle</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => mutate(data.id!)}
          className="text-red-600"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Reserva>[] = [
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
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "N° Reserva",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.original.id}`}>
        <CellColumn>
          <Badge variant="outline" className="font-mono">
            #{row.getValue("id")}
          </Badge>
        </CellColumn>
      </Link>
    ),
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.fecha,
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha") as string;
      return (
        <CellColumn>
          {fecha
            ? format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es })
            : "-"}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.presupuesto?.id,
    id: "presupuestoId",
    header: "OT",
    cell: ({ row }) => (
      <CellColumn>{row.original.presupuesto?.id ? `#${row.original.presupuesto.id}` : "-"}</CellColumn>
    ),
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.trabajo?.nombre,
    id: "trabajo.nombre",
    header: "Trabajo",
    cell: ({ row }) => (
      <CellColumn>{row.original.trabajo?.nombre || "-"}</CellColumn>
    ),
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.items?.length || 0,
    id: "cantidadItems",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const totalCantidad = items.reduce(
        (acc, item) => acc + Number(item.cantidad),
        0
      );
      return (
        <CellColumn>
          <span className="font-medium">{items.length}</span>
          <span className="text-muted-foreground text-xs ml-1">
            ({totalCantidad} uds)
          </span>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.createdByUser?.nombre,
    id: "createdByUser.nombre",
    header: "Creado por",
    cell: ({ row }) => (
      <CellColumn>{row.original.createdByUser?.nombre || "-"}</CellColumn>
    ),
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.observaciones,
    id: "observaciones",
    accessorKey: "observaciones",
    header: "Observaciones",
    cell: ({ row }) => (
      <CellColumn className="max-w-[200px] truncate">
        {row.getValue("observaciones") || "-"}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    id: "acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
