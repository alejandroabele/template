"use client";

import { PresupuestosFechasChart } from "@/components/charts/presupuestos/presupuestos-fechas-chart";

// Tipos para el registro de componentes
export type ComponenteChartType = keyof typeof COMPONENTES_CHART;

interface DashboardChartRendererProps {
  componente: ComponenteChartType;
  agrupacion: {
    id: number;
    nombre: string;
    procesos: number[];
    color: string;
    componente?: ComponenteChartType;
  };
  tipo: "fabricacion" | "entrega" | "auditoria";
}

// Registro de componentes disponibles
const COMPONENTES_CHART = {
  PresupuestosFechasChart: PresupuestosFechasChart,
} as const;

export function DashboardChartRenderer({
  componente,
  agrupacion,
  tipo,
}: DashboardChartRendererProps) {
  if (!COMPONENTES_CHART[componente]) {
    return (
      <div className="text-center p-8 text-red-500">
        Componente &quot;{componente}&quot; no encontrado
      </div>
    );
  }

  // Por defecto usar PresupuestosFechasChart
  return (
    <PresupuestosFechasChart
      agrupacion={agrupacion}
      tipo={tipo as "fabricacion" | "entrega"}
    />
  );
}
