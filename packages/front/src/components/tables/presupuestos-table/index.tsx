"use client";
import {
  // ColumnFiltersState,
  PaginationState,
  // SortingState,
  // VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  useGetPresupuestosQuery,
  useDownloadPresupuestosExcel,
} from "@/hooks/presupuestos";
import { useStore } from "./store";
import { DownloadButton } from "@/components/ui/download-button";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useColumns } from "./columns";
import { hasPermission } from "@/hooks/use-access";
import { getColumnVisibility } from "@/utils/datatable";
import { PERMISOS } from "@/constants/permisos";

export function PresupuestosTable() {
  //const [sorting, setSorting] = React.useState<SortingState>([])
  // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useColumns();

  // const user = useGlobalStore((state) => state.user)
  // const columns = getColumnsByRole(user?.role)    //  TODO: Ver si tiene sentido persistir la paginacion..
  const {
    setSorting,
    sorting,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
  } = useStore();
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [rowSelection, setRowSelection] = React.useState({});
  const { data = [], isLoading } = useGetPresupuestosQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });
  const { mutate } = useDownloadPresupuestosExcel();
  const create = hasPermission(PERMISOS.PRESUPUESTOS_CREAR);

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
        create={create}
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
