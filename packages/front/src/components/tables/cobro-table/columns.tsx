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
import { useDeleteCobroMutation } from "@/hooks/cobro";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Cobro } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { Currency } from "@/components/ui/currency";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { CobroDialog } from "@/components/dialogs/cobro-dialog";
import { formatDate } from "@/utils/date";
import { FileViewer } from "@/components/file-viewer";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

type DataTableRowActionsProps = {
  data: Cobro;
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
};

const DataTableRowActions = ({
  data,
  modelo,
  modeloId,
}: DataTableRowActionsProps) => {
  const { mutate } = useDeleteCobroMutation();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const canEdit = hasPermission(PERMISOS.COBRO_EDITAR);
  const canDelete = hasPermission(PERMISOS.COBRO_ELIMINAR);

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

      {openEdit && (
        <CobroDialog
          open={openEdit}
          setOpen={setOpenEdit}
          id={data.id}
          modelo={modelo}
          modeloId={modeloId}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          {canEdit && (
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              Editar
            </DropdownMenuItem>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

type ColumnsProps = {
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
};

export const createColumns = ({
  modelo,
  modeloId,
}: ColumnsProps): ColumnDef<Cobro>[] => [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.monto,
    id: "monto",
    accessorKey: "monto",
    header: "Monto",
    cell: ({ row }) => (
      <CellColumn>
        <Currency>{row.original.monto}</Currency>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.fecha,
    id: "fecha",
    accessorKey: "fecha",
    header: modelo === "presupuesto" ? "Fecha" : "Fecha Cobro",
    cell: ({ row }) => (
      <CellColumn>
        {row.getValue("fecha")
          ? formatDate(row.getValue("fecha"))
          : row.original.fechaCobro
            ? formatDate(row.original.fechaCobro)
            : "-"}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row: Cobro) => row.factura?.folio,
    id: "factura",
    accessorKey: "factura",
    header: "Factura",
    cell: ({ row }: any) => (
      <CellColumn>{row.original.factura?.folio || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row: Cobro) => row.metodoPago?.nombre,
    id: "metodoPago",
    accessorKey: "metodoPago",
    header: "Método de Pago",
    cell: ({ row }: any) => (
      <CellColumn>{row.original.metodoPago?.nombre || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row: Cobro) => row.retenciones,
    id: "retenciones",
    accessorKey: "retenciones",
    header: "Retenciones",
    cell: ({ row }: any) => (
      <CellColumn>
        <Currency>{row.original.retenciones || 0}</Currency>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },

  {
    id: "archivos",
    header: "Archivos",
    cell: ({ row }) => (
      <CellColumn>
        <FileViewer archivo={row.original?.comprobante} />
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <DataTableRowActions
        data={row.original}
        modelo={modelo}
        modeloId={modeloId}
      />
    ),
    enableColumnFilter: false,
  },
];
