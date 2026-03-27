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
import { useGetOrdenComprasQuery } from "@/hooks/orden-compra";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useOrdenCompraTableStore } from "./store";

export function OrdenCompraTable({ solcomId }: { solcomId?: number }) {
  // Cuando se usa dentro de una solcom, estado local sin persistencia
  const esContextoSolcom = solcomId !== undefined;

  const store = useOrdenCompraTableStore();

  // Estado local para cuando se usa en contexto de solcom
  const [localSorting, setLocalSorting] = React.useState<SortingState>([{ id: "id", desc: true }]);
  const [localPagination, setLocalPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [localColumnVisibility, setLocalColumnVisibility] = React.useState<VisibilityState>({});
  const [localColumnFilters, setLocalColumnFilters] = React.useState<ColumnFiltersState>([]);

  const sorting = esContextoSolcom ? localSorting : store.sorting;
  const setSorting = esContextoSolcom ? setLocalSorting : store.setSorting;
  const pagination = esContextoSolcom ? localPagination : store.pagination;
  const setPagination = esContextoSolcom ? setLocalPagination : store.setPagination;
  const columnVisibility = esContextoSolcom ? localColumnVisibility : store.columnVisibility;
  const setColumnVisibility = esContextoSolcom ? setLocalColumnVisibility : store.setColumnVisibility;
  const columnFilters = esContextoSolcom ? localColumnFilters : store.columnFilters;
  const setColumnFilters = esContextoSolcom ? setLocalColumnFilters : store.setColumnFilters;

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const filtersWithSolcom = React.useMemo(() => {
    if (solcomId) {
      return [...columnFilters, { id: "solcomItem.solcom.id", value: solcomId }];
    }
    return columnFilters;
  }, [columnFilters, solcomId]);

  const { data = [], isLoading } = useGetOrdenComprasQuery({
    pagination,
    columnFilters: filtersWithSolcom,
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
      <DataTable table={table} columns={columns} toolbar />
    </>
  );
}
