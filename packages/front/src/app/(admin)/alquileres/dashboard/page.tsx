"use client";
import DashboardAdmin from "@/components/dashboards/admin";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";

export default function HomePage() {
  // Verificar acceso a la página principal

  // Verificar qué componentes puede ver el usuario actual

  const canViewOthers = hasPermission(PERMISOS.ALQUILERES_DASHBOARD);

  return <>{canViewOthers && <DashboardAdmin />}</>;
}
