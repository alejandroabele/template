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
import { useGetCartelesQuery } from "@/hooks/cartel"
import { columns } from './columns'
import { useStore } from './store'
import { SkeletonTable } from '@/components/skeletons/skeleton-table'

export function CartelTable() {
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { setSorting, sorting, columnVisibility, setColumnVisibility, columnFilters, setColumnFilters } = useStore()

    const { data = [], isLoading } = useGetCartelesQuery({ pagination, columnFilters, sorting, globalFilter })

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
            globalFilter,
        },
    })

    if (isLoading) return <SkeletonTable />

    return (
        <>
            <DataTable table={table} columns={columns} />
        </>
    )
}
