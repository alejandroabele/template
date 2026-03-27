"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import DashboardPresupuestosEspecifico from "@/components/dashboards/presupuestos-especifico";

export default function DashboardEspecificoPage() {
  const params = useParams();
  const dashboard = params.dashboard as string;

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DashboardPresupuestosEspecifico dashboard={dashboard} />
    </Suspense>
  );
}
