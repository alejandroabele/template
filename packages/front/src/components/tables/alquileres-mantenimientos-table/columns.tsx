import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAlquilerMantenimientoMutation } from "@/hooks/alquiler-mantenimiento";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { AlquilerMantenimiento } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { FileViewer } from "@/components/file-viewer";
import { Currency } from "@/components/ui/currency";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { AlquilerMantenimientoDialog } from "@/components/dialogs/alquiler-mantenimiento-dialog";
import { hasPermission } from "@/hooks/use-access";
import { ROLE } from "@/constants/roles";
import { formatDate } from "@/utils/date";
import { PERMISOS } from "@/constants/permisos";
const baseUrl = "clientes";

const DataTableRowActions = ({ data }: { data: AlquilerMantenimiento }) => {
  const { mutate } = useDeleteAlquilerMantenimientoMutation();
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
        <AlquilerMantenimientoDialog
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
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<AlquilerMantenimiento>[] = [
  {
    accessorKey: "costo",
    header: "Costo",
    cell: ({ row }) => (
      <CellColumn>
        <Currency>{row.getValue("costo")}</Currency>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.getValue("fecha"))}</CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "detalle",
    header: "Detalle",
    cell: ({ row }) => <CellColumn>{row.getValue("detalle")}</CellColumn>,
    enableColumnFilter: false,
  },

  {
    accessorKey: "checkList",
    enableSorting: false,
    header: "CheckList",
    enableColumnFilter: false,
    cell: ({ row }) => <FileViewer archivo={row.original.checklistArchivo} />,
  },

  {
    id: "acciones",
    cell: ({ row }) => {
      return (
        <>
          {hasPermission(PERMISOS.ALQUILERES_MANTENIMIENTO_EDITAR) && (
            <DataTableRowActions data={row.original} />
          )}
        </>
      );
    },
  },
];
