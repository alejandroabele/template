"use client";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetCashflowCategoriasQuery } from "@/hooks/cashflow-categoria";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export function CashflowCategoriaTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "id",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, error } = useGetCashflowCategoriasQuery({
    pagination,
    columnFilters,
    globalFilter,
    sorting,
  });

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (error) {
    return <div>Error al cargar las categorías de cashflow</div>;
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      searchPlaceholder="Buscar categorías..."
      createPath="/cashflow-categoria/crear"
    />
  );
}
