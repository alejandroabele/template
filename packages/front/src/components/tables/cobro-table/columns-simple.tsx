"use client";

import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { CellColumn } from "@/components/ui/cell-column";
import { Cobro } from "@/types";
import { Currency } from "@/components/ui/currency";
import { formatDate } from "@/utils/date";
import { FileViewer } from "@/components/file-viewer";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { CobroDialog } from "@/components/dialogs/cobro-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useDeleteCobroMutation } from "@/hooks/cobro";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AccionesCobroProps = {
  cobro: Cobro;
};

const AccionesCobro = ({ cobro }: AccionesCobroProps) => {
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const { mutate } = useDeleteCobroMutation();

  return (
    <CellColumn>
      <div className="flex items-center gap-1">
        <TooltipProvider>
          {hasPermission(PERMISOS.COBRO_EDITAR) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setDialogEditOpen(true)}
                  className="h-8 w-8"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar Cobro</p>
              </TooltipContent>
            </Tooltip>
          )}

          {hasPermission(PERMISOS.COBRO_ELIMINAR) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setDialogDeleteOpen(true)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eliminar Cobro</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <CobroDialog
        open={dialogEditOpen}
        setOpen={setDialogEditOpen}
        id={cobro.id}
        modelo={cobro.modelo as "presupuesto" | "alquiler"}
        modeloId={cobro.modeloId}
      />

      <DeleteDialog
        open={dialogDeleteOpen}
        onClose={() => setDialogDeleteOpen(false)}
        onDelete={() => {
          mutate(cobro.id!);
          setDialogDeleteOpen(false);
        }}
      />
    </CellColumn>
  );
};

// Columnas simplificadas para cuando se usa como subcomponente dentro de la tabla de facturas
// Ahora incluye acciones de editar y eliminar
export const columnsSimple: ColumnDef<Cobro>[] = [
  {
    accessorFn: (row) => row.id,
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.fecha,
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>
        {row.getValue("fecha") ? formatDate(row.getValue("fecha")) : "-"}
      </CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
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
    enableSorting: false,
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
    enableSorting: false,
  },
  {
    accessorFn: (row: Cobro) => row.banco?.nombre,
    id: "banco",
    accessorKey: "banco",
    header: "Banco",
    cell: ({ row }: any) => (
      <CellColumn>{row.original.banco?.nombre || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <AccionesCobro cobro={row.original} />,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorFn: (row: Cobro) => row.retenciones,
    id: "retenciones",
    accessorKey: "retenciones",
    header: "Retenciones",
    cell: ({ row }: any) => (
      <CellColumn>
        {row.original.retenciones ? (
          <Currency>{row.original.retenciones}</Currency>
        ) : (
          "-"
        )}
      </CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "comprobante",
    header: "Comprobante",
    cell: ({ row }) => (
      <CellColumn>
        <FileViewer archivo={row.original?.comprobante} />
      </CellColumn>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
];
