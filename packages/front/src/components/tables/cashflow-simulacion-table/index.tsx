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
import { useGetSimulaciones } from "@/hooks/cashflow-simulacion";
import { getColumns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Button } from "@/components/ui/button";
import { Plus, FlaskConical } from "lucide-react";
import { CashflowSimulacion } from "@/types";
import CashflowSimulacionDialog from "@/components/dialogs/cashflow-simulacion-dialog";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

export default function CashflowSimulacionTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSimulacion, setEditingSimulacion] = React.useState<CashflowSimulacion | undefined>();

  const handleEdit = (simulacion: CashflowSimulacion) => {
    setEditingSimulacion(simulacion);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingSimulacion(undefined);
    setDialogOpen(true);
  };

  const { data = [], isLoading } = useGetSimulaciones({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });

  const columns = React.useMemo(() => getColumns(handleEdit), []);

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

  const canCreate = hasPermission(PERMISOS.CASHFLOW_SIMULACION_CREAR);

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        toolbar={true}
        customActions={
          canCreate ? (
            <Button onClick={handleNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva simulación
            </Button>
          ) : undefined
        }
      />

      <CashflowSimulacionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingSimulacion(undefined);
        }}
        simulacion={editingSimulacion}
      />
    </>
  );
}
