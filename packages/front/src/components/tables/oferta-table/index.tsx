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
import { useGetOfertasQuery } from "@/hooks/oferta";
import { columns } from "./columns";
import { columnsSimple } from "./columns-simple";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { CambiarColorOfertasDialog } from "@/components/dialogs/cambiar-color-ofertas-dialog";
import type { Oferta } from "@/types";

type OfertaTableProps = {
  solcomId?: number;
  simple?: boolean;
  toolbar?: boolean;
};

export function OfertaTable({ solcomId, simple = false }: OfertaTableProps) {
  const router = useRouter();
  const [openColorDialog, setOpenColorDialog] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filtersWithSolcom = React.useMemo(() => {
    if (solcomId) {
      return [...columnFilters, { id: "solcom.id", value: solcomId }];
    }
    return columnFilters;
  }, [columnFilters, solcomId]);

  const {
    data = [],
    isLoading,
    refetch,
  } = useGetOfertasQuery({
    pagination,
    columnFilters: filtersWithSolcom,
    sorting,
    globalFilter,
  });

  const tableColumns = simple ? columnsSimple : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
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

  if (simple) {
    return (
      <DataTable
        table={table}
        columns={tableColumns}
        toolbar={true}
        pagination={false}
        customActions={
          <Button
            size="sm"
            className="h-8"
            onClick={handleCompararClick}
            disabled={selectedCount === 0}
          >
            Comparar {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <DataTable
        table={table}
        columns={tableColumns}
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
