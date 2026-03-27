"use client";

import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import {
  DeudaBarChart,
  type DeudaBarItem,
} from "@/components/charts/cashflow/deudas-por-categoria-chart";
import { useGetProyeccion } from "@/hooks/cashflow-reportes";
import { type DeudaCategoria } from "@/services/cashflow-transaccion";
import { TransaccionesPorFechaChart } from "@/components/charts/cashflow/transacciones-por-fecha-chart";

// ─── Paletas de colores ───────────────────────────────────────────────────────

const PALETA_DEUDAS = [
  "hsl(0, 65%, 50%)",
  "hsl(20, 65%, 50%)",
  "hsl(340, 65%, 50%)",
  "hsl(300, 55%, 50%)",
  "hsl(35, 65%, 48%)",
  "hsl(260, 55%, 55%)",
];

const PALETA_INGRESOS = [
  "hsl(155, 60%, 40%)",
  "hsl(175, 60%, 38%)",
  "hsl(135, 60%, 40%)",
  "hsl(195, 60%, 42%)",
  "hsl(115, 55%, 40%)",
  "hsl(215, 60%, 48%)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function colorRubro(rubros: string[], nombre: string, paleta: string[]) {
  return paleta[rubros.indexOf(nombre) % paleta.length];
}

function agruparPorRubro(
  porCategoria: DeudaCategoria[],
  rubros: string[],
  paleta: string[]
): DeudaBarItem[] {
  const mapa: Record<string, number> = {};
  for (const cat of porCategoria) {
    const key = cat.rubroNombre ?? "Sin rubro";
    mapa[key] = (mapa[key] ?? 0) + cat.total;
  }
  return Object.entries(mapa)
    .map(([nombre, total]) => ({
      nombre,
      total,
      color: colorRubro(rubros, nombre, paleta),
    }))
    .sort((a, b) => b.total - a.total);
}

function filtrarPorRubro(
  porCategoria: DeudaCategoria[],
  rubroNombre: string,
  color: string
): DeudaBarItem[] {
  return porCategoria
    .filter((c) => (c.rubroNombre ?? "Sin rubro") === rubroNombre)
    .map((c) => ({ nombre: c.categoriaNombre, total: c.total, color }))
    .sort((a, b) => b.total - a.total);
}

