"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  DollarSign,
  ChevronDown,
  ChevronRight,
  Edit3,
  Bell,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { Factura } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { Currency } from "@/components/ui/currency";
import { CobroDialog } from "@/components/dialogs/cobro-dialog";
import { EditarFacturaDialog } from "@/components/dialogs/editar-factura-dialog";
import { NotificacionDialog } from "@/components/dialogs/notificacion-dialog";
import { formatDate } from "@/utils/date";
import { FileViewer } from "@/components/file-viewer";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { parseISO } from "date-fns";
import { FACTURA_ESTADO } from "@/constants/factura";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const getEstadoInfo = (estado?: string) => {
  switch (estado) {
    case FACTURA_ESTADO.PAGADO:
      return { label: "Pagado", variant: "success" as const };
    case FACTURA_ESTADO.PARCIAL:
      return { label: "Parcial", variant: "warning" as const };
    case FACTURA_ESTADO.PENDIENTE:
    default:
      return { label: "Pendiente", variant: "default" as const };
  }
};

export const columns: ColumnDef<Factura>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    id: "expandir",
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => row.toggleExpanded()}
        className="p-0 h-8 w-8"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "folio",
    header: "Folio",
    cell: ({ row }) => (
      <CellColumn>{row.getValue("folio") || "S/N"}</CellColumn>
    ),
  },
  {
    accessorKey: "modeloId",
    header: "N° Modelo",
    meta: { filterVariant: "text" },
    cell: ({ row }) => {
      const modelo = row.original.modelo;
      const modeloId = row.original.modeloId;

      if (!modeloId) return <CellColumn>-</CellColumn>;

      const rutaModelo =
        modelo === "presupuesto"
          ? `/presupuestos/${modeloId}`
          : `/alquileres/${modeloId}`;

      const etiquetaModelo =
        modelo === "presupuesto" ? `Presup. #${modeloId}` : `Alq. #${modeloId}`;

      return (
        <CellColumn>
          <Link href={rutaModelo}>
            <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
              {etiquetaModelo}
            </span>
          </Link>
        </CellColumn>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const modeloId = row.getValue(columnId);
      if (!modeloId) return false;

      // Convertir a string y hacer comparación case-insensitive
      return String(modeloId)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.cliente?.nombre,
    id: "cliente.nombre",
    accessorKey: "cliente.nombre",
    header: "Cliente",
    cell: ({ row }) => (
      <CellColumn>{row.original.cliente?.nombre || "-"}</CellColumn>
    ),
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    meta: { filterVariant: "date-range" },

    cell: ({ row }) => (
      <CellColumn>
        {row.getValue("fecha") ? formatDate(row.getValue("fecha")) : "-"}
      </CellColumn>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const fecha = row.getValue(columnId) as string | undefined;

      // Rango de fechas con from/to
      if (filterValue.from && filterValue.to) {
        if (!fecha) return false;
        const fechaEmision = parseISO(fecha);
        const fechaInicio = parseISO(filterValue.from);
        const fechaFin = parseISO(filterValue.to);
        return fechaEmision >= fechaInicio && fechaEmision <= fechaFin;
      }

      return true;
    },
  },
  {
    accessorKey: "fechaVencimiento",
    header: "Vencimiento",
    meta: { filterVariant: "date-range" },
    cell: ({ row }) => (
      <CellColumn>
        {row.getValue("fechaVencimiento")
          ? formatDate(row.getValue("fechaVencimiento"))
          : "-"}
      </CellColumn>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const fechaVenc = row.getValue(columnId) as string | undefined;

      // Rango de fechas con from/to
      if (filterValue.from && filterValue.to) {
        if (!fechaVenc) return false;
        const fechaVencimiento = parseISO(fechaVenc);
        const fechaInicio = parseISO(filterValue.from);
        const fechaFin = parseISO(filterValue.to);
        return fechaVencimiento >= fechaInicio && fechaVencimiento <= fechaFin;
      }

      return true;
    },
  },
  {
    accessorKey: "monto",
    header: "Monto",
    cell: ({ row }) => (
      <CellColumn>
        <Currency>{Number(row.getValue("monto")) || 0}</Currency>
      </CellColumn>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    meta: {
      filterVariant: "multi-select",
      filterOptions: [
        { label: "Pendiente", value: FACTURA_ESTADO.PENDIENTE },
        { label: "Parcial", value: FACTURA_ESTADO.PARCIAL },
        { label: "Pagado", value: FACTURA_ESTADO.PAGADO },
      ],
    },
    cell: ({ row }) => {
      const { label, variant } = getEstadoInfo(row.original.estado);
      return (
        <CellColumn>
          <Badge variant={variant}>{label}</Badge>
        </CellColumn>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const estado = row.getValue(columnId) as string;

      // Si filterValue es un string JSON, parsearlo
      let parsedValue = filterValue;
      if (typeof filterValue === "string" && filterValue.startsWith("[")) {
        try {
          parsedValue = JSON.parse(filterValue);
        } catch {
          parsedValue = filterValue;
        }
      }

      // Si parsedValue es un array, verificar si el estado está en el array
      if (Array.isArray(parsedValue)) {
        return parsedValue.includes(estado);
      }

      // Fallback para valores simples
      return estado === parsedValue;
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const [dialogCobroOpen, setDialogCobroOpen] = useState(false);
      const [dialogEstadoOpen, setDialogEstadoOpen] = useState(false);
      const [dialogNotificacionOpen, setDialogNotificacionOpen] =
        useState(false);

      return (
        <CellColumn>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              {hasPermission(PERMISOS.COBRO_CREAR) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setDialogCobroOpen(true)}
                      className="h-8 w-8"
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cargar Cobro</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {hasPermission(PERMISOS.FACTURA_EDITAR) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setDialogEstadoOpen(true)}
                      className="h-8 w-8"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar Factura</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {hasPermission(PERMISOS.ENVIO_NOTIFICACION_CREAR) &&
                row.original.clienteId && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => setDialogNotificacionOpen(true)}
                        className="h-8 w-8"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notificar cliente</p>
                    </TooltipContent>
                  </Tooltip>
                )}
            </TooltipProvider>
          </div>

          {row.original && (
            <>
              <CobroDialog
                open={dialogCobroOpen}
                setOpen={setDialogCobroOpen}
                modelo={row.original.modelo as "presupuesto" | "alquiler"}
                modeloId={row.original.modeloId}
                monto={Number(row.original.monto) || 0}
                clienteId={row.original.clienteId}
                cliente={row.original.cliente}
              />

              <EditarFacturaDialog
                open={dialogEstadoOpen}
                setOpen={setDialogEstadoOpen}
                factura={row.original}
              />

              <NotificacionDialog
                open={dialogNotificacionOpen}
                onOpenChange={setDialogNotificacionOpen}
                modelo="factura"
                entidadId={row.original.id!}
                clienteNombre={row.original.cliente?.nombre}
              />
            </>
          )}
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "facturaArchivo",
    enableSorting: false,
    header: "Factura",
    enableColumnFilter: false,
    cell: ({ row }) => <FileViewer archivo={row.original.facturaArchivo} />,
  },
  {
    accessorKey: "montoCobrado",
    header: "Monto Cobrado",
    cell: ({ row }) => (
      <CellColumn>
        <Currency>{Number(row.original.montoCobrado) || 0}</Currency>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "importeBruto",
    header: "Importe Bruto",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.importeBruto ? (
          <Currency>{Number(row.original.importeBruto)}</Currency>
        ) : (
          "-"
        )}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "alicuota",
    header: "Alícuota",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.alicuota ? `${row.original.alicuota}%` : "-"}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
];
