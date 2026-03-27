import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteRecetaMutation } from "@/hooks/receta";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Area } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { DeleteDialog } from "@/components/ui/delete-dialog";
const baseUrl = "recetas";
const DataTableRowActions = ({ data }: { data: Area }) => {
  const { mutate } = useDeleteRecetaMutation();

  const [openDelete, setOpenDelete] = React.useState(false);
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
          <Link className="" href={`${baseUrl}/${data.id}/duplicar`}>
            <DropdownMenuItem onClick={() => {}}>Duplicar</DropdownMenuItem>
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

export const columns: ColumnDef<Area>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        <CellColumn>{row.getValue("id")}</CellColumn>{" "}
      </Link>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        <CellColumn>{row.getValue("nombre")}</CellColumn>{" "}
      </Link>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
    cell: ({ row }) => (
      <Link className="" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        <CellColumn>{row.getValue("descripcion")}</CellColumn>
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
