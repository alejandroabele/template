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
  useGetInventarioQuery,
  useDeleteInventarioMutation,
  useDownloadInventarioExcel,
} from "@/hooks/inventario";
import { columns } from "./columns";
import { useStore } from "./store";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/hooks/use-access";
import { DownloadButton } from "@/components/ui/download-button";
import { MigracionExcelDialog } from "@/components/dialogs/migracion-excel-dialog";
import { Upload } from "lucide-react";
import { getColumnVisibility } from "@/utils/datatable";
import { PERMISOS } from "@/constants/permisos";

export function InventarioTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // TODO: revisar si estos permisos están bien
  const isAlmacen = hasPermission(PERMISOS.MOVIMIENTO_INVENTARIO_CREAR);
  const isAdmin = hasPermission(PERMISOS.INVENTARIO_IMPORTAR_EXCEL);
  const isEgreso = hasPermission(PERMISOS.INVENTARIO_EGRESO_MERCADERIA);
  const isIngreso = hasPermission(PERMISOS.INVENTARIO_INGRESO_MERCADERIA);
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
  const [openMigracion, setOpenMigracion] = React.useState(false);
  const { data = [], isLoading } = useGetInventarioQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });
  const { mutateAsync } = useDeleteInventarioMutation();
  const { mutate } = useDownloadInventarioExcel();

  const [openDelete, setOpenDelete] = React.useState(false); // Estado para el diálogo de eliminación
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
  console.log(columnFilters);
  const router = useRouter();

  if (isLoading) return <SkeletonTable />;
  const confirmDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    try {
      for (const id of selectedIds) {
        await mutateAsync(id); // Si falla, salta al catch y no sigue
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setOpenDelete(false);
      setRowSelection({});
    }
  };
  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        create={isAlmacen}
        onDelete={isAlmacen ? () => setOpenDelete(true) : false}
        customActions={
          isAlmacen ? (
            <div className="flex gap-2">
              {isIngreso && (
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    router.push("productos/ingreso");
                  }}
                >
                  Nuevo Ingreso
                </Button>
              )}
              {isEgreso && (
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    router.push("/inventario/egreso-masivo");
                  }}
                >
                  Nuevo Egreso
                </Button>
              )}
              {isAdmin && (
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => setOpenMigracion(true)}
                >
                  <Upload />
                </Button>
              )}
            </div>
          ) : null
        }
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
      {openDelete && (
        <DeleteDialog
          open={openDelete}
          onDelete={confirmDelete}
          onClose={() => setOpenDelete(false)} // <- Aquí faltaba el paréntesis de cierre
          message={
            table.getSelectedRowModel().rows.length === 1
              ? "¿Eliminar este producto? Esta acción no se puede deshacer."
              : `¿Eliminar los ${table.getSelectedRowModel().rows.length} productos seleccionados? Esta acción es irreversible.`
          }
        />
      )}
      <MigracionExcelDialog
        open={openMigracion}
        onClose={() => setOpenMigracion(false)}
      />
    </>
  );
}
