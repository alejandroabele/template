"use client";

import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  ArrowDownCircle,
} from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { useGetEstadoConsumoContratoQuery } from "@/hooks/reportes-contrato-marco";

const chartConfig = {
  value: { label: "Monto" },
  consumido: { label: "Consumido", color: "hsl(var(--chart-1))" },
  saldo: { label: "Saldo", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export function ContratoConsumoChart({ contratoId }: { contratoId: number }) {
  const { data, isLoading } = useGetEstadoConsumoContratoQuery(contratoId);

  if (isLoading) return <SkeletonChart />;
  if (!data) return null;

  const chartData = [
    { name: "Consumido", value: data.consumido, color: "hsl(var(--chart-1))" },
    { name: "Saldo", value: data.saldo, color: "hsl(var(--chart-2))" },
  ];

  const porcentajeConsumido = data.porcentajeConsumido;
  const porcentajeDisponible = 100 - porcentajeConsumido;

  const estadoContrato =
    porcentajeConsumido >= 90
      ? "critico"
      : porcentajeConsumido >= 70
        ? "alerta"
        : "normal";

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Estado de Consumo</CardTitle>
          <Badge
            variant={
              estadoContrato === "critico"
                ? "destructive"
                : estadoContrato === "alerta"
                  ? "secondary"
                  : "default"
            }
          >
            {estadoContrato === "critico" ? (
              <AlertCircle className="w-3 h-3 mr-1" />
            ) : estadoContrato === "alerta" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {porcentajeConsumido.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Barra de progreso arriba */}
        <div className="space-y-3">
          <Progress value={porcentajeConsumido} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Consumido</span>
            <span>Disponible</span>
          </div>
        </div>

        {/* Grid: gráfico + totales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Gráfico */}
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full h-[260px] max-w-[280px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value: number) =>
                      value.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })
                    }
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={2}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {porcentajeConsumido.toFixed(1)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Consumido
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Totales enriquecidos */}
          <div className="grid gap-4">
            {/* Total contrato */}
            <div className="p-4 rounded-lg border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total contrato</p>
              </div>
              <p className="text-sm font-semibold">
                {data.montoContrato?.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>

            {/* Consumido */}
            <div className="p-4 rounded-lg border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
                <p className="text-xs text-muted-foreground">Consumido</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {data.consumido.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {porcentajeConsumido.toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Disponible */}
            <div className="p-4 rounded-lg border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
                <p className="text-xs text-muted-foreground">Disponible</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {data.saldo?.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {porcentajeDisponible.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
