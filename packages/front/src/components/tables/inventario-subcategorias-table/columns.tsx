import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteInventarioSubcategoriaMutation } from "@/hooks/inventario-subcategoria";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { InventarioSubcategoria } from "@/types";
import Link from "next/link";

const baseUrl = "subcategorias";

const DataTableRowActions = ({ data }: { data: InventarioSubcategoria }) => {
  const { mutate } = useDeleteInventarioSubcategoriaMutation();
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
        <Link className="" href={`/categorias/${data.inventarioCategoriaId}/subcategorias/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link className="" href={`/categorias/${data.inventarioCategoriaId}/subcategorias/${data.id}`}>
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

export const columns: ColumnDef<InventarioSubcategoria>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
