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
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import type { InventarioReserva } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { hasPermission } from "@/hooks/use-access";
import { formatTime } from "@/utils/date";
import { useDeleteInventarioReservaMutation } from "@/hooks/inventario-reserva";
import { useCreateMovimientoInventarioMutation } from "@/hooks/movimiento-inventario";
import { TIPO_MOVIMIENTO } from "@/constants/inventario";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PERMISOS } from "@/constants/permisos";

const DataTableRowActions = ({ data }: { data: InventarioReserva }) => {
  const [accion, setAccion] = useState<"usar" | "devolver" | null>(null);
  const { mutateAsync: create } = useCreateMovimientoInventarioMutation();
  const { mutateAsync: remove } = useDeleteInventarioReservaMutation();

  const handleConfirm = async () => {
    if (accion === "usar") {
      // Usar la reserva = crear movimiento OUT con reservaId
      // El backend automáticamente eliminará o actualizará la reserva
      await create({
        tipoMovimiento: TIPO_MOVIMIENTO.OUT,
        cantidad: data.cantidad,
        productoId: data.productoId,
        cantidadAntes: data.producto.stock,
        motivo: "Uso de reserva",
        producto: data.producto,
        reservaId: data.id,
        presupuestoId: data.presupuestoId,
        trabajoId: data.trabajoId,
      });
    } else if (accion === "devolver") {
      // Devolver la reserva = simplemente eliminarla (no afecta el stock físico)
      await remove(data.id);
    }
    setAccion(null);
  };

  return (
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setAccion("usar");
              }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Usar
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setAccion("devolver");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Devolver
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
              {accion === "usar" ? (
                <p>
                  ¿Estás seguro que querés <strong>usar</strong> esta reserva?
                  Esta acción eliminará la reserva y el material se usará para
                  lo que fue reservado.
                </p>
              ) : (
                <p>
                  ¿Estás seguro que querés <strong>devolver</strong> esta
                  reserva? Esta acción eliminará la reserva y el material se
                  devolverá al stock.
                </p>
              )}{" "}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<InventarioReserva>[] = [
  {
    accessorKey: "id",
    header: "N°",
    cell: ({ row }) => (
      <CellColumn className="">{row.getValue("id")}</CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "fecha",
    header: "Fecha y Hora",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const fecha = row.getValue("fecha") as string;
      return (
        <CellColumn>
          <div className="space-y-1 pl-2">
            <div className="flex items-center gap-1">
              <div className="text-xs text-gray-500">{formatTime(fecha)}</div>
            </div>
          </div>
        </CellColumn>
      );
    },
  },
  {
    id: "analisis-cantidad",
    header: "Analisis Stock",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const producto = row.original.producto;
      const cantidadReservada = Number(row.getValue("cantidad"));

      if (!producto) return <CellColumn>-</CellColumn>;

      const stockTotal = Number.parseFloat(producto.stock);
      const porcentajeReservado =
        stockTotal > 0 ? (cantidadReservada / stockTotal) * 100 : 0;
      const stockRestante = stockTotal - cantidadReservada;

      // Determinar color según el porcentaje
      let colorClass = "bg-green-500";
      let textColor = "text-green-700";
      if (porcentajeReservado > 70) {
        colorClass = "bg-red-500";
        textColor = "text-red-700";
      } else if (porcentajeReservado > 40) {
        colorClass = "bg-yellow-500";
        textColor = "text-yellow-700";
      }

      return (
        <CellColumn>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-semibold ${textColor}`}>
                {cantidadReservada} / {stockTotal}
              </span>
              <span className="text-gray-500">
                {porcentajeReservado.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
                style={{ width: `${Math.min(porcentajeReservado, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-600">
              Restante: <span className="font-medium">{stockRestante}</span>
            </div>
          </div>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const cantidad = row.getValue("cantidad");
      const producto = row.original.producto;

      return (
        <CellColumn>
          <div className="flex justify-center items-center gap-1">
            <div className="text-2xl font-bold text-blue-600">{cantidad}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {producto?.unidadMedida || "UN"}
            </div>
          </div>
        </CellColumn>
      );
    },
  },

  {
    accessorFn: (row) => row?.presupuesto?.id,
    id: "presupuesto.id",
    enableColumnFilter: false,
    header: "N° Orden",
    cell: ({ row }) => {
      const otId = row.original.presupuesto?.id;
      return (
        <CellColumn className="">
          {otId ? (
            <Badge variant="outline" className="">
              OT-{otId}
            </Badge>
          ) : (
            <span className="text-gray-400">Sin OT</span>
          )}
        </CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row?.trabajo?.nombre,
    header: "Sector",
    id: "trabajo.nombre",
    enableColumnFilter: false,
    cell: ({ row }) => {
      return <CellColumn>{row.original.trabajo?.nombre}</CellColumn>;
    },
  },
  {
    accessorFn: (row) => row.centroCosto?.nombre,
    id: "centroCosto.nombre",
    header: "Centro de Costo",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <CellColumn>
        {row.original.centroCosto?.nombre || (
          <span className="text-gray-400">Sin asignar</span>
        )}
      </CellColumn>
    ),
  },
  {
    accessorKey: "observaciones",
    header: "Observaciones",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const observaciones = row.getValue("observaciones") as string;
      return (
        <CellColumn>
          {observaciones ? (
            <div className="text-sm max-w-[150px] truncate">
              {observaciones}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Sin observaciones</span>
          )}
        </CellColumn>
      );
    },
  },

  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => (
      <>
        {hasPermission(PERMISOS.INVENTARIO_RESERVA_EDITAR) && (
          <DataTableRowActions data={row.original} />
        )}
      </>
    ),
  },
];
