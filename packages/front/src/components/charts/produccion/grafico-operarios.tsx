"use client";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import { minutosAHHmm } from "@/utils/produccion";

type OperarioData = {
  nombre: string;
  minutos: number;
  sesiones: number;
  horas: number;
  minutosRefrigerio?: number;
};

type Props = {
  data: OperarioData[];
};

const COLORES_TOP = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];
const COLOR_RESTO = "var(--chart-4)";

const chartConfig = {
  minutosExactos: {
    label: "Tiempo",
  },
} satisfies ChartConfig;

export function GraficoOperarios({ data }: Props) {
  const chartData = data.map((op) => ({
    nombre: op.nombre.length > 18 ? op.nombre.slice(0, 16) + "…" : op.nombre,
    nombreCompleto: op.nombre,
    horas: parseFloat((op.minutos / 60).toFixed(1)),
    sesiones: op.sesiones,
    minutosExactos: op.minutos,
    minutosRefrigerio: op.minutosRefrigerio ?? 0,
  }));

  const barHeight = 36;
  const chartHeight = Math.max(180, chartData.length * barHeight + 20);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Carga por operario</CardTitle>
        </div>
        <CardDescription>Horas totales en el período, ordenado por mayor carga</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-muted-foreground text-sm">
            Sin datos para el período seleccionado
          </div>
        ) : (
          <ChartContainer config={chartConfig} style={{ height: chartHeight }} className="w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 40, top: 4, bottom: 4 }}
            >
              <YAxis
                dataKey="nombre"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={110}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-semibold">{item.payload.nombreCompleto}</span>
                        <span>{minutosAHHmm(item.payload.minutosExactos)} · {item.payload.sesiones} sesiones</span>
                        {item.payload.minutosRefrigerio > 0 && (
                          <span className="text-amber-600">☕ {minutosAHHmm(item.payload.minutosRefrigerio)} refrigerio</span>
                        )}
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="minutosExactos" layout="vertical" radius={4} label={{ position: "right", fontSize: 11, formatter: (v: number) => minutosAHHmm(v) }}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORES_TOP[i] ?? COLOR_RESTO} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
