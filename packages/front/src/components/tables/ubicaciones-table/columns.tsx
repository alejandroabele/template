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
import { useDeleteUbicacionMutation } from "@/hooks/ubicacion";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import type { Ubicacion } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";

const baseUrl = "activos/ubicaciones";

const DataTableRowActions = ({ data }: { data: Ubicacion }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteUbicacionMutation();

  return (
    <>
      <DeleteDialog
        onDelete={() => { mutate(data.id!); setOpenDelete(false); }}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
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
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          {hasPermission(PERMISOS.UBICACION_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Ubicacion>[] = [
  {
    id: "acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    id: "recurso.codigo",
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.original.id}`}>
        <CellColumn>{row.original.recurso?.codigo}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <CellColumn>{row.getValue("nombre")}</CellColumn>,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => <CellColumn>{row.getValue("descripcion") || "-"}</CellColumn>,
  },
];
