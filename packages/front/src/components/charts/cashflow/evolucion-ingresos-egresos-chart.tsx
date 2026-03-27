"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Currency } from "@/components/ui/currency";
import { useGetEvolucionIngresosEgresos } from "@/hooks/cashflow-reportes";
const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "hsl(142, 72%, 35%)", // verde
  },
  egresos: {
    label: "Egresos",
    color: "hsl(0, 72%, 45%)", // rojo
  },
} satisfies ChartConfig;

interface EvolucionIngresosEgresosChartProps {
  fechaInicio: string;
  fechaFin: string;
  modo: "dia" | "mes";
  categoriasIngreso?: string[];
  categoriasEgreso?: string[];
}

export function EvolucionIngresosEgresosChart({
  fechaInicio,
  fechaFin,
  modo,
  categoriasIngreso,
  categoriasEgreso,
}: EvolucionIngresosEgresosChartProps) {
  const { data: chartData, isLoading } = useGetEvolucionIngresosEgresos(
    fechaInicio,
    fechaFin,
    modo,
    categoriasIngreso,
    categoriasEgreso
  );

  if (isLoading) {
    return <SkeletonChart />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ingresos y Egresos</CardTitle>
          <CardDescription>
            Vista {modo === "dia" ? "diaria" : "mensual"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No hay datos disponibles para el período seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalIngresos = chartData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalEgresos = chartData.reduce((sum, item) => sum + item.egresos, 0);
  const diferencia = totalIngresos - totalEgresos;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolución de Ingresos y Egresos
            </CardTitle>
            <CardDescription>
              Vista {modo === "dia" ? "diaria" : "mensual"} - {fechaInicio} al{" "}
              {fechaFin}
            </CardDescription>
          </div>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) =>
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  notation: "compact",
                }).format(value)
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="ingresos"
              type="monotone"
              stroke="var(--color-ingresos)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-ingresos)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="egresos"
              type="monotone"
              stroke="var(--color-egresos)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-egresos)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <span>
            Total Ingresos: <Currency>{totalIngresos}</Currency>
          </span>
          <span>
            Total Egresos: <Currency>{totalEgresos}</Currency>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
