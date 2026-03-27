"use client";
import { DashboardFechasCard } from "@/components/charts/presupuestos/dashboard-fechas-card";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";
import { DASHBOARD_PRESUPUESTOS_CONFIG } from "@/config/dashboard-presupuestos";

export default function Dashboard() {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-2 items-start">
          {hasPermission(PERMISOS.PRESUPUESTOS_DASHBOARD) &&
            DASHBOARD_PRESUPUESTOS_CONFIG.DASHBOARD_CARDS.map((card) => (
              <DashboardFechasCard
                key={card.key}
                titulo={card.titulo}
                color={card.color}
                procesos={card.procesos}
                tipo={card.tipo}
                linkDestino={card.linkDestino}
                options={card.options}
              />
            ))}
        </div>
      </div>
    </>
  );
}
