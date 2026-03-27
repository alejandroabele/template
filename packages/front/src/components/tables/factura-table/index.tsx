"use client";
import {
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetFacturasQuery } from "@/hooks/factura";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Factura } from "@/types";
import { CobroTable } from "@/components/tables/cobro-table";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign } from "lucide-react";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { CobroMasivoDialog } from "@/components/dialogs/cobro-masivo-dialog";

type FacturaTableProps = {
  // Modo detalle (presupuesto/alquiler)
  id?: number;
  modelo?: "presupuesto" | "alquiler";
  externalFilters?: ColumnFiltersState;
  showPagination?: boolean;
  onNotificar?: (filtros: ColumnFiltersState) => void;
};

export function FacturaTable({
  id,
  modelo,
  externalFilters,
  showPagination = false,
  onNotificar,
}: FacturaTableProps) {
  const modoDashboard = !id && !modelo;

  const [sorting, setSorting] = React.useState<SortingState>(
    modoDashboard ? [] : [{ id: "id", desc: true }]
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    modoDashboard
      ? externalFilters || []
      : [
          { id: "modeloId", value: id },
          { id: "modelo", value: modelo },
        ]
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [cobroMasivoOpen, setCobroMasivoOpen] = React.useState(false);

  // Sincronizar filtros externos
  React.useEffect(() => {
    if (modoDashboard && externalFilters) {
      setColumnFilters(externalFilters);
      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  }, [modoDashboard, externalFilters]);

  const { data: facturas = [], isLoading: isLoadingFacturas } =
    useGetFacturasQuery({
      pagination,
      columnFilters,
      sorting,
      globalFilter,
    });

  const table = useReactTable({
    data: facturas,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    getRowId: (row) => String(row.id),
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

  const canNotificar = hasPermission(PERMISOS.ENVIO_NOTIFICACION_CREAR);
  const canCrearCobro = hasPermission(PERMISOS.COBRO_CREAR);

  if (isLoadingFacturas) return <SkeletonTable />;

  const renderCobrosSubComponent = (factura: Factura) => {
    return <CobroTable facturaId={factura.id} toolbar={true} />;
  };

  const selectedRows = table.getSelectedRowModel().rows;
  const haySeleccion = selectedRows.length > 0;
  const facturasSeleccionadas = selectedRows.map((r) => r.original);

  const handleNotificarClick = () => {
    if (!onNotificar) return;
    if (haySeleccion) {
      const ids = selectedRows.map((r) => r.original.id);
      onNotificar([{ id: "id", value: ids }]);
    } else {
      onNotificar(columnFilters);
    }
  };

  const handleCobroMasivoClick = () => {
    setCobroMasivoOpen(true);
  };

  const customActions = modoDashboard ? (
    <div className="flex gap-2">
      {canCrearCobro && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCobroMasivoClick}
          disabled={!haySeleccion || selectedRows.length < 2}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          {haySeleccion && selectedRows.length > 1
            ? `Cobro Masivo (${selectedRows.length})`
            : "Cobro Masivo"}
        </Button>
      )}
      {onNotificar && canNotificar && (
        <Button variant="outline" size="sm" onClick={handleNotificarClick}>
          <Bell className="h-4 w-4 mr-2" />
          {haySeleccion
            ? `Notificar (${selectedRows.length} seleccionadas)`
            : `Notificar${columnFilters.length > 0 ? " (filtrado)" : ""}`}
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        toolbar={true}
        renderSubComponent={renderCobrosSubComponent}
        pagination={showPagination}
        customActions={customActions}
      />

      {cobroMasivoOpen && (
        <CobroMasivoDialog
          open={cobroMasivoOpen}
          setOpen={setCobroMasivoOpen}
          facturas={facturasSeleccionadas}
        />
      )}
    </>
  );
}
