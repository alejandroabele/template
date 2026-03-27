import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCuentaContableMutation } from "@/hooks/cuenta-contable";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { CuentaContable } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const baseUrl = "cuenta-contable";

const DataTableRowActions = ({ data }: { data: CuentaContable }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteCuentaContableMutation();

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data.id!);
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

export const columns: ColumnDef<CuentaContable>[] = [
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => <div className="pl-4">{row.getValue("codigo")}</div>,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => <div className="pl-4">{row.getValue("descripcion")}</div>,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return <div className="pl-4 capitalize">{tipo}</div>;
    },
  },
];
