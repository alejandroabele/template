"use client";

import { useState, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/date-range-picker";
import { CashflowTotalesCards } from "@/components/charts/cashflow/cashflow-totales-cards";
import { EvolucionIngresosEgresosChart } from "@/components/charts/cashflow/evolucion-ingresos-egresos-chart";
import { EvolucionSaldoAcumuladoChart } from "@/components/charts/cashflow/evolucion-saldo-acumulado-chart";
import { useGetTotalesPeriodo } from "@/hooks/cashflow-reportes";
import { CashflowCategoriaSelectorMultiple } from "@/components/selectors/cashflow-categoria-selector-multiple";

interface DateRange {
  from: string;
  to: string;
}

export default function CashflowDashboard() {
  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    return {
      from: format(thirtyDaysAgo, "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    };
  });

  // Estado para el modo de visualización de los charts
  const [chartMode, setChartMode] = useState<"dia" | "mes">("dia");

  // Estados para los filtros de categorías
  const [categoriasIngreso, setCategoriasIngreso] = useState<string[]>([]);
  const [categoriasEgreso, setCategoriasEgreso] = useState<string[]>([]);

  // Hook para obtener los totales del período
  const { data: totales, isLoading: isLoadingTotales } = useGetTotalesPeriodo(
    dateRange.from,
    dateRange.to,
    categoriasIngreso,
    categoriasEgreso
  );

  // Funciones para establecer períodos predefinidos
  const setLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    setDateRange({
      from: format(thirtyDaysAgo, "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    });
    setChartMode("dia");
  };

  const setCurrentMonth = () => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    setDateRange({
      from: format(firstDay, "yyyy-MM-dd"),
      to: format(lastDay, "yyyy-MM-dd"),
    });
    setChartMode("dia");
  };

  const setLast6Months = () => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    setDateRange({
      from: format(sixMonthsAgo, "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    });
    setChartMode("mes");
  };

  const handleDateRangeChange = (
    range: { from: string; to: string } | null
  ) => {
    if (range) {
      setDateRange(range);

      // Calcular automáticamente el modo basado en la duración del período
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      const diffInDays = Math.ceil(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Si el período es mayor a 90 días, usar vista mensual
      setChartMode(diffInDays > 90 ? "mes" : "dia");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Información del período seleccionado */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            {/* Controles de período */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="flex items-center space-x-2">
                <DateRangePicker
                  label=""
                  onChange={handleDateRangeChange}
                  defaultValue={dateRange}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={setLast30Days}>
                  Últimos 30 días
                </Button>
                <Button variant="outline" size="sm" onClick={setCurrentMonth}>
                  Mes actual
                </Button>
                <Button variant="outline" size="sm" onClick={setLast6Months}>
                  Últimos 6 meses
                </Button>
              </div>
            </div>

            {/* Filtros de categorías */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground">
                  Cat. Ingresos
                </label>
                <CashflowCategoriaSelectorMultiple
                  value={categoriasIngreso}
                  onChange={setCategoriasIngreso}
                  tipo="ingreso"
                />
              </div>
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-xs font-medium text-muted-foreground">
                  Cat. Egresos
                </label>
                <CashflowCategoriaSelectorMultiple
                  value={categoriasEgreso}
                  onChange={setCategoriasEgreso}
                  tipo="egreso"
                />
              </div>
            </div>

            {/* Selector de vista */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Vista
              </label>
              <Select
                value={chartMode}
                onValueChange={(value: "dia" | "mes") => setChartMode(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Diaria</SelectItem>
                  <SelectItem value="mes">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de totales */}
      <CashflowTotalesCards totales={totales} isLoading={isLoadingTotales} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EvolucionIngresosEgresosChart
          fechaInicio={dateRange.from}
          fechaFin={dateRange.to}
          modo={chartMode}
          categoriasIngreso={categoriasIngreso}
          categoriasEgreso={categoriasEgreso}
        />
        <EvolucionSaldoAcumuladoChart
          fechaInicio={dateRange.from}
          fechaFin={dateRange.to}
          modo={chartMode}
          categoriasIngreso={categoriasIngreso}
          categoriasEgreso={categoriasEgreso}
        />
      </div>
    </div>
  );
}
