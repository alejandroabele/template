"use client";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetOfertasQuery } from "@/hooks/oferta";
import { columns } from "../oferta-table/columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useMisOfertasTableStore } from "./store";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { CambiarColorOfertasDialog } from "@/components/dialogs/cambiar-color-ofertas-dialog";
import type { Oferta } from "@/types";

interface MisOfertasTableProps {
  // Add any props if needed in the future
}

export function MisOfertasTable({}: MisOfertasTableProps) {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [openColorDialog, setOpenColorDialog] = React.useState(false);

  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnVisibility,
    setColumnVisibility,
    columnFilters: storeColumnFilters,
    setColumnFilters,
  } = useMisOfertasTableStore();

  // Aplicar filtro de usuario si existe y no está ya aplicado
  const columnFilters = React.useMemo(() => {
    const hasCreatedByFilter = storeColumnFilters.some(
      (filter) => filter.id === "createdBy"
    );

    if (user?.userId && !hasCreatedByFilter) {
      return [...storeColumnFilters, { id: "createdBy", value: user.userId }];
    }

    return storeColumnFilters;
  }, [user?.userId, storeColumnFilters]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const {
    data = [],
    isLoading,
    refetch,
  } = useGetOfertasQuery({
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

  const handleCompararClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows
      .map((row) => row.original.id)
      .filter((id): id is number => id !== undefined);

    if (selectedIds.length === 0) {
      return;
    }

    router.push(`/ofertas/comparar?ofertas=${selectedIds.join(",")}`);
  };

  if (isLoading) return <SkeletonTable />;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedOfertas: Oferta[] = selectedRows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        toolbar
        customActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setOpenColorDialog(true)}
              disabled={selectedCount === 0}
            >
              <Palette className="mr-2 h-4 w-4" />
              Color
            </Button>

            <Button
              size="sm"
              className="h-8"
              onClick={handleCompararClick}
              disabled={selectedCount === 0}
            >
              Comparar {selectedCount > 0 && `(${selectedCount})`}
            </Button>
          </div>
        }
      />

      <CambiarColorOfertasDialog
        open={openColorDialog}
        onOpenChange={setOpenColorDialog}
        ofertas={selectedOfertas}
        onSuccess={() => {
          setRowSelection({});
          refetch();
        }}
      />
    </>
  );
}
