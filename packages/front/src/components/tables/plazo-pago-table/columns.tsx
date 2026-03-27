import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePlazoPagoMutation } from "@/hooks/plazo-pago";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { PlazoPago } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const baseUrl = "plazo-pago";

const DataTableRowActions = ({ data }: { data: PlazoPago }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeletePlazoPagoMutation();
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
            <DropdownMenuItem onClick={() => console.log("Ver", data)}>
              Ver
            </DropdownMenuItem>
          </Link>
          <Link className="" href={`${baseUrl}/${data.id}`}>
            <DropdownMenuItem onClick={() => console.log("Editar", data)}>
              Editar
            </DropdownMenuItem>
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

export const columns: ColumnDef<PlazoPago>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("id")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("descripcion")}{" "}
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
