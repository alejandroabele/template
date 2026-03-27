import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBancoMutation } from "@/hooks/banco";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Banco } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";

const baseUrl = "bancos";

const DataTableRowActions = ({ data }: { data: Banco }) => {
  const { mutate } = useDeleteBancoMutation();
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
        <Link className="" href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => data.id && mutate(data.id)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Banco>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre del Banco",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("nombre")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "alias",
    header: "Alias",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("alias")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "nroCuenta",
    header: "Número de Cuenta",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("nroCuenta")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "cbu",
    header: "CBU",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("cbu")}</CellColumn>
      </Link>
    ),
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
