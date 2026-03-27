import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteDatoMutation } from "@/hooks/datos";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Indice } from "@/types";
import Link from "next/link";
const baseUrl = "indices";
import { CellColumn } from "@/components/ui/cell-column";
const DataTableRowActions = ({ data }: { data: Indice }) => {
  const { mutate } = useDeleteDatoMutation();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only"> Abrir menú </span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones </DropdownMenuLabel>
        <Link className="" href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link className="" href={`${baseUrl}/${data.id}`}>
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

export const columns: ColumnDef<Indice>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("id")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <CellColumn> {row.getValue("nombre")} </CellColumn>,
  },
  {
    accessorKey: "notas",
    header: "Notas",
    cell: ({ row }) => <CellColumn> {row.getValue("notas")} </CellColumn>,
  },
  {
    accessorKey: "porcentaje",
    header: "Porcentaje",
    cell: ({ row }) => (
      <CellColumn> % {row.getValue("porcentaje")} </CellColumn>
    ),
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
