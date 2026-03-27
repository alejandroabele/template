"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Currency } from "@/components/ui/currency";
import { useQuery } from "@tanstack/react-query";
import { fetchTransaccionesCategoria } from "@/services/cashflow-transaccion";

interface TooltipCustomProps {
  active?: boolean;
  payload?: { value: number; payload: { descripcion?: string | null; fecha: string } }[];
  label?: string;
  accentColor?: string;
}

function TooltipCustom({ active, payload, label, accentColor }: TooltipCustomProps) {
  if (!active || !payload?.length) return null;
  const color = accentColor ?? "#6366f1";
  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg text-sm min-w-[160px]">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload[0].payload.descripcion && (
        <p className="font-medium text-foreground mb-1 leading-tight">
          {payload[0].payload.descripcion}
        </p>
      )}
      <p className="font-bold text-base tabular-nums" style={{ color }}>
        <Currency>{payload[0].value}</Currency>
      </p>
    </div>
  );
}

interface TransaccionesPorFechaChartProps {
  titulo: string;
  categoriaId: number;
  modo: "futuro" | "pasado" | "futuro-mes" | "pasado-mes";
  fechaInicio?: string;
  fechaFin?: string;
  accentColor?: string;
}

export function TransaccionesPorFechaChart({
  titulo,
  categoriaId,
  modo,
  fechaInicio,
  fechaFin,
  accentColor = "#6366f1",
}: TransaccionesPorFechaChartProps) {
  const { data: transacciones = [], isLoading } = useQuery({
    queryKey: ["cashflow-transacciones-categoria", categoriaId, modo, fechaInicio, fechaFin],
    queryFn: () => fetchTransaccionesCategoria(categoriaId, modo, fechaInicio, fechaFin),
    enabled: Boolean(categoriaId),
  });

  if (isLoading) return <SkeletonChart />;

  if (!transacciones.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Sin transacciones</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar por fecha: sumar montos y concatenar descripciones
  const porFechaMap: Record<string, { monto: number; descripciones: string[] }> = {};
  for (const t of transacciones) {
    const fecha = t.fecha ?? "";
    if (!porFechaMap[fecha]) porFechaMap[fecha] = { monto: 0, descripciones: [] };
    porFechaMap[fecha].monto += t.monto;
    if (t.descripcion) porFechaMap[fecha].descripciones.push(t.descripcion);
  }

  const datos = Object.entries(porFechaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, { monto, descripciones }]) => ({
      fecha,
      monto,
      descripcion: descripciones.join(" · ") || null,
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={datos} margin={{ top: 8, right: 16, left: 16, bottom: 60 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  notation: "compact",
                }).format(v)
              }
            />
            <Tooltip
              content={<TooltipCustom accentColor={accentColor} />}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4, radius: 4 }}
            />
            <Bar dataKey="monto" radius={[5, 5, 0, 0]}>
              {datos.map((_, i) => (
                <Cell key={i} fill={accentColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
