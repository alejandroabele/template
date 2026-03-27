"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { Calendar, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import {
  useGetVentasSemanalesQuery,
  useGetAuditablesSemanalesQuery,
  useGetCantidadPresupuestosPorCambioFechaQuery,
} from "@/hooks/reportes-presupuestos";

interface DashboardCardProps {
  titulo: string;
  color: string;
  procesos: number[];
  tipo: "fecha" | "auditoria" | "cantidad";
  linkDestino: string;
  options: any;
}

export function DashboardFechasCard({
  titulo,
  color,
  procesos,
  tipo,
  linkDestino,
  options: { anioActual, mesActual, modo, campoFecha, from, to, variante },
}: DashboardCardProps) {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);

  // Diccionario de hooks según el tipo
  const hooksByTipo = {
    fecha: () =>
      useGetVentasSemanalesQuery(anioActual, mesActual, procesos, campoFecha),
    cantidad: () =>
      useGetCantidadPresupuestosPorCambioFechaQuery({
        anio: anioActual,
        mes: mesActual,
        procesosGenerales: procesos,
        modo,
        from,
        to,
        variante,
      }),
    auditoria: () =>
      useGetAuditablesSemanalesQuery({
        anio: anioActual,
        mes: mesActual,
        procesosGenerales: procesos,
        modo,
        from,
        to,
        variante,
      }),
  };

  const { data: ventasSemanales, isLoading } = hooksByTipo[tipo]();

  const handleCardClick = () => {
    const searchParams = new URLSearchParams();
    if (anioActual) searchParams.set("anio", anioActual.toString());
    if (mesActual) searchParams.set("mes", mesActual.toString());
    if (modo) searchParams.set("modo", modo);
    if (procesos.length > 0) searchParams.set("procesos", procesos.join(","));
    if (campoFecha) searchParams.set("campoFecha", campoFecha);
    if (variante) searchParams.set("variante", variante);

    const urlWithParams = `${linkDestino}?${searchParams.toString()}`;
    router.push(urlWithParams);
  };

  const datosVisualizacion =
    modo === "semanal"
      ? Array.from({ length: 4 }, (_, index) => {
          const semanaNum = index + 1;
          const ventaExistente = ventasSemanales?.find(
            (venta) =>
              venta.semana === semanaNum ||
              (venta.periodo && parseInt(venta.periodo) === semanaNum)
          );
          return {
            periodo: semanaNum,
            etiqueta: `S${semanaNum}`,
            totalVentas: ventaExistente?.totalVentas || 0,
            cantidadPresupuestos: ventaExistente?.cantidadPresupuestos || 0,
          };
        })
      : (ventasSemanales || []).map((item) => {
          return {
            periodo: item.periodo || item.semana?.toString() || "",
            etiqueta: item.periodo || `S${item.semana}`, // En modo mensual mostrar "YYYY-MM", en semanal "S1", "S2", etc.
            totalVentas: item.totalVentas || 0,
            cantidadPresupuestos: item.cantidadPresupuestos || 0,
          };
        });

  // Usar cantidades cuando el tipo es "cantidad", sino usar montos
  const esModoCantidad = tipo === "cantidad";
  const valorPrincipal = esModoCantidad
    ? "cantidadPresupuestos"
    : "totalVentas";

  const totalGeneral = datosVisualizacion.reduce(
    (sum: number, dato) => sum + dato[valorPrincipal],
    0
  );

  const maxValor = Math.max(
    ...datosVisualizacion.map((d) => d[valorPrincipal])
  );

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden  border border-slate-200/50 shadow-sm min-h-[180px]">
        <div className="absolute top-0 left-0 right-0 h-1" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm text-muted-foreground animate-pulse">
              Cargando...
            </CardDescription>
            <BarChart3 className="h-4 w-4 text-slate-300 dark:text-slate-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
            <Currency>0</Currency>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card
      className="group relative overflow-hidden border border-gray-300 dark:border-slate-700/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 pb-2"
      aria-label={`Ver detalles de ${titulo}`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        }}
      />

      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div
            className="space-y-1 cursor-pointer"
            onClick={handleCardClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }}
          >
            <CardDescription className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              {titulo}
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums ">
              {esModoCantidad ? (
                <span>{totalGeneral}</span>
              ) : (
                <Currency>{totalGeneral}</Currency>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCardClick}
              className="rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setExpandido(!expandido)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {expandido ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      {expandido && (
        <CardContent className="pt-3 pb-0">
          <div className="space-y-1">
            {datosVisualizacion.map((dato, index) => (
              <div
                key={dato.periodo}
                className="flex justify-between items-center py-1 px-2 rounded group/item"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          dato[valorPrincipal] > 0 ? color : "#e2e8f0",
                      }}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {dato.etiqueta}
                    </span>
                  </div>
                  {maxValor > 0 && (
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full "
                        style={{
                          width: `${(dato[valorPrincipal] / maxValor) * 100}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  )}
                </div>
                {esModoCantidad ? (
                  <span className="text-xs font-semibold tabular-nums">
                    {dato.cantidadPresupuestos}
                  </span>
                ) : (
                  <Currency className="text-xs font-semibold tabular-nums">
                    {dato.totalVentas}
                  </Currency>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
