import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCashflowCategoriaMutation } from "@/hooks/cashflow-categoria";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { CashflowCategoria } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { CellColumn } from "@/components/ui/cell-column";
const baseUrl = "cashflow-categoria";

const DataTableRowActions = ({ data }: { data: CashflowCategoria }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteCashflowCategoriaMutation();

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
            disabled={data.protegida}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<CashflowCategoria>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <CellColumn>
        <Link href={`/${baseUrl}/${row.getValue("id")}`}>
          {row.getValue("id")}
        </Link>
      </CellColumn>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <CellColumn>{row.getValue("nombre")}</CellColumn>,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return (
        <Badge variant={tipo === "ingreso" ? "default" : "secondary"}>
          {tipo === "ingreso" ? "Ingreso" : "Egreso"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "protegida",
    header: "Protegida",
    cell: ({ row }) => {
      const protegida = row.getValue("protegida") as boolean;
      return (
        <Badge variant={protegida ? "default" : "secondary"}>
          {protegida ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
