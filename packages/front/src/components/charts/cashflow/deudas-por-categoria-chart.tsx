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
import { MousePointerClick } from "lucide-react";

export interface DeudaBarItem {
  nombre: string;
  total: number;
  color: string;
}

interface TooltipCustomProps {
  active?: boolean;
  payload?: { value: number; payload: DeudaBarItem }[];
  label?: string;
  accentColor?: string;
}

function TooltipCustom({
  active,
  payload,
  label,
  accentColor,
}: TooltipCustomProps) {
  if (!active || !payload?.length) return null;
  const color = payload[0]?.payload?.color ?? accentColor ?? "#6366f1";
  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg text-sm min-w-[140px]">
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <p className="font-semibold text-foreground leading-tight">{label}</p>
      </div>
      <p className="font-bold text-base tabular-nums" style={{ color }}>
        <Currency>{payload[0].value}</Currency>
      </p>
    </div>
  );
}

interface DeudaBarChartProps {
  titulo: string;
  emptyMessage?: string;
  datos: DeudaBarItem[];
  isLoading?: boolean;
  seleccionado?: string | null;
  onBarClick?: (nombre: string) => void;
  accentColor?: string;
}

export function DeudaBarChart({
  titulo,
  emptyMessage = "No hay datos disponibles",
  datos,
  isLoading,
  seleccionado,
  onBarClick,
  accentColor,
}: DeudaBarChartProps) {
  if (isLoading) return <SkeletonChart />;

  if (!datos || datos.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: accentColor
                  ? `${accentColor}15`
                  : "hsl(var(--muted))",
              }}
            >
              <MousePointerClick
                className="h-5 w-5"
                style={{ color: accentColor ?? "hsl(var(--muted-foreground))" }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datos}
            margin={{ top: 8, right: 16, left: 16, bottom: 60 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
            <XAxis
              dataKey="nombre"
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
            <Bar
              dataKey="total"
              radius={[5, 5, 0, 0]}
              cursor={onBarClick ? "pointer" : undefined}
              onClick={
                onBarClick ? (data) => onBarClick(data.nombre) : undefined
              }
            >
              {datos.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  opacity={
                    seleccionado && seleccionado !== entry.nombre ? 0.25 : 1
                  }
                  stroke={
                    seleccionado === entry.nombre ? entry.color : "transparent"
                  }
                  strokeWidth={seleccionado === entry.nombre ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
