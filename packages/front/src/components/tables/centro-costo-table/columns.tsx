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
import { useDeleteCentroCostoMutation } from "@/hooks/centro-costo";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { CentroCosto } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";

const baseUrl = "centro-costo";

const DataTableRowActions = ({ data }: { data: CentroCosto }) => {
  const { mutate } = useDeleteCentroCostoMutation();
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
        <DropdownMenuItem onClick={() => mutate(data.id!)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CentroCosto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => <CellColumn>{row.getValue("codigo")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <CellColumn>{row.getValue("nombre")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <CellColumn>{row.getValue("descripcion") || "-"}</CellColumn>
    ),
    enableColumnFilter: true,
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
