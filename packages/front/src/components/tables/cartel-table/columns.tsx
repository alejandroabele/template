"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCartelMutation } from "@/hooks/cartel";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

const baseUrl = "carteles";

const DataTableRowActions = ({ data }: { data: any }) => {
    const { mutate } = useDeleteCartelMutation();
    const [openDelete, setOpenDelete] = React.useState(false);
    return (
        <>
            <DeleteDialog
                onDelete={() => {
                    mutate(data.id);
                    setOpenDelete(false);
                }}
                open={openDelete}
                onClose={() => setOpenDelete(false)}
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
                    <Link href={`${baseUrl}/${data.id}`}>
                        <DropdownMenuItem>Ver</DropdownMenuItem>
                    </Link>
                    <Link href={`${baseUrl}/${data.id}`}>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                    </Link>
                    {hasPermission(PERMISOS.CARTELES_ELIMINAR) && (
                        <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                            Eliminar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export const columns: ColumnDef<any>[] = [
    {
        id: "acciones",
        cell: ({ row }) => <DataTableRowActions data={row.original} />,
    },
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => <CellColumn>{row.getValue("id")}</CellColumn>,
    },
    {
        id: "recurso.codigo",
        accessorKey: "codigo",
        header: "Código",
        cell: ({ row }) => (
            <Link className="pl-4" href={`${baseUrl}/${row.original.id}`}>
                {row.original.recurso?.codigo}
            </Link>
        ),
    },
    {
        id: "recurso.proveedor",
        accessorKey: "proveedor",
        header: "Proveedor",
        cell: ({ row }) => <CellColumn>{row.original.recurso?.proveedor}</CellColumn>,
    },
    {
        accessorKey: "localidad",
        header: "Localidad",
        cell: ({ row }) => <CellColumn>{row.getValue("localidad")}</CellColumn>,
    },
    {
        accessorKey: "zona",
        header: "Zona",
        cell: ({ row }) => <CellColumn>{row.getValue("zona")}</CellColumn>,
    },
    {
        accessorKey: "formato",
        header: "Formato",
        cell: ({ row }) => <CellColumn>{row.getValue("formato")}</CellColumn>,
    },
    {
        accessorKey: "alto",
        header: "Alto",
        cell: ({ row }) => <CellColumn>{row.getValue("alto")}</CellColumn>,
    },
    {
        accessorKey: "largo",
        header: "Largo",
        cell: ({ row }) => <CellColumn>{row.getValue("largo")}</CellColumn>,
    },
];
