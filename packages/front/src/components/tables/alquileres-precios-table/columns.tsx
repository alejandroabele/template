import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAlquilerPrecioMutation } from "@/hooks/alquiler-precio";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { AlquilerPrecio } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { Currency } from "@/components/ui/currency";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { AlquileresPrecioDialog } from "@/components/dialogs/alquiler-precio-dialog";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
const baseUrl = "clientes";

const DataTableRowActions = ({ data }: { data: AlquilerPrecio }) => {
  const { mutate } = useDeleteAlquilerPrecioMutation();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
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

      {openEdit && (
        <AlquileresPrecioDialog
          open={openEdit}
          setOpen={setOpenEdit}
          id={data.id}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"> Abrir menú </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones </DropdownMenuLabel>
          <Link className="" href={`/${baseUrl}/${data.clienteId}`}>
            <DropdownMenuItem onClick={() => {}}>Ver cliente</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!data.fechaFin}
            onClick={() => setOpenDelete(true)}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<AlquilerPrecio>[] = [
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => (
      <CellColumn>
        <Currency>{row.getValue("precio")}</Currency>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "fechaDesde",
    header: "Desde",
    cell: ({ row }) => <CellColumn>{row.getValue("fechaDesde")}</CellColumn>,
    enableColumnFilter: false,
  },

  {
    accessorKey: "fechaFin",
    header: "Hasta",
    cell: ({ row }) => {
      const fechaFin = row.getValue("fechaFin");
      return fechaFin ? (
        <CellColumn>{row.getValue("fechaFin")}</CellColumn>
      ) : (
        <Badge>Precio Actual</Badge>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => <CellColumn>{row.getValue("cliente")}</CellColumn>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "localidad",
    header: "Localidad",
    cell: ({ row }) => <CellColumn> {row.getValue("localidad")} </CellColumn>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "zona",
    header: "Zona",
    cell: ({ row }) => <CellColumn> {row.getValue("zona")} </CellColumn>,
    enableColumnFilter: false,
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return (
        <>
          {hasPermission(PERMISOS.ALQUILERES_PRECIO_EDITAR) && (
            <DataTableRowActions data={row.original} />
          )}
        </>
      );
    },
  },
];
