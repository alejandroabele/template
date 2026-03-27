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
import { useDeleteAlquilerMutation } from "@/hooks/alquiler";
import type { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import type { Alquiler } from "@/types";
import Link from "next/link";
import { Currency } from "@/components/ui/currency";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { SelectFilter } from "@/components/select-filter";
import { FileViewer } from "@/components/file-viewer";
import { hasPermission } from "@/hooks/use-access";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { formatDate } from "@/utils/date";
import { EstadoBadge } from "@/components/estado-badget";
import { AlertTriangle, Clock, AlertCircle } from "lucide-react";
import { PERMISOS } from "@/constants/permisos";

const baseUrl = "alquileres";
const DataTableRowActions = ({ data }: { data: Alquiler }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteAlquilerMutation();

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
          <Link className="" href={`${baseUrl}/${data.id}/mensajes`}>
            <DropdownMenuItem>Mensajes</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          {hasPermission(PERMISOS.ALQUILERES_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Alquiler>[] = [
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
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
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("codigo")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <CellColumn> {row.getValue("tipo")} </CellColumn>,
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => <CellColumn> {row.getValue("cliente")} </CellColumn>,
  },
  {
    accessorKey: "localidad",
    header: "Localidad",
    cell: ({ row }) => <CellColumn> {row.getValue("localidad")} </CellColumn>,
  },
  {
    accessorKey: "zona",
    header: "Zona",
    cell: ({ row }) => <CellColumn> {row.getValue("zona")} </CellColumn>,
  },
  {
    accessorKey: "precio",
    header: "Precio mensual de alquiler",
    meta: {
      filterVariant: "range",
    },
    cell: ({ row }) => {
      const precio = row.getValue("precio");
      const estadoPrecio = row.original.estadoPrecio; // ← Usamos el estado del backend

      // Mapeo de estados a clases de Tailwind
      const colorMap = {
        VIGENTE: "bg-green-700 text-white",
        VENCIMIENTO_CERCANO: "bg-yellow-300 text-black",
        VENCIMIENTO_PROXIMO: "bg-orange-400 text-black",
        VENCIDO: "bg-red-600 text-white",
      };

      return (
        <Link href={`${baseUrl}/${row.getValue("id")}`}>
          <CellColumn>
            <Currency
              className={`p-1 pr-2 rounded ${colorMap[estadoPrecio] || ""}`}
            >
              {precio}
            </Currency>
          </CellColumn>
        </Link>
      );
    },
  },
  {
    accessorKey: "inicioContrato",
    header: "Inicio contrato",
    meta: {
      filterVariant: "date",
    },
    cell: ({ row }) => (
      <CellColumn> {formatDate(row.getValue("inicioContrato"))} </CellColumn>
    ),
  },
  {
    accessorKey: "vencimientoContrato",
    header: "Vencimiento contrato",
    meta: {
      filterVariant: "date",
    },
    cell: ({ row }) => {
      const fechaVencimiento = row.getValue("vencimientoContrato");

      // Si no hay fecha, mostrar estado neutro
      if (!fechaVencimiento) {
        return (
          <CellColumn>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="text-sm">Contrato por tiempo indeterminado</span>
            </div>
          </CellColumn>
        );
      }

      const fechaActual = new Date();
      const fechaVenc = new Date(fechaVencimiento);

      // Calcular días restantes
      const diffTime = fechaVenc.getTime() - fechaActual.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Determinar estado y configuración visual
      let config = {
        icon: null as any,
        dotColor: "bg-emerald-600", // Verde esmeralda para normal (más de 30 días)
        textColor: "text-foreground",
        urgencyText: "",
        urgencyColor: "text-muted-foreground",
      };

      if (diffDays < 0) {
        const diasVencido = Math.abs(diffDays);
        config = {
          icon: AlertTriangle,
          dotColor: "bg-red-600", // Rojo intenso para vencidos
          textColor: "text-red-800", // Rojo más oscuro para mejor contraste
          urgencyText: `Vencido hace ${diasVencido} día${diasVencido !== 1 ? "s" : ""}`,
          urgencyColor: "text-red-700",
        };
      } else if (diffDays === 0) {
        config = {
          icon: AlertTriangle,
          dotColor: "bg-red-600", // Rojo intenso para vence hoy
          textColor: "text-red-800", // Rojo más oscuro
          urgencyText: "Vence hoy",
          urgencyColor: "text-red-700",
        };
      } else if (diffDays <= 15) {
        config = {
          icon: Clock,
          dotColor: "bg-orange-600", // Naranja intenso para 15 días o menos
          textColor: "text-orange-800", // Naranja más oscuro para mejor contraste
          urgencyText: `${diffDays} día${diffDays !== 1 ? "s" : ""} restante${diffDays !== 1 ? "s" : ""}`,
          urgencyColor: "text-orange-700",
        };
      } else if (diffDays <= 30) {
        config = {
          icon: AlertCircle,
          dotColor: "bg-amber-500", // Ámbar para 30 días o menos
          textColor: "text-amber-800", // Ámbar más oscuro para mejor contraste
          urgencyText: `${diffDays} días restantes`,
          urgencyColor: "text-amber-700",
        };
      } else {
        config = {
          icon: null,
          dotColor: "bg-emerald-600", // Verde esmeralda para más de 30 días
          textColor: "text-foreground",
          urgencyText: `${diffDays} días restantes`,
          urgencyColor: "text-muted-foreground",
        };
      }

      return (
        <CellColumn>
          <div
            className="flex flex-col gap-1 py-1"
            title={`${formatDate(fechaVencimiento)} - ${config.urgencyText}`}
          >
            {/* Línea principal con fecha */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
              {config.icon && (
                <config.icon className={`h-3.5 w-3.5 ${config.textColor}`} />
              )}
              <span className={`text-sm font-medium ${config.textColor}`}>
                {formatDate(fechaVencimiento)}
              </span>
            </div>

            {/* Línea secundaria con contexto */}
            <div className="flex items-center gap-2 ml-4">
              <span className={`text-xs ${config.urgencyColor}`}>
                {config.urgencyText}
              </span>
            </div>

            {/* Indicador de hover sutil */}
          </div>
        </CellColumn>
      );
    },
  },

  {
    accessorKey: "estado",
    header: "Estado",
    meta: {
      customFilter: (table: TableType<Alquiler>) => (
        <SelectFilter table={table} columnId="estado" type="alquiler" />
      ),
    },
    cell: ({ row }) => (
      <CellColumn>
        <EstadoBadge estado={row.getValue("estado")} />
      </CellColumn>
    ),
  },

  {
    accessorKey: "estadoFacturacion",
    enableSorting: false,
    header: "Estado Facturación",
    meta: {
      customFilter: (table: TableType<Alquiler>) => (
        <SelectFilter table={table} columnId="estadoFacturacion" />
      ),
    },
    cell: ({ row }) => (
      <CellColumn>
        <Badge
          variant={
            row.getValue("estadoFacturacion") === "FACTURADO"
              ? "success"
              : "destructive"
          }
        >
          {row.getValue("estadoFacturacion")}
        </Badge>{" "}
      </CellColumn>
    ),
  },
  {
    accessorKey: "contratoPdf",
    enableSorting: false,
    header: "Contrato PDF",
    enableColumnFilter: false,
    // enableColumnFilter: false,
    cell: ({ row }) => <FileViewer archivo={row.original.contratoArchivo} />,
  },
  {
    accessorKey: "fichaTecnica",
    enableSorting: false,
    header: "Ficha Técnica",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <FileViewer archivo={row.original.fichaTecnicaArchivo} />
    ),
  },
  {
    accessorKey: "periodicidadActualizacion",
    header: "Periodicidad $",
    meta: {
      customFilter: (table: TableType<Alquiler>) => (
        <SelectFilter
          table={table}
          columnId="periodicidadActualizacion"
          type="alquiler"
        />
      ),
    },
    cell: ({ row }) => {
      const value = row.getValue("periodicidadActualizacion");
      return (
        <CellColumn>
          {value ? `${value} ${value === "1" ? "Mes" : "Meses"}` : "–"}
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "fechaLimiteNegociacion",
    header: "Fecha limite negociación",
    meta: {
      filterVariant: "date",
    },
    cell: ({ row }) => (
      <CellColumn>
        {" "}
        {formatDate(row.getValue("fechaLimiteNegociacion"))}{" "}
      </CellColumn>
    ),
  },
  {
    accessorKey: "notas",
    header: "Notas",
    cell: ({ row }) => <CellColumn> {row.getValue("notas")} </CellColumn>,
  },

  {
    accessorKey: "saldado",
    header: "Saldado",
    cell: ({ row }) => (
      <CellColumn> {row.getValue("saldado") ? "SALDADO" : ""} </CellColumn>
    ),
  },

  {
    accessorKey: "estadoCobranza",
    enableSorting: false,
    header: "Estado Cobranza",
    meta: {
      customFilter: (table: TableType<Alquiler>) => (
        <SelectFilter table={table} columnId="estadoCobranza" />
      ),
    },
    cell: ({ row }) => (
      <CellColumn>
        <Badge
          variant={
            row.getValue("estadoCobranza") === "COBRADO"
              ? "success"
              : "destructive"
          }
        >
          {row.getValue("estadoCobranza")}
        </Badge>{" "}
      </CellColumn>
    ),
  },
];
