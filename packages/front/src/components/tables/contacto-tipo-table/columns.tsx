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
import { useDeleteContactoTipoMutation } from "@/hooks/contacto-tipo";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { ContactoTipo } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { CellColumn } from "@/components/ui/cell-column";

const baseUrl = "contacto-tipo";

const DataTableRowActions = ({ data }: { data: ContactoTipo }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteContactoTipoMutation();

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data.id);
          setOpenDelete(false);
        }}
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
      />
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
            <DropdownMenuItem>Ver</DropdownMenuItem>
          </Link>
          <Link href={`${baseUrl}/${data.id}`}>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<ContactoTipo>[] = [
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
  },
  {
    accessorFn: (row) => row.nombre,
    accessorKey: "Nombre",
    id: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.original.id}`}>
        <CellColumn>{row.getValue("nombre")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.color,
    id: "color",
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.getValue("color") as string;
      return (
        <CellColumn>
          <div className="flex items-center gap-2">
            {color && (
              <>
                <span
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground">{color}</span>
              </>
            )}
          </div>
        </CellColumn>
      );
    },
  },
  {
    id: "icono",
    accessorKey: "icono",
    accessorFn: (row) => row.icono,
    header: "Ícono",
    cell: ({ row }) => (
      <CellColumn>
        <span className="text-sm">{row.getValue("icono") || "-"}</span>
      </CellColumn>
    ),
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
