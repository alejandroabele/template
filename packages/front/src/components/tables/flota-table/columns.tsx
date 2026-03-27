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
import { useDeleteFlotaMutation } from "@/hooks/flota";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import type { Flota } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { hasPermission } from "@/hooks/use-access";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PERMISOS } from "@/constants/permisos";

const TIPO_LABELS: Record<string, string> = {
  pickup: "Pick-up",
  camion: "Camión",
  auto: "Auto",
};

const baseUrl = "flota";

const DataTableRowActions = ({ data }: { data: Flota }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteFlotaMutation();

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
          {hasPermission(PERMISOS.FLOTA_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Flota>[] = [
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
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <CellColumn>{TIPO_LABELS[row.getValue("tipo")] ?? row.getValue("tipo")}</CellColumn>
    ),
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => <CellColumn>{row.getValue("marca")}</CellColumn>,
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => <CellColumn>{row.getValue("modelo")}</CellColumn>,
  },
  {
    accessorKey: "patente",
    header: "Patente",
    cell: ({ row }) => <CellColumn>{row.getValue("patente")}</CellColumn>,
  },
];
