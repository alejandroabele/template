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
import { useDeleteEquipamientoMutation } from "@/hooks/equipamiento";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import type { Equipamiento } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { hasPermission } from "@/hooks/use-access";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PERMISOS } from "@/constants/permisos";

const TIPO_LABELS: Record<string, string> = {
  computadoras: "Computadoras",
  herramientas: "Herramientas",
  maquinarias: "Maquinarias",
  instalaciones: "Instalaciones",
  mobiliarios: "Mobiliarios",
  insumos_informaticos: "Insumos Informáticos",
};

const baseUrl = "equipamiento";

const DataTableRowActions = ({ data }: { data: Equipamiento }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteEquipamientoMutation();

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
          {hasPermission(PERMISOS.EQUIPAMIENTO_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Equipamiento>[] = [
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
    cell: ({ row }) => (
      <CellColumn>{row.getValue("nombre")}</CellColumn>
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
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => <CellColumn>{row.getValue("modelo")}</CellColumn>,
  },
  {
    accessorKey: "numeroSerie",
    header: "N° Serie",
    cell: ({ row }) => <CellColumn>{row.getValue("numeroSerie")}</CellColumn>,
  },
];
