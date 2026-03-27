"use client";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { JornadaPersona } from "@/types";
import { columns } from "./columns";

type Props = {
  data: JornadaPersona[];
  defaultDateFilter?: { from: string; to: string } | null;
};

export function TrazabilidadTable({ data, defaultDateFilter }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "inicio", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    defaultDateFilter
      ? [{ id: "inicio", value: JSON.stringify(defaultDateFilter) }]
      : []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    setColumnFilters(
      defaultDateFilter
        ? [{ id: "inicio", value: JSON.stringify(defaultDateFilter) }]
        : []
    );
  }, [defaultDateFilter]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    manualPagination: false,
    manualFiltering: false,
    manualSorting: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return <DataTable table={table} columns={columns} toolbar pagination />;
}
