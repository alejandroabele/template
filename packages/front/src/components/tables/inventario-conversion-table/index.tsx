'use client'
import {
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import React from 'react'
import { DataTable } from "@/components/ui/data-table"
import { useGetInventarioConversionsQuery } from "@/hooks/inventario-conversion"
import { columns } from './columns'
import { SkeletonTable } from '@/components/skeletons/skeleton-table'
import { Button } from "@/components/ui/button"
import { InventarioConversionDialog } from "@/components/dialogs/inventario-conversion-dialog"
import { Inventario } from "@/types"


export function InventarioConversionTable({ inventario }: { inventario: Inventario | undefined }) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'id', desc: true }
    ])
    const [openEdit, setOpenEdit] = React.useState(false)

    const [globalFilter, setGlobalFilter] = React.useState(""); // Estado del filtro
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        inventario?.id ? [{ id: 'inventarioId', value: inventario.id }] : []
    )
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { data = [], isLoading } = useGetInventarioConversionsQuery({ pagination, columnFilters, sorting, globalFilter })
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
            {openEdit && <InventarioConversionDialog open={openEdit} setOpen={setOpenEdit} inventario={inventario} />}

            <DataTable table={table} columns={columns} toolbar={
                <Button size="sm" type="button" onClick={() => setOpenEdit(true)}>Agregar</Button>
            }
            />
        </>
    )
}

