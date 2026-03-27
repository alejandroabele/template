"use client";
import {
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  useGetPresupuestosQuery,
  useDownloadPresupuestosExcel,
} from "@/hooks/presupuestos";
import { DownloadButton } from "@/components/ui/download-button";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useColumns } from "@/components/tables/presupuestos-table/columns";
import { getColumnVisibility } from "@/utils/datatable";
import { useStore } from "@/components/tables/presupuestos-table/store";

type AlquilerPresupuestosTableProps = {
  id: string;
};
export function AlquilerPresupuestosTable({
  id,
}: AlquilerPresupuestosTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: "alquilerRecursoId",
      value: id,
    },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useColumns();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const { data = [], isLoading } = useGetPresupuestosQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });
  const { mutate } = useDownloadPresupuestosExcel();
  const { columnVisibility, setColumnVisibility } = useStore();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting, // Actualiza el sorting en zustand directamente
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
      {/* <DataTable table={table} columns={columns} toolbar={<DataTableToolbar table={table} />}> */}
      <DataTable
        table={table}
        columns={columns}
        toolbar
        create={false}
        deleteFilters={false}
        download={
          <DownloadButton
            onClick={() =>
              mutate({
                pagination,
                columnFilters,
                sorting,
                globalFilter,
                columnVisibility: getColumnVisibility(
                  columns,
                  columnVisibility
                ),
              })
            }
          />
        }
      />
    </>
  );
}
