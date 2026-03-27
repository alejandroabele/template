
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteDatoMutation } from '@/hooks/datos'
import {
    ColumnDef,

} from "@tanstack/react-table"
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Area } from '@/types'
import Link from "next/link"
const baseUrl = 'clientes'
const DataTableRowActions = ({ data }: { data: Area }) => {
    const { mutate } = useDeleteDatoMutation();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="h-8 w-8 p-0" >
                    <span className="sr-only" > Abrir menú </span>
                    < MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            < DropdownMenuContent align="end" >
                <DropdownMenuLabel>Acciones </DropdownMenuLabel>
                <Link href={`${baseUrl}/${data.id}`}>
                    <DropdownMenuItem >
                        Ver
                    </DropdownMenuItem>
                </Link>

                <Link href={`${baseUrl}/${data.id}`}>
                    <DropdownMenuItem >
                        Editar
                    </DropdownMenuItem>
                </Link>
                < DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => mutate(data.id)}>
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Area>[] = [
    {
        accessorKey: "id",
        header: "ID",
        meta: '',
        cell: ({ row }) => <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}> {row.getValue("id")} </Link>,
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}> {row.getValue("nombre")} </Link>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div> {row.getValue("email")} </div>,
    },
    {
        accessorKey: "direccion",
        header: "Direccion",
        cell: ({ row }) => <div> {row.getValue("direccion")} </div>,
    },
    {
        accessorKey: "ciudad",
        header: "Ciudad",
        cell: ({ row }) => <div> {row.getValue("ciudad")} </div>,
    }, {
        accessorKey: "codigoPostal",
        header: "Código Postal",
        cell: ({ row }) => <div> {row.getValue("codigoPostal")} </div>,
    },
    {
        accessorKey: "telefono",
        header: "Telefono",
        cell: ({ row }) => <div> {row.getValue("telefono")} </div>,
    },
    {
        accessorKey: "contacto",
        header: "Contacto",
        cell: ({ row }) => <div> {row.getValue("contacto")} </div>,
    }, {
        accessorKey: "razonSocial",
        header: "Razon Social",
        cell: ({ row }) => <div> {row.getValue("razonSocial")} </div>,
    },
    {
        accessorKey: "cuit",
        header: "Cuit",
        cell: ({ row }) => <div> {row.getValue("cuit")} </div>,
    },
    {
        accessorKey: "direccionFiscal",
        header: "Direccion Fiscal",
        cell: ({ row }) => <div> {row.getValue("direccionFiscal")} </div>,
    },
    {
        accessorKey: "telefonoContacto",
        header: "Tel contacto",
        cell: ({ row }) => <div> {row.getValue("telefonoContacto")} </div>,
    },
    {
        accessorKey: "formaDePago",
        header: "Forma de Pago",
        cell: ({ row }) => <div> {row.getValue("formaDePago")} </div>,
    },
    {
        accessorKey: "detalles",
        header: "Detalles",
        cell: ({ row }) => <div> {row.getValue("detalles")} </div>,
    },
    {
        id: "acciones",
        cell: ({ row }) => {


            return <DataTableRowActions data={row.original} />;
        },
    }
]