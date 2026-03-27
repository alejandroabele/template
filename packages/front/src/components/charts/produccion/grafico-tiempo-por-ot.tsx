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
import { Hash } from "lucide-react";
import { minutosAHHmm } from "@/utils/produccion";

type OTData = {
  otId: number;
  cliente: string;
  minutos: number;
};

type Props = {
  data: OTData[];
};

const chartConfig = {
  minutos: {
    label: "Tiempo",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GraficoTiempoPorOT({ data }: Props) {
  const chartData = data
    .sort((a, b) => b.minutos - a.minutos)
    .slice(0, 12)
    .map((ot) => {
      const label = `#${ot.otId} ${ot.cliente}`;
      return {
        label: label.length > 22 ? label.slice(0, 20) + "…" : label,
        labelCompleto: `OT #${ot.otId} — ${ot.cliente}`,
        horas: parseFloat((ot.minutos / 60).toFixed(1)),
        minutos: ot.minutos,
      };
    });

  const barHeight = 36;
  const chartHeight = Math.max(180, chartData.length * barHeight + 20);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Tiempo neto por OT</CardTitle>
        </div>
        <CardDescription>Tiempo total de producción por orden de trabajo</CardDescription>
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
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={130}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-semibold">{item.payload.labelCompleto}</span>
                        <span>{minutosAHHmm(item.payload.minutos)}</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="minutos"
                layout="vertical"
                radius={4}
                fill="var(--chart-2)"
                label={{ position: "right", fontSize: 11, formatter: (v: number) => minutosAHHmm(v) }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--chart-2)" fillOpacity={1 - i * 0.04} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
