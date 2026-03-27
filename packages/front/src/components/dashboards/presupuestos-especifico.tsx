"use client";

import { useSearchParams } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";
import {
  getDashboardConfig,
  getChartComponent,
} from "@/config/dashboard-presupuestos";

export default function DashboardPresupuestosEspecifico({
  dashboard,
}: {
  dashboard: string;
}) {
  const searchParams = useSearchParams();
  const config = getDashboardConfig(dashboard);

  if (!config) {
    return <div>Dashboard no encontrado</div>;
  }

  // Leer parámetros de la URL
  const anio = searchParams.get("anio")
    ? parseInt(searchParams.get("anio")!)
    : new Date().getFullYear();
  const mes = searchParams.get("mes")
    ? parseInt(searchParams.get("mes")!)
    : new Date().getMonth() + 1;

  const procesos = searchParams.get("procesos")
    ? searchParams
        .get("procesos")!
        .split(",")
        .map((p) => parseInt(p))
    : config.procesos;
  const campoFecha = searchParams.get("campoFecha") || undefined;
  const variante = searchParams.get("variante") || undefined;

  const agrupacion = {
    id: config.id,
    nombre: config.titulo,
    procesos: procesos,
    color: config.color,
  };

  // Obtener el componente dinámicamente
  const ChartComponent = getChartComponent(config.componente);

  return (
    <>
      <PageTitle title={`Dashboard - ${config.titulo}`} />

      <div className="flex justify-center py-4">
        <div className="w-full h-[70vh] min-h-[500px]">
          {hasPermission(PERMISOS.PRESUPUESTOS_DASHBOARD) && ChartComponent && (
            <ChartComponent
              agrupacion={agrupacion}
              tipo={config.tipo}
              anio={anio}
              mes={mes}
              campoFecha={campoFecha}
              variante={variante}
            />
          )}
        </div>
      </div>
    </>
  );
}
