import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteComisionMutation } from "@/hooks/comisiones";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Comision } from "@/types";
import Link from "next/link";
const baseUrl = "comisiones";
const DataTableRowActions = ({ data }: { data: Comision }) => {
  const { mutate } = useDeleteComisionMutation();
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

export const columns: ColumnDef<Comision>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: "",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("id")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "de",
    header: "De",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("de")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "hasta",
    header: "Hasta",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("hasta")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "comision",
    header: "Comisión",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("comision")}{" "}
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
