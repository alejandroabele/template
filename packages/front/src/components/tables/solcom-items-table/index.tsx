"use client";
import {
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { columnsSimple } from "./columns-simple";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useSolcomItemsTableStore } from "./store";
import {
  useGetSolcomItemsQuery,
  useGetAllSolcomItemsQuery,
} from "@/hooks/solcom";
import { Button } from "@/components/ui/button";
import { AsignarCompradorDialog } from "@/components/dialogs/asignar-comprador-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SolcomItemsTableProps {
  solcomId?: number;
  toolbar?: boolean; // Si es false, no muestra toolbar, filtros, ni paginación
  simple?: boolean; // Si es true, usa columnas simples (sin acciones)
}

export function SolcomItemsTable({
  solcomId,
  toolbar = true,
}: SolcomItemsTableProps) {
  const router = useRouter();
  const {
    selectedItemIds,
    setSelectedItemIds,
    setSorting,
    sorting,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    rowSelection,
    updateRowSelection,
    pagination,
    setPagination,
  } = useSolcomItemsTableStore();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openAsignarDialog, setOpenAsignarDialog] = React.useState(false);

  const tableColumns = toolbar ? columns : columnsSimple;

  // Usar el hook correcto según si hay solcomId o no
  const { data: itemsData = [], isLoading: itemsLoading } =
    useGetSolcomItemsQuery(solcomId || 0);
  const { data: allItemsData = [], isLoading: allItemsLoading } =
    useGetAllSolcomItemsQuery({
      pagination,
      columnFilters,
      sorting,
      globalFilter,
    });

  const data = solcomId ? itemsData : allItemsData;
  const isLoading = solcomId ? itemsLoading : allItemsLoading;

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: updateRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: toolbar,
    getRowId: (row) => String(row.id),
    manualPagination: toolbar,
    manualFiltering: toolbar,
    manualSorting: toolbar,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  const handleCrearOferta = () => {
    if (selectedItemIds.length > 0) {
      const queryParams = new URLSearchParams({
        solcomItemIds: selectedItemIds.join(","),
      });
      router.push(`/ofertas/crear?${queryParams.toString()}`);
    } else {
      router.push("/ofertas/crear");
    }
  };

  const handleAsignar = () => {
    if (selectedItemIds.length === 0) {
      toast.error("Selecciona al menos un item");
      return;
    }
    setOpenAsignarDialog(true);
  };

  const handleAsignarSuccess = () => {
    setSelectedItemIds([]);
    window.location.reload();
  };

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      {toolbar && !solcomId && (
        <AsignarCompradorDialog
          open={openAsignarDialog}
          setOpen={setOpenAsignarDialog}
          mode="items"
          itemIds={selectedItemIds}
          onSuccess={handleAsignarSuccess}
        />
      )}

      <DataTable
        table={table}
        columns={tableColumns}
        {...(!toolbar && {
          toolbar: true,
        })}
        pagination={toolbar}
        customActions={
          toolbar && !solcomId ? (
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8" onClick={handleCrearOferta}>
                Crear Oferta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleAsignar}
                disabled={selectedItemIds.length === 0}
              >
                Asignar a mí
              </Button>
            </div>
          ) : undefined
        }
      />
    </>
  );
}
