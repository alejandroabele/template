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
import { useGetContratoMarcoTalonariosQuery } from "@/hooks/contrato-marco-talonario";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export function ContratosMarcoTalonarioTable({
  id,
}: {
  id: number | null | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState(""); // Estado del filtro
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: "contratoMarcoId",
      value: id,
    },
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data = [], isLoading } = useGetContratoMarcoTalonariosQuery({
    pagination,
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
      pagination,
      globalFilter,
    },
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  );
}
