"use client";
import { useState } from "react";
import { useGetEnCursoQuery, useGetEstadisticasJornadaQuery } from "@/hooks/jornada";
import { useGetRefrigerioEstadisticasQuery, useGetRefrigeriosEnCursoQuery } from "@/hooks/refrigerio";
import DashboardEnCurso from "@/components/dashboards/dashboard-en-curso";
import { SelectorPeriodo, RangoFecha } from "@/components/selector-periodo";
import { GraficoActividadDiaria } from "@/components/charts/produccion/grafico-actividad-diaria";
import { GraficoOperarios } from "@/components/charts/produccion/grafico-operarios";
import { GraficoTiempoPorOT } from "@/components/charts/produccion/grafico-tiempo-por-ot";
import { TrazabilidadTable } from "@/components/tables/trazabilidad-table";
import { duracionMinutos, agruparPorDia, minutosAHHmm } from "@/utils/produccion";
import { MetricCard } from "@/components/ui/metric-card";
import { Activity, Clock, Users, Wrench } from "lucide-react";

export default function EstadisticasProduccionPage() {
  const [rango, setRango] = useState<RangoFecha>(() => {
    const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
    const [y, m] = hoy.split("-").map(Number);
    const ultimoDia = new Date(y, m, 0).getDate();
    return { from: `${hoy.slice(0, 7)}-01`, to: `${hoy.slice(0, 7)}-${String(ultimoDia).padStart(2, "0")}` };
  });

  const { data: enCurso = [], isLoading: cargandoEnCurso } = useGetEnCursoQuery();
  const { data: refrigeriosEnCurso = [] } = useGetRefrigeriosEnCursoQuery();

  const { data: trazabilidades = [] } = useGetEstadisticasJornadaQuery(rango);
  const { data: refrigerios = [] } = useGetRefrigerioEstadisticasQuery(rango ? { desde: rango.from, hasta: rango.to } : undefined);

  const finalizadas = trazabilidades.filter((t) => !!t.fin && !!t.inicio);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalSesiones = finalizadas.length;
  const totalMinutos = finalizadas.reduce((acc, t) => acc + duracionMinutos(t.inicio!, t.fin!), 0);
  const totalHoras = minutosAHHmm(totalMinutos);
  const operariosUnicos = new Set(finalizadas.map((t) => t.personaId).filter(Boolean)).size;

  const frecuenciaTipo: Record<string, number> = {};
  for (const t of finalizadas) {
    const tipo = t.produccionTrabajo?.nombre ?? "Sin tipo";
    frecuenciaTipo[tipo] = (frecuenciaTipo[tipo] ?? 0) + 1;
  }
  const [tipoFrecuente, tipoFrecuenteCount] =
    Object.entries(frecuenciaTipo).sort((a, b) => b[1] - a[1])[0] ?? ["-", 0];

  // ── Actividad diaria — horas trabajadas por día (solo finalizadas) ─────
  const actividadDiaria = agruparPorDia(finalizadas, "inicio", "fin");

  function formatFecha(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  const descripcionPeriodo = rango
    ? `Sesiones del ${formatFecha(rango.from)} al ${formatFecha(rango.to)}`
    : "Todas las sesiones";

  // ── Por operario ──────────────────────────────────────────────────────────
  const mapOperario: Record<number, { nombre: string; minutos: number; sesiones: number; minutosRefrigerio: number }> = {};
  for (const t of finalizadas) {
    if (!t.personaId) continue;
    const min = duracionMinutos(t.inicio!, t.fin!);
    if (!mapOperario[t.personaId]) {
      mapOperario[t.personaId] = {
        nombre: `${t.persona?.nombre ?? ""} ${t.persona?.apellido ?? ""}`.trim(),
        minutos: 0,
        sesiones: 0,
        minutosRefrigerio: 0,
      };
    }
    mapOperario[t.personaId].minutos += min;
    mapOperario[t.personaId].sesiones += 1;
  }
  for (const r of refrigerios) {
    if (!r.personaId || !r.inicio || !r.fin) continue;
    const minRef = duracionMinutos(r.inicio, r.fin);
    if (!mapOperario[r.personaId]) {
      mapOperario[r.personaId] = {
        nombre: `${r.persona?.nombre ?? ""} ${r.persona?.apellido ?? ""}`.trim(),
        minutos: 0,
        sesiones: 0,
        minutosRefrigerio: 0,
      };
    }
    mapOperario[r.personaId].minutosRefrigerio += minRef;
  }
  const porOperario = Object.values(mapOperario)
    .sort((a, b) => b.minutos - a.minutos)
    .map((op) => ({ ...op, horas: parseFloat((op.minutos / 60).toFixed(1)) }));

  // ── Por OT ────────────────────────────────────────────────────────────────
  const mapOT: Record<number, { otId: number; cliente: string; minutos: number }> = {};
  for (const t of finalizadas) {
    const otId = t.jornada?.presupuesto?.id;
    if (!otId) continue;
    const cliente = t.jornada?.presupuesto?.cliente?.nombre ?? "Sin cliente";
    const min = duracionMinutos(t.inicio!, t.fin!);
    if (!mapOT[otId]) mapOT[otId] = { otId, cliente, minutos: 0 };
    mapOT[otId].minutos += min;
  }
  const porOT = Object.values(mapOT);

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Estadísticas de Producción</h1>
        <SelectorPeriodo value={rango} onChange={setRango} />
      </div>

      {/* ── 4 KPI cards ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          titulo="Total sesiones"
          texto={String(totalSesiones)}
          icon={Activity}
          color="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-950"
        >
          finalizadas en el período
        </MetricCard>
        <MetricCard
          titulo="Horas registradas"
          texto={totalHoras}
          icon={Clock}
          color="text-violet-600"
          bgColor="bg-violet-50 dark:bg-violet-950"
        >
          {totalMinutos} min totales
        </MetricCard>
        <MetricCard
          titulo="Operarios activos"
          texto={String(operariosUnicos)}
          icon={Users}
          color="text-emerald-600"
          bgColor="bg-emerald-50 dark:bg-emerald-950"
        >
          únicos en el período
        </MetricCard>
        <MetricCard
          titulo="Trabajo más frecuente"
          texto={tipoFrecuente}
          icon={Wrench}
          color="text-orange-600"
          bgColor="bg-orange-50 dark:bg-orange-950"
        >
          {tipoFrecuente !== "-" ? `${tipoFrecuenteCount} sesiones` : "Sin datos"}
        </MetricCard>
      </div>

      {/* ── En curso ahora ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-lg font-semibold">En curso ahora</h2>
        </div>
        {cargandoEnCurso ? (
          <p className="text-muted-foreground text-sm">Cargando...</p>
        ) : (
          <DashboardEnCurso sesiones={enCurso} refrigerios={refrigeriosEnCurso} />
        )}
      </section>

      {/* ── Actividad diaria — ancho completo ──────────────────────────────── */}
      <GraficoActividadDiaria data={actividadDiaria} descripcionPeriodo={descripcionPeriodo} />

      {/* ── Grilla: operarios + tiempo por OT ──────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GraficoOperarios data={porOperario} />
        <GraficoTiempoPorOT data={porOT} />
      </div>

      {/* ── Tabla de trazabilidades ─────────────────────────────────────────── */}
      <TrazabilidadTable data={trazabilidades} />

    </div>
  );
}

