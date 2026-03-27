"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { minutosAHHmm } from "@/utils/produccion";

const chartConfig = {
  horas: {
    label: "Horas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data: { fecha: string; minutos: number; horas: number }[];
  descripcionPeriodo: string;
};

export function GraficoActividadDiaria({ data, descripcionPeriodo }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Actividad diaria</CardTitle>
        </div>
        <CardDescription>{descripcionPeriodo}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
            Sin datos para el período seleccionado
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillActividad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => minutosAHHmm(Math.round(v) * 60)}
                allowDecimals={false}
                tickCount={5}
                width={36}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const { fecha, minutos } = payload[0].payload as { fecha: string; minutos: number };
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
                      <p className="font-medium">{fecha}</p>
                      <p className="text-muted-foreground">{minutosAHHmm(minutos)}</p>
                    </div>
                  );
                }}
              />
              <Area
                dataKey="horas"
                type="monotone"
                fill="url(#fillActividad)"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
