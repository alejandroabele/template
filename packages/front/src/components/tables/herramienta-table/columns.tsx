"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { HerramientaPrestarDialog } from "@/components/dialogs/herramienta-prestamo-dialog";
import { HandHelping } from "lucide-react";

const baseUrl = "herramientas";

const RowAcciones = ({ data }: { data: any }) => {
    const [openPrestar, setOpenPrestar] = React.useState(false);
    const disponible = Math.max(0, Number(data.stock ?? 0) - Number(data.prestadas ?? 0));

    return (
        <>
            {openPrestar && (
                <HerramientaPrestarDialog
                    herramienta={data}
                    open={openPrestar}
                    onClose={() => setOpenPrestar(false)}
                />
            )}
            <div className="flex items-center gap-1">
                {hasPermission(PERMISOS.HERRAMIENTA_GESTIONAR) && (
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={disponible <= 0}
                        onClick={() => setOpenPrestar(true)}
                        title="Registrar préstamo"
                    >
                        <HandHelping className="h-4 w-4 mr-1" />
                        Registrar préstamo
                    </Button>
                )}
            </div>
        </>
    );
};

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => (
            <Link href={`${baseUrl}/${row.original.id}`}>
                <CellColumn className="font-medium hover:underline">{row.getValue("nombre")}</CellColumn>
            </Link>
        ),
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => <CellColumn>{row.getValue("sku")}</CellColumn>,
    },
    {
        accessorKey: "unidadMedida",
        header: "Unidad",
        cell: ({ row }) => <CellColumn>{row.getValue("unidadMedida")}</CellColumn>,
    },
    {
        id: "stock_info",
        header: "Stock",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const stock = Number(row.original.stock ?? 0);
            const prestadas = Number(row.original.prestadas ?? 0);
            const disponibles = Math.max(0, stock - prestadas);
            return (
                <CellColumn>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{stock} total</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-orange-600">{prestadas} prestadas</span>
                        <span className="text-muted-foreground">·</span>
                        <span className={disponibles <= 0 ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                            {disponibles} disp.
                        </span>
                    </div>
                </CellColumn>
            );
        },
    },
    {
        id: "acciones",
        cell: ({ row }) => <RowAcciones data={row.original} />,
    },
];
