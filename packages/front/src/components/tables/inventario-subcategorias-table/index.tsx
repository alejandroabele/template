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
import { useGetInventarioSubcategoriasQuery } from "@/hooks/inventario-subcategoria";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export function SubcategoriasTable({
  inventarioCategoriaId,
}: {
  inventarioCategoriaId: number | null | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: "inventarioCategoriaId",
      value: inventarioCategoriaId,
    },
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data = [], isLoading } = useGetInventarioSubcategoriasQuery({
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
