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
import { useGetBancoSaldosQuery } from "@/hooks/banco-saldo";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

type BancoSaldoTableProps = {
  bancoId?: number;
};

export function BancoSaldoTable({ bancoId }: BancoSaldoTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "fecha", desc: true }, // Ordenar por fecha descendente por defecto
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    bancoId ? [{ id: "bancoId", value: bancoId }] : []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data = [], isLoading } = useGetBancoSaldosQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });

  const table = useReactTable({
    data,
    columns: columns(!!bancoId), // Ocultar columna banco si se filtra por banco específico
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
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      <DataTable table={table} columns={columns(!!bancoId)} />
    </>
  );
}
