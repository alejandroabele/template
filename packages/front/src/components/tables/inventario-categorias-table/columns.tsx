import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteInventarioCategoriaMutation } from "@/hooks/inventario-categoria";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { InventarioCategoria } from "@/types";
import Link from "next/link";
const baseUrl = "categorias";
const DataTableRowActions = ({ data }: { data: InventarioCategoria }) => {
  const { mutate } = useDeleteInventarioCategoriaMutation();
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
        <Link
          className=""
          href={`/categorias/${data.inventarioFamiliaId}/${data.id}`}
        >
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link
          className=""
          href={`/categorias/${data.inventarioFamiliaId}/${data.id}`}
        >
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

export const columns: ColumnDef<InventarioCategoria>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          className="pl-4"
          href={`/categorias/${data.inventarioFamiliaId}/${data.id}`}
        >
          {data.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          className="pl-4"
          href={`/categorias/${data.inventarioFamiliaId}/${data.id}`}
        >
          {data.nombre}
        </Link>
      );
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