function mesActualLabel() {
  return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" })
    .format(new Date())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function rangoMesActual(): { fechaInicio: string; fechaFin: string } {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  return {
    fechaInicio: `${year}-${month}-01`,
    fechaFin: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  };
}

// ─── Panel lateral (egreso o ingreso) ────────────────────────────────────────

interface PanelLateralProps {
  tipo: "egreso" | "ingreso";
}

type CardSeleccionada = "total" | "pagado" | "pendiente";

function PanelLateral({ tipo }: PanelLateralProps) {
  const esEgreso = tipo === "egreso";
  const { fechaInicio, fechaFin } = rangoMesActual();
  const { data: dataTotal, isLoading: loadingTotal } = useGetProyeccion(tipo);
  const { data: dataMes, isLoading: loadingMes } = useGetProyeccion(
    tipo,
    fechaInicio,
    fechaFin
  );
  const isLoading = loadingTotal || loadingMes;

  const accentHex = esEgreso ? "#f43f5e" : "#10b981";
  const paleta = esEgreso ? PALETA_DEUDAS : PALETA_INGRESOS;
  const labelPagado = esEgreso ? "Pagado este mes" : "Cobrado este mes";
  const labelRestante = esEgreso ? "Por pagar este mes" : "Por cobrar este mes";

  const totalGeneral = dataTotal?.totalFuturo ?? 0;
  const totalMesActual = dataMes?.totalPasado ?? 0;
  const totalPendiente = dataMes?.totalFuturo ?? 0;
  const totalMes = totalMesActual + totalPendiente;
  const porcentajePagado =
    totalMes > 0 ? Math.round((totalMesActual / totalMes) * 100) : 0;

  const [cardSeleccionada, setCardSeleccionada] =
    useState<CardSeleccionada>("total");
  const [rubroSeleccionado, setRubroSeleccionado] = useState<string | null>(
    null
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<DeudaCategoria | null>(null);

  // Categorías según card seleccionada
  const porCategoriaActiva: DeudaCategoria[] =
    cardSeleccionada === "total"
      ? (dataTotal?.porCategoria ?? [])
      : cardSeleccionada === "pagado"
        ? (dataMes?.porCategoriaPasado ?? [])
        : (dataMes?.porCategoria ?? []);

  const rubrosUnicos = [
    ...new Set(porCategoriaActiva.map((c) => c.rubroNombre ?? "Sin rubro")),
  ];
  const datosPorRubro = agruparPorRubro(
    porCategoriaActiva,
    rubrosUnicos,
    paleta
  );

  useEffect(() => {
    setRubroSeleccionado(datosPorRubro[0]?.nombre ?? null);
    setCategoriaSeleccionada(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSeleccionada, datosPorRubro.length]);

  useEffect(() => {
    const primera = porCategoriaActiva.find(
      (c) => (c.rubroNombre ?? "Sin rubro") === rubroSeleccionado
    ) ?? porCategoriaActiva[0] ?? null;
    setCategoriaSeleccionada(primera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rubroSeleccionado, porCategoriaActiva.length]);

  const datosPorCategoria = rubroSeleccionado
    ? filtrarPorRubro(
        porCategoriaActiva,
        rubroSeleccionado,
        colorRubro(rubrosUnicos, rubroSeleccionado, paleta)
      )
    : [];

  const handleCardClick = (card: CardSeleccionada) => {
    setCardSeleccionada(card);
  };

  const handleRubroClick = (nombre: string) => {
    setRubroSeleccionado((prev) => (prev === nombre ? null : nombre));
    setCategoriaSeleccionada(null);
  };

  const handleCategoriaClick = (nombre: string) => {
    const cat = porCategoriaActiva.find((c) => c.categoriaNombre === nombre) ?? null;
    setCategoriaSeleccionada((prev) =>
      prev?.categoriaNombre === nombre ? null : cat
    );
  };

  const IconTipo = esEgreso ? TrendingDown : TrendingUp;
  const colorClass = esEgreso ? "text-rose-600" : "text-emerald-600";
  const bgClass = esEgreso ? "bg-rose-100" : "bg-emerald-100";

  const cards = [
    {
      id: "total" as CardSeleccionada,
      titulo: esEgreso ? "Deuda total" : "Proyeccion total",
      valor: totalGeneral,
      descripcion: "Pendiente total",
      Icon: IconTipo,
    },
    {
      id: "pagado" as CardSeleccionada,
      titulo: labelPagado,
      valor: totalMesActual,
      descripcion: `${mesActualLabel()} · hasta hoy`,
      Icon: IconTipo,
    },
    {
      id: "pendiente" as CardSeleccionada,
      titulo: labelRestante,
      valor: totalPendiente,
      descripcion: `${porcentajePagado}% completado del mes`,
      Icon: Clock,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Cards seleccionables */}
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => (
          <MetricCard
            key={card.id}
            titulo={card.titulo}
            monto={card.valor}
            icon={card.Icon}
            color={colorClass}
            bgColor={bgClass}
            accentHex={accentHex}
            isLoading={isLoading}
            seleccionada={cardSeleccionada === card.id}
            onClick={() => handleCardClick(card.id)}
          >
            {card.descripcion}
            {card.id === "pendiente" && !isLoading && totalMes > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${porcentajePagado}%`,
                      backgroundColor: accentHex,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: accentHex }}
                >
                  {porcentajePagado}%
                </span>
              </div>
            )}
          </MetricCard>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-3">
        <DeudaBarChart
          titulo="Por rubro"
          datos={datosPorRubro}
          isLoading={isLoading}
          emptyMessage="Sin datos"
          seleccionado={rubroSeleccionado}
          onBarClick={handleRubroClick}
          accentColor={accentHex}
        />
        <DeudaBarChart
          titulo={
            rubroSeleccionado
              ? `Categorías · ${rubroSeleccionado}`
              : "Categorías"
          }
          datos={datosPorCategoria}
          isLoading={isLoading}
          emptyMessage="Seleccioná un rubro"
          accentColor={accentHex}
          seleccionado={categoriaSeleccionada?.categoriaNombre ?? null}
          onBarClick={handleCategoriaClick}
        />
        <TransaccionesPorFechaChart
          titulo={
            categoriaSeleccionada
              ? `Transacciones · ${categoriaSeleccionada.categoriaNombre}`
              : "Transacciones"
          }
          categoriaId={categoriaSeleccionada?.categoriaId ?? 0}
          modo={
            cardSeleccionada === "total"
              ? "futuro"
              : cardSeleccionada === "pagado"
                ? "pasado-mes"
                : "futuro-mes"
          }
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          accentColor={accentHex}
        />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CashflowVisionGeneral() {
  return (
    <div className="pt-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Panel egresos */}
        <div className="flex-1 min-w-0 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/10 p-4">
          <PanelLateral tipo="egreso" />
        </div>

        {/* Panel ingresos */}
        <div className="flex-1 min-w-0 rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/10 p-4">
          <PanelLateral tipo="ingreso" />
        </div>
      </div>
    </div>
  );
}
