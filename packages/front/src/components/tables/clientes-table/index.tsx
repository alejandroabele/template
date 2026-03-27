'use client'
import {
    // ColumnFiltersState,
    PaginationState,
    // SortingState,
    // VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import React from 'react'
import { DataTable } from "@/components/ui/data-table"
import { useGetClientesQuery } from "@/hooks/clientes"
import { columns } from './columns'
import { useStore } from './store'
import { SkeletonTable } from "@/components/skeletons/skeleton-table"

export function ClientesTable() {
    const { sorting, columnFilters, columnVisibility, setColumnFilters, setColumnVisibility, setSorting } = useStore()
    // const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState(""); // Estado del filtro
    // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    //     id: true,
    //     nombre: true,
    //     email: true,
    //     direccion: false,
    //     ciudad: false,
    //     codigoPostal: false,
    //     telefono: true,
    //     contacto: true,
    //     razonSocial: false,
    //     cuit: false,
    //     direccionFiscal: false,
    //     telefonoContacto: false,
    //     formaDePago: false,
    //     detalles: false
    // })
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { data = [], isLoading } = useGetClientesQuery({ pagination, columnFilters, sorting, globalFilter })
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter
        },
    })


    if (isLoading) return <SkeletonTable />

    return (
        <>
            <DataTable table={table} columns={columns} />
        </>
    )
}

