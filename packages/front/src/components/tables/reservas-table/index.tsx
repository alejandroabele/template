"use client";
import {
    ColumnFiltersState,
    ExpandedState,
    PaginationState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetReservasQuery, useDownloadReservasExcel } from "@/hooks/reserva";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { ReservaItemsTable } from "@/components/tables/reserva-items-table";
import { Reserva } from "@/types";
import { DownloadButton } from "@/components/ui/download-button";

export function ReservasTable() {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "id", desc: true }
    ]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data = [], isLoading } = useGetReservasQuery({
        pagination,
        columnFilters,
        sorting,
        globalFilter,
    });

    const { mutate: downloadExcel } = useDownloadReservasExcel();

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        getRowId: (row) => String(row.id),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
            expanded,
        },
    });

    if (isLoading) return <SkeletonTable />;

    return (
        <DataTable
            table={table}
            columns={columns}
            renderSubComponent={(row: Reserva) => (
                <ReservaItemsTable reservaId={row.id!} />
            )}
            customActions={
                <DownloadButton
                    onClick={() => downloadExcel({ pagination, columnFilters, sorting, globalFilter })}
                />
            }
        />
    );
}
