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
import { useDeleteCashflowRubroMutation } from "@/hooks/cashflow-rubro";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { CashflowRubro } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { CellColumn } from "@/components/ui/cell-column";

const baseUrl = "cashflow-rubro";

const DataTableRowActions = ({ data }: { data: CashflowRubro }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteCashflowRubroMutation();

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${baseUrl}/${data.id}`}>Editar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-destructive"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<CashflowRubro>[] = [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link href={`/${baseUrl}/${row.original.id}`}>
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.nombre,
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <Link href={`/${baseUrl}/${row.original.id}`}>
        <CellColumn>{row.getValue("nombre")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.descripcion,
    id: "descripcion",
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => <CellColumn>{row.getValue("descripcion")}</CellColumn>,
    enableColumnFilter: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
