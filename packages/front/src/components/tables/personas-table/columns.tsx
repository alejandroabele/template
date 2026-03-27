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
import { CellColumn } from "@/components/ui/cell-column";
import { useDeletePersonaMutation } from "@/hooks/persona";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Persona } from "@/types";
import Link from "next/link";
import { formatDate } from "@/utils/date";
const baseUrl = "personas";

const DataTableRowActions = ({ data }: { data: Persona }) => {
  const { mutate } = useDeletePersonaMutation();
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
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate(data.id)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Persona>[] = [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.original.id}`}>
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.nombre,
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <CellColumn>{row.getValue("nombre")}</CellColumn>,
  },
  {
    accessorFn: (row) => row.apellido,
    id: "apellido",
    accessorKey: "apellido",
    header: "Apellido",
    cell: ({ row }) => <CellColumn>{row.getValue("apellido")}</CellColumn>,
  },
  {
    accessorFn: (row) => row.dni,
    id: "dni",
    accessorKey: "dni",
    header: "DNI",
    cell: ({ row }) => <CellColumn>{row.getValue("dni")}</CellColumn>,
  },
  {
    accessorFn: (row) => row.fechaNacimiento,
    id: "fechaNacimiento",
    accessorKey: "fechaNacimiento",
    header: "Fecha de Nacimiento",
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.getValue("fechaNacimiento"))}</CellColumn>
    ),
    enableColumnFilter: true,
    meta: {
      filterVariant: "date",
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
