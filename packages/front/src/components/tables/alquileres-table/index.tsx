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
  useGetAlquileresQuery,
  useDownloadAlquilerRecursosExcel,
} from "@/hooks/alquiler";
import { columns } from "./columns";
import { useStore } from "./store";
import { DownloadButton } from "@/components/ui/download-button";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Button } from "@/components/ui/button";
import { AlquilerActualizacionPreciosDialog } from "@/components/dialogs/alquiler-actualizacion-precios-dialog";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";

export function AlquileresTable() {
  //const [sorting, setSorting] = React.useState<SortingState>([])
  // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);

  //  TODO: Ver si tiene sentido persistir la paginacion..
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
  const { data = [], isLoading } = useGetAlquileresQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });
  const { mutate } = useDownloadAlquilerRecursosExcel();
  const isAdminVentas = hasPermission(PERMISOS.ALQUILERES_PRECIO_CREAR);

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

  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;
  return (
    <>
      <AlquilerActualizacionPreciosDialog
        open={updateDialogOpen}
        setOpen={setUpdateDialogOpen}
        selectedRows={selectedRows}
      />
      {/* <DataTable table={table} columns={columns} toolbar={<DataTableToolbar table={table} />}> */}
      <DataTable
        table={table}
        columns={columns}
        customActions={
          isAdminVentas && (
            <Button
              size="sm"
              className="ml-2 h-8"
              onClick={() => setUpdateDialogOpen(true)}
              disabled={!hasSelectedRows}
            >
              Actualizar precio
            </Button>
          )
        }
        download={
          <DownloadButton
            onClick={() =>
              mutate({ pagination, columnFilters, sorting, globalFilter })
            }
          />
        }
      />
    </>
  );
}
