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
import { useGetCobrosQuery } from "@/hooks/cobro";
import { createColumns } from "./columns";
import { columnsSimple } from "./columns-simple";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

type CobroTableProps = {
  // Uso antiguo (presupuesto/alquiler)
  id?: number;
  modelo?: "presupuesto" | "alquiler";
  // Uso nuevo (factura)
  facturaId?: number;
  // Controla si se muestra toolbar y qué columnas usar
  toolbar?: boolean;
};

export function CobroTable({
  id,
  modelo,
  facturaId,
  toolbar = true,
}: CobroTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>(
    toolbar ? [{ id: "id", desc: true }] : []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Construir filtros iniciales según los parámetros
  const initialFilters: ColumnFiltersState = [];
  if (id && modelo) {
    initialFilters.push({ id: "modeloId", value: id });
    initialFilters.push({ id: "modelo", value: modelo });
  }
  if (facturaId) {
    initialFilters.push({ id: "facturaId", value: facturaId });
  }

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialFilters);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data = [], isLoading } = useGetCobrosQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });

  // Usar columnas completas o simples según toolbar
  const columns = React.useMemo(() => {
    if (toolbar && modelo && id) {
      return createColumns({ modelo, modeloId: id });
    }
    return columnsSimple;
  }, [toolbar, modelo, id]);

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
    <DataTable
      table={table}
      columns={columns}
      toolbar={toolbar}
      pagination={!toolbar}
    />
  );
}
