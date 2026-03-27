"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import { TIPO_MOVIMIENTO } from "@/constants/inventario";

const colorMap: Record<string, string> = {
    [TIPO_MOVIMIENTO.PRESTAMO]: "bg-orange-100 text-orange-800",
    [TIPO_MOVIMIENTO.DEVOLUCION]: "bg-teal-100 text-teal-800",
};

const labelMap: Record<string, string> = {
    [TIPO_MOVIMIENTO.PRESTAMO]: "Préstamo",
    [TIPO_MOVIMIENTO.DEVOLUCION]: "Devolución",
};

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "tipoMovimiento",
        header: "Tipo",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const tipo = row.getValue("tipoMovimiento") as string;
            const color = colorMap[tipo] ?? "bg-gray-100 text-gray-800";
            return (
                <CellColumn>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                        {labelMap[tipo] ?? tipo}
                    </span>
                </CellColumn>
            );
        },
    },
    {
        id: "persona",
        header: "Persona",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const persona = row.original.persona;
            return <CellColumn>{persona ? `${persona.nombre} ${persona.apellido}` : "-"}</CellColumn>;
        },
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        enableColumnFilter: false,
        cell: ({ row }) => <CellColumn>{row.getValue("cantidad")}</CellColumn>,
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const fecha = row.getValue("fecha") as string;
            return <CellColumn>{fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-"}</CellColumn>;
        },
    },
    {
        accessorKey: "observaciones",
        header: "Observaciones",
        enableColumnFilter: false,
        cell: ({ row }) => <CellColumn>{row.getValue("observaciones") ?? "-"}</CellColumn>,
    },
];
