"use client";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetSolcomsQuery, useAsignarSolcomMutation } from "@/hooks/solcom";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { SolcomItemsTable } from "@/components/tables/solcom-items-table";
import { Solcom } from "@/types";
import { useSolcomTableStore } from "./store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AsignarCompradorDialog } from "@/components/dialogs/asignar-comprador-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SolcomTableProps {
  solcomIds?: number[]; // IDs específicos de SOLCOMs a mostrar
}

export function SolcomTable({ solcomIds }: SolcomTableProps) {
  const router = useRouter();
  // Usar el store de Zustand para persistencia (excepto viewMode que viene de URL)
  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    expanded,
    setExpanded,
    rowSelection,
    updateRowSelection,
    selectedSolcomIds,
    setSelectedSolcomIds,
    selectedItemIds,
    setSelectedItemIds,
  } = useSolcomTableStore();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openAsignarDialog, setOpenAsignarDialog] = React.useState(false);

  // Si hay solcomIds, agregar filtro por IDs
  const effectiveColumnFilters = React.useMemo(() => {
    if (solcomIds && solcomIds.length > 0) {
      return [...columnFilters, { id: "id", value: solcomIds }];
    }
    return columnFilters;
  }, [columnFilters, solcomIds]);

  const { data = [], isLoading } = useGetSolcomsQuery({
    pagination,
    columnFilters: effectiveColumnFilters,
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
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: updateRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
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
      expanded,
    },
  });

  const handleCrearOferta = () => {
    // Si hay SOLCOMs seleccionadas, enviar sus IDs
    if (selectedSolcomIds.length > 0) {
      const queryParams = new URLSearchParams({
        solcomIds: selectedSolcomIds.join(","),
      });
      router.push(`/ofertas/crear?${queryParams.toString()}`);
    } else {
      router.push("/ofertas/crear");
    }
  };

  const handleAsignar = () => {
    if (selectedSolcomIds.length === 0) {
      toast.error("Selecciona al menos una SOLCOM");
      return;
    }
    setOpenAsignarDialog(true);
  };

  const handleAsignarSuccess = () => {
    setSelectedSolcomIds([]);
    setSelectedItemIds([]);
    window.location.reload();
  };

  if (isLoading) return <SkeletonTable />;

  return (
    <>
      <AsignarCompradorDialog
        open={openAsignarDialog}
        setOpen={setOpenAsignarDialog}
        mode="solcoms"
        itemIds={selectedItemIds}
        solcomIds={selectedSolcomIds}
        onSuccess={handleAsignarSuccess}
      />

      <DataTable
        table={table}
        columns={columns}
        customActions={
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8" onClick={handleCrearOferta}>
              Crear Oferta
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAsignar}
              className="h-8"
              disabled={selectedSolcomIds.length === 0}
            >
              Asignar comprador
            </Button>
          </div>
        }
        renderSubComponent={(row: Solcom) => (
          <SolcomItemsTable solcomId={row.id!} toolbar={false} />
        )}
      />
    </>
  );
}
