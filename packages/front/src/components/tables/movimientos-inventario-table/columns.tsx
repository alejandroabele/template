"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMovimientoInventarioMutation } from "@/hooks/movimiento-inventario";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Minus } from "lucide-react";
import React from "react";
import type { MovimientoInventario } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { hasPermission } from "@/hooks/use-access";
import { formatTime } from "@/utils/date";
import { TIPO_MOVIMIENTO } from "@/constants/inventario";
import { PERMISOS } from "@/constants/permisos";
import Link from "next/link";

const DataTableRowActions = ({ data }: { data: MovimientoInventario }) => {
  const { mutate } = useDeleteMovimientoInventarioMutation();
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data?.id);
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// Componente simplificado para mostrar la cantidad del movimiento
const QuantityCell = ({
  cantidad,
  tipoMovimiento,
}: {
  cantidad: number;
  tipoMovimiento: string;
}) => {
  const getColorStyles = (tipo: string) => {
    switch (tipo) {
      case TIPO_MOVIMIENTO.IN:
        return "bg-green-100 text-green-800 border border-green-200";
      case TIPO_MOVIMIENTO.OUT:
        return "bg-red-100 text-red-800 border border-red-200";
      case TIPO_MOVIMIENTO.AJUSTE:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case TIPO_MOVIMIENTO.RESERVA:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case TIPO_MOVIMIENTO.PRESTAMO:
        return "bg-violet-100 text-violet-800 border border-violet-300";
      case TIPO_MOVIMIENTO.DEVOLUCION:
        return "bg-cyan-100 text-cyan-800 border border-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const isEntrada = tipoMovimiento?.includes(TIPO_MOVIMIENTO.IN);
  const isSalida = tipoMovimiento?.includes(TIPO_MOVIMIENTO.OUT);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${getColorStyles(tipoMovimiento)}`}
      >
        {tipoMovimiento === TIPO_MOVIMIENTO.AJUSTE ? (
          <span className="text-xs font-bold">±</span>
        ) : isEntrada ? (
          <Plus className="h-3 w-3" />
        ) : isSalida ? (
          <Minus className="h-3 w-3" />
        ) : null}
        {cantidad}
      </div>
    </div>
  );
};

export const columns: ColumnDef<MovimientoInventario>[] = [
  {
    accessorKey: "id",
    header: "N°",
    cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "tipoMovimiento",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipoMovimiento") as string;

      const colorMap: Record<string, string> = {
        [TIPO_MOVIMIENTO.IN]: "bg-green-100 text-green-800",
        [TIPO_MOVIMIENTO.OUT]: "bg-red-100 text-red-800",
        [TIPO_MOVIMIENTO.AJUSTE]: "bg-yellow-100 text-yellow-800",
        [TIPO_MOVIMIENTO.RESERVA]: "bg-blue-100 text-blue-800",
        [TIPO_MOVIMIENTO.RESERVA_USADA]: "bg-purple-100 text-purple-800",
        [TIPO_MOVIMIENTO.RESERVA_DEVUELTA]: "bg-orange-100 text-orange-800",
        [TIPO_MOVIMIENTO.PRESTAMO]: "bg-violet-100 text-violet-800",
        [TIPO_MOVIMIENTO.DEVOLUCION]: "bg-cyan-100 text-cyan-800",
      };

      const baseClass = "font-medium px-2 py-1 rounded text-center";
      const colorClass = colorMap[tipo] || "bg-gray-100 text-gray-800";

      return (
        <CellColumn>
          <div className={`${baseClass} ${colorClass}`}>{tipo}</div>
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => <CellColumn>{row.getValue("motivo")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => {
      const cantidad = row.original?.cantidad;
      const tipoMovimiento = row.original?.tipoMovimiento;
      const conversion = row.original?.inventarioConversion;

      const cantidadConvertida = conversion
        ? cantidad / Number(conversion.cantidad)
        : cantidad;

      return (
        <QuantityCell
          cantidad={cantidadConvertida}
          tipoMovimiento={tipoMovimiento}
        />
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => (
      <CellColumn>{formatTime(row.getValue("fecha"))}</CellColumn>
    ),
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.producto?.nombre,
    id: "producto.nombre",
    header: "Producto",
    cell: ({ row }) => {
      const producto = row.original.producto;
      return (
        <CellColumn>
          {producto ? (
            <Link
              href={`/productos/${producto.id}`}
              className="text-blue-600 hover:underline"
            >
              {producto.nombre}
            </Link>
          ) : (
            <span className="text-gray-400">Sin producto</span>
          )}
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "conversion",
    header: "Conversión",
    cell: ({ row }) => {
      const conversion = row.original.inventarioConversion;
      if (conversion) {
        return (
          <CellColumn>
            <div className="text-xs text-gray-500">
              Factor de conversión: {conversion.cantidad}
              {` (${conversion.unidadOrigen} → ${conversion.unidadDestino})`}
            </div>
          </CellColumn>
        );
      }
      return <CellColumn>No disponible</CellColumn>; // Si no hay conversión
    },
    enableColumnFilter: true,
  },

  {
    accessorFn: (row) => row.trabajo?.nombre,
    id: "trabajo.nombre",
    header: "Sector",
    cell: ({ row }) => <CellColumn>{row.original.trabajo?.nombre}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row?.presupuesto?.id,
    id: "presupuesto.id",
    enableColumnFilter: true,

    header: "N° Orden",
    cell: ({ row }) => {
      const presupuesto = row.original.presupuesto;
      return (
        <CellColumn className="">
          {presupuesto ? (
            <Link href={`/presupuestos/${presupuesto.id}`}>
              <Badge
                variant="outline"
                className="hover:bg-gray-100 cursor-pointer"
              >
                OT-{presupuesto.id}
              </Badge>
            </Link>
          ) : (
            <span className="text-gray-400">Sin OT</span>
          )}
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row?.ordenCompraItem?.ordenCompraId,
    id: "ordenCompraItem.ordenCompraId",
    enableColumnFilter: true,
    header: "Orden de Compra",
    cell: ({ row }) => {
      const ordenCompraId = row.original.ordenCompraItem?.ordenCompraId;
      return (
        <CellColumn className="">
          {ordenCompraId ? (
            <Link href={`/orden-compra/${ordenCompraId}`}>
              <Badge variant="outline" className="bg-blue-50">
                OC-{ordenCompraId}
              </Badge>
            </Link>
          ) : (
            <span className="text-gray-400">Sin OC</span>
          )}
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row.persona?.nombre,
    id: "persona.nombre",
    header: "Persona",
    cell: ({ row }) => {
      const persona = row.original.persona;
      return (
        <CellColumn>
          {persona ? (
            <Link
              href={`/personas/${persona.id}`}
              className="text-blue-600 hover:underline"
            >
              {persona.nombre} {persona.apellido}
            </Link>
          ) : (
            <span className="text-gray-400">Sin persona</span>
          )}
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.reservaId,
    id: "reservaId",
    header: "Reserva",
    cell: ({ row }) => {
      const reservaId = row.original.reservaId;
      return (
        <CellColumn>
          {reservaId ? (
            <Link
              href={`/reservas/${reservaId}`}
              className="text-blue-600 hover:underline"
            >
              #{reservaId}
            </Link>
          ) : (
            <span className="text-gray-400">Sin reserva</span>
          )}
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.centroCosto?.nombre,
    id: "centroCosto.nombre",
    header: "Centro de Costo",
    cell: ({ row }) => {
      const centroCosto = row.original.centroCosto;
      return (
        <CellColumn>
          {centroCosto ? (
            <Link
              href={`/centro-costo/${centroCosto.id}`}
              className="text-blue-600 hover:underline"
            >
              {centroCosto.nombre}
            </Link>
          ) : (
            <span className="text-gray-400">Sin asignar</span>
          )}
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "observaciones",
    header: "Observaciones",
    cell: ({ row }) => <CellColumn>{row.getValue("observaciones")}</CellColumn>,
    enableColumnFilter: true,
  },
  {
    id: "acciones",
    cell: ({ row }) => (
      <>
        {hasPermission(PERMISOS.MOVIMIENTO_INVENTARIO_CREAR) && (
          <DataTableRowActions data={row.original} />
        )}
      </>
    ),
  },
];
