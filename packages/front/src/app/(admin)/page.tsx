"use client";
import DashboardAdmin from "@/components/dashboards/admin";
import DashboardProduccion from "@/components/dashboards/produccion";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

export default function HomePage() {
  // Verificar acceso a la página principal

  // Verificar qué componentes puede ver el usuario actual
  const canViewProduccion = hasPermission(
    PERMISOS.PRESUPUESTOS_PRODUCCION_DASHBOARD
  );
  const canViewServicio = hasPermission(
    PERMISOS.PRESUPUESTOS_SERVICIOS_DASHBOARD
  );
  const canViewOthers = hasPermission(PERMISOS.ALQUILERES_DASHBOARD);

  return (
    <>
      {canViewProduccion && <DashboardProduccion showServicio={false} />}
      {canViewServicio && <DashboardProduccion showProduccion={false} />}

      {canViewOthers && <DashboardAdmin />}
    </>
  );
}
