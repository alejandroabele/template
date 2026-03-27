"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { CellColumn } from "@/components/ui/cell-column"
import type { InventarioConversion } from "@/types"
import { UNIDADES } from "@/constants/inventario"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import React from "react"
import { useDeleteInventarioConversionMutation } from '@/hooks/inventario-conversion'
import { DeleteDialog } from "@/components/ui/delete-dialog"

import { InventarioConversionDialog } from '@/components/dialogs/inventario-conversion-dialog'

const DataTableRowActions = ({ data }: { data: InventarioConversion }) => {
    const { mutate } = useDeleteInventarioConversionMutation();
    const [openDelete, setOpenDelete] = React.useState(false)
    const [openEdit, setOpenEdit] = React.useState(false)

    return (
        <>
            <DeleteDialog
                onDelete={() => {
                    mutate(data.id);
                    setOpenDelete(false)
                }}
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                }}
            />


            {openEdit && <InventarioConversionDialog open={openEdit} setOpen={setOpenEdit} id={data.id} />}



            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild >
                    <Button variant="ghost" className="h-8 w-8 p-0" >
                        <span className="sr-only" > Abrir menú </span>
                        < MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                < DropdownMenuContent align="end" >
                    <DropdownMenuLabel>Acciones </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        Editar
                    </DropdownMenuItem>
                    < DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
export const columns: ColumnDef<InventarioConversion>[] = [
    {
        accessorKey: "descripcion",
        header: "Descripción",
        enableColumnFilter: false,
        cell: ({ row }) => (
            <CellColumn>{row.getValue("descripcion") || "-"}</CellColumn>
        ),
    },
    {
        accessorKey: "unidadOrigen",
        header: "Unidad Origen",
        enableColumnFilter: false,
        cell: ({ row }) => (
            <CellColumn>{row.getValue("unidadOrigen")}</CellColumn>
        ),
    },
    {
        accessorKey: "cantidad",
        header: "Factor",
        enableColumnFilter: false,
        cell: ({ row }) => (
            <CellColumn>{row.getValue("cantidad")}</CellColumn>
        ),
    },
    {
        id: "conversion",
        header: "Relación de Conversión",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const cantidad = parseFloat(row.getValue("cantidad") || "0");
            const unidadOrigen = row.getValue("unidadOrigen") as string;
            const unidadDestino = row.original.unidadDestino;

            // Función para formatear números: enteros sin decimales, decimales solo si es necesario
            const formatNumber = (num: number): string => {
                if (Number.isInteger(num)) {
                    return num.toString();
                }
                // Eliminar ceros innecesarios al final
                return parseFloat(num.toFixed(4)).toString();
            };

            const cantidadFormateada = formatNumber(cantidad);
            const conversionInversa = cantidad > 0 ? formatNumber(1 / cantidad) : "0";

            return (
                <CellColumn>
                    <div className="text-xs space-y-1">
                        <div>1 {unidadDestino} → {cantidadFormateada} {unidadOrigen}</div>
                        <div className="text-muted-foreground">1 {unidadOrigen} → {conversionInversa} {unidadDestino}</div>
                    </div>
                </CellColumn>
            );
        },
    },
    {
        id: "acciones",
        cell: ({ row }) => {
            return <DataTableRowActions data={row.original} />;
        },
    }
]
