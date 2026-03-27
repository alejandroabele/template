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
import { useGetContratoMarcosQuery } from "@/hooks/contrato-marco";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { ContratosMarcoGrid } from "./grid-view";
import { useConfigStore } from "@/stores/config-store";

export function ContratosMarcoTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState(""); // Estado del filtro
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Usar el estado global del store
  const { viewMode } = useConfigStore();

  // Ajustar pageSize según el modo de vista para la query
  const effectivePagination =
    viewMode === "grid" ? { ...pagination, pageSize: 8 } : pagination;

  // Resetear a la primera página cuando cambie de vista
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [viewMode]);

  const { data = [], isLoading } = useGetContratoMarcosQuery({
    pagination: effectivePagination,
    columnFilters,
    sorting,
    globalFilter,
  });
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
      pagination: effectivePagination, // Usar la paginación efectiva
      globalFilter,
    },
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      {viewMode === "table" ? (
        <DataTable table={table} columns={columns} />
      ) : (
        <ContratosMarcoGrid data={data} table={table} />
      )}
    </>
  );
}
