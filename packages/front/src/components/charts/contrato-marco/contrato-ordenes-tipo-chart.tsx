"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";
import { Package, Wrench, TrendingUp } from "lucide-react";

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
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { useGetOrdenesPorTipoQuery } from "@/hooks/reportes-contrato-marco";

const chartConfig = {
  productos: {
    label: "Productos",
    color: "hsl(var(--chart-1))",
  },
  servicios: {
    label: "Servicios",
    color: "hsl(var(--chart-2))",
  },
};

export function ContratoOrdenesTipoChart({
  contratoId,
}: {
  contratoId: number;
}) {
  const { data, isLoading } = useGetOrdenesPorTipoQuery(contratoId);

  if (isLoading) return <SkeletonChart />;
  if (!data) return null;

  const total = data.reduce((acc, d) => acc + d.total, 0);
  const productos = data.find((d) => d.tipo === "producto")?.total ?? 0;
  const servicios = data.find((d) => d.tipo === "servicio")?.total ?? 0;

  const porcentajeProductos = total > 0 ? (productos / total) * 100 : 0;
  const porcentajeServicios = total > 0 ? (servicios / total) * 100 : 0;

  const pieData = [
    { name: "Productos", value: productos, color: "hsl(var(--chart-1))" },
    { name: "Servicios", value: servicios, color: "hsl(var(--chart-3))" },
  ];

  const barData = [
    {
      categoria: "Productos",
      monto: productos,
      porcentaje: porcentajeProductos,
    },
    {
      categoria: "Servicios",
      monto: servicios,
      porcentaje: porcentajeServicios,
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Distribución por Tipo de Orden
            </CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {total.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Torta */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Distribución Porcentual
            </h4>
            <ChartContainer config={chartConfig} className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
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
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ name, value }) => {
                      const porcentaje = total > 0 ? (value / total) * 100 : 0;
                      return `${name}: ${porcentaje.toFixed(1)}%`;
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Comparación de Montos
            </h4>
            <ChartContainer config={chartConfig} className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="categoria"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("es-AR", {
                        notation: "compact",
                        style: "currency",
                        currency: "ARS",
                      }).format(value)
                    }
                  />

                  <Bar
                    dataKey="monto"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Cards Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-[hsl(var(--chart-1))] ">
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Producto
                    </p>
                    <p className="text-2xl font-bold">
                      {productos.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {porcentajeProductos.toFixed(1)}%
                  </Badge>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      del total
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[hsl(var(--chart-2))] ">
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Servicio
                    </p>
                    <p className="text-2xl font-bold">
                      {servicios.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {porcentajeServicios.toFixed(1)}%
                  </Badge>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      del total
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
