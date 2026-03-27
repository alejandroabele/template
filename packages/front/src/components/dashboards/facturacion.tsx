"use client";

import { useState } from "react";
import { FacturacionMetricasCards } from "@/components/charts/facturacion/facturacion-metricas-cards";
import { FacturacionGraficoBarras } from "@/components/charts/facturacion/facturacion-grafico-barras";
import { FacturacionEstadisticasMensuales } from "@/components/charts/facturacion/facturacion-estadisticas-mensuales";
import { FacturaTable } from "@/components/tables/factura-table";
import { useGetFacturasQuery } from "@/hooks/factura";
import { SeparatorWithText } from "../ui/separator-with-text";
import { ColumnFiltersState } from "@tanstack/react-table";
import { NotificacionDialog } from "@/components/dialogs/notificacion-dialog";

export default function FacturacionDashboard() {
  const [filtrosExternos, setFiltrosExternos] = useState<ColumnFiltersState>(
    []
  );
  const [notificacionOpen, setNotificacionOpen] = useState(false);
  const [filtrosNotificacion, setFiltrosNotificacion] =
    useState<ColumnFiltersState>([]);

  const handleNotificar = (filtros: ColumnFiltersState) => {
    setFiltrosExternos(filtros);
    setFiltrosNotificacion(filtros);
    setNotificacionOpen(true);
  };

  // Obtener todas las facturas (ya incluyen cobros por relación)
  const { data: todasFacturas = [], isLoading: isLoadingFacturas } =
    useGetFacturasQuery({
      pagination: { pageIndex: 0, pageSize: 10000 },
      columnFilters: [],
      sorting: [],
      globalFilter: "",
    });

  const handleApplyFilter = (filtros: ColumnFiltersState) => {
    setFiltrosExternos((prev) => {
      // Si los filtros son vacíos, limpiar
      if (filtros.length === 0) return [];

      // Verificar si es el mismo filtro (toggle)
      const sonIguales =
        prev.length === filtros.length &&
        prev.every((prevFilter) => {
          const filtro = filtros.find((f) => f.id === prevFilter.id);
          if (!filtro) return false;
          return (
            JSON.stringify(prevFilter.value) === JSON.stringify(filtro.value)
          );
        });

      // Si es el mismo filtro, limpiar (toggle off)
      if (sonIguales) return [];

      // Aplicar nuevo filtro
      return filtros;
    });
  };

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <FacturacionMetricasCards
        facturas={todasFacturas}
        isLoading={isLoadingFacturas}
        onApplyFilter={handleApplyFilter}
        filtrosActivos={filtrosExternos}
        onNotificar={handleNotificar}
      />

      {/* Gráficos en la misma fila */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de proyección de cobranzas */}
        <FacturacionGraficoBarras
          onApplyFilter={handleApplyFilter}
          filtrosActivos={filtrosExternos}
        />

        {/* Gráfico de estadísticas mensuales */}
        <FacturacionEstadisticasMensuales
          onApplyFilter={handleApplyFilter}
          filtrosActivos={filtrosExternos}
        />
      </div>

      {/* Tabla de facturas */}
      <div>
        <SeparatorWithText className="mb-4">Facturas</SeparatorWithText>
        <FacturaTable
          showPagination={true}
          externalFilters={filtrosExternos}
          onNotificar={handleNotificar}
        />
      </div>

      <NotificacionDialog
        open={notificacionOpen}
        onOpenChange={setNotificacionOpen}
        modelo="factura"
        columnFilters={filtrosNotificacion}
      />
    </div>
  );
}
