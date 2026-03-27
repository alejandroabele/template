"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
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
import { useGetEvolucionSaldoAcumulado } from "@/hooks/cashflow-reportes";

const chartConfig = {
  saldo: {
    label: "Saldo Acumulado",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface EvolucionSaldoAcumuladoChartProps {
  fechaInicio: string;
  fechaFin: string;
  modo: "dia" | "mes";
  categoriasIngreso?: string[];
  categoriasEgreso?: string[];
}

export function EvolucionSaldoAcumuladoChart({
  fechaInicio,
  fechaFin,
  modo,
  categoriasIngreso,
  categoriasEgreso,
}: EvolucionSaldoAcumuladoChartProps) {
  const { data: chartData, isLoading } = useGetEvolucionSaldoAcumulado(
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
          <CardTitle>Evolución del Saldo Acumulado</CardTitle>
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

  const saldoInicial = chartData[0]?.saldo || 0;
  const saldoFinal = chartData[chartData.length - 1]?.saldo || 0;
  const variacion = saldoFinal - saldoInicial;
  const porcentajeVariacion =
    saldoInicial !== 0 ? (variacion / Math.abs(saldoInicial)) * 100 : 0;

  // Determinar si el saldo es generalmente positivo o negativo para el color del área
  // Usar los mismos colores que la tabla: sky para positivo, rose para negativo
  const esSaldoPositivo = saldoFinal >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Evolución del Saldo Acumulado
            </CardTitle>
            <CardDescription>
              Vista {modo === "dia" ? "diaria" : "mensual"} - {fechaInicio} al{" "}
              {fechaFin}
            </CardDescription>
          </div>
          <div
            className={`p-2 rounded-full ${esSaldoPositivo ? "bg-sky-100" : "bg-rose-100"}`}
          >
            <TrendingUp
              className={`h-4 w-4 ${esSaldoPositivo ? "text-sky-600" : "text-rose-600"}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
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
            <Area
              dataKey="saldo"
              type="monotone"
              fill={
                esSaldoPositivo
                  ? "rgba(14, 165, 233, 0.2)"
                  : "rgba(239, 68, 68, 0.2)"
              }
              stroke={
                esSaldoPositivo ? "rgb(14, 165, 233)" : "rgb(239, 68, 68)"
              }
              strokeWidth={2}
              dot={{
                fill: esSaldoPositivo
                  ? "rgb(14, 165, 233)"
                  : "rgb(239, 68, 68)",
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 5,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <span>
            Saldo Inicial: <Currency>{saldoInicial}</Currency>
          </span>
          <span>
            Variación: <Currency>{variacion}</Currency>
            {porcentajeVariacion !== 0 && (
              <span
                className={`ml-1 ${variacion >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                ({variacion >= 0 ? "+" : ""}
                {porcentajeVariacion.toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
