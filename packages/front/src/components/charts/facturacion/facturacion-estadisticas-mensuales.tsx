"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Currency } from "@/components/ui/currency";
import { useGetFacturasQuery } from "@/hooks/factura";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import { es } from "date-fns/locale";
import { Eye } from "lucide-react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface FacturacionEstadisticasMensualesProps {
  onApplyFilter?: (filtros: ColumnFiltersState) => void;
  filtrosActivos?: ColumnFiltersState;
}

export function FacturacionEstadisticasMensuales({
  onApplyFilter,
  filtrosActivos = [],
}: FacturacionEstadisticasMensualesProps) {
  const [anio, setAnio] = useState(new Date().getFullYear());

  // Obtener todas las facturas (ya incluyen cobros por relación)
  const { data: facturas = [], isLoading } = useGetFacturasQuery({
    pagination: { pageIndex: 0, pageSize: 10000 },
    columnFilters: [],
    sorting: [],
    globalFilter: "",
  });

  // Calcular estadísticas mensuales
  const dataEstadisticas = useMemo(() => {
    if (!facturas.length) return [];

    const inicioAnio = startOfYear(new Date(anio, 0, 1));
    const finAnio = endOfYear(new Date(anio, 11, 31));
    const meses = eachMonthOfInterval({ start: inicioAnio, end: finAnio });

    return meses.map((mesDate) => {
      const inicioMes = startOfMonth(mesDate);
      const finMes = endOfMonth(mesDate);
      let montoFacturado = 0;
      let montoCobrado = 0;

      facturas.forEach((factura) => {
        // 1. Facturas emitidas en este mes (según fecha de emisión)
        if (factura.fecha) {
          const fechaEmision = parseISO(factura.fecha);
          if (fechaEmision >= inicioMes && fechaEmision <= finMes) {
            montoFacturado += Number(factura.monto) || 0;
          }
        }

        // 2. Cobros realizados en este mes (según fecha de cobro)
        const facturaCobros = factura.cobros || [];
        facturaCobros.forEach((cobro) => {
          if (cobro.fecha) {
            const fechaCobro = parseISO(cobro.fecha);
            if (fechaCobro >= inicioMes && fechaCobro <= finMes) {
              montoCobrado += Number(cobro.monto) || 0;
            }
          }
        });
      });

      return {
        mes: format(mesDate, "MMMM", { locale: es }),
        facturado: montoFacturado,
        cobrado: montoCobrado,
        fechaInicio: format(inicioMes, "yyyy-MM-dd"),
        fechaFin: format(finMes, "yyyy-MM-dd"),
      };
    });
  }, [facturas, anio]);

  const anios = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Detectar si hay filtro activo (fecha o cobros.fecha)
  const filtroActivo = React.useMemo(() => {
    const tieneFecha = filtrosActivos.some((f) => f.id === "fecha");
    const tieneCobrosFecha = filtrosActivos.some((f) => f.id === "cobros.fecha");
    return tieneFecha || tieneCobrosFecha;
  }, [filtrosActivos]);

  const handleToggleFiltro = () => {
    if (onApplyFilter && filtroActivo) {
      // Limpiar filtro pasando array vacío
      onApplyFilter([]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{item.mes}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-semibold">
                <Currency>{entry.value}</Currency>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={filtroActivo ? "ring-2 ring-primary" : ""}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Estadísticas Mensuales de Facturación y Cobros</CardTitle>
            <Button
              variant={filtroActivo ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={handleToggleFiltro}
            >
              <Eye className="h-3 w-3 mr-1" />
              {filtroActivo ? "Ocultar" : "Ver"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={anio.toString()}
              onValueChange={(value) => setAnio(parseInt(value))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anios.map((a) => (
                  <SelectItem key={a} value={a.toString()}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataEstadisticas || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="mes" className="text-xs" height={30} />
              <YAxis className="text-xs" tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => {
                  if (value === "facturado") return "Facturado";
                  if (value === "cobrado") return "Cobrado";
                  return value;
                }}
              />
              <Bar
                dataKey="facturado"
                name="Facturado"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  if (onApplyFilter && data.fechaInicio && data.fechaFin) {
                    onApplyFilter([
                      {
                        id: "fecha",
                        value: { from: data.fechaInicio, to: data.fechaFin },
                      },
                    ]);
                  }
                }}
                cursor="pointer"
              />
              <Bar
                dataKey="cobrado"
                name="Cobrado"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  if (onApplyFilter && data.fechaInicio && data.fechaFin) {
                    onApplyFilter([
                      {
                        id: "cobros.fecha",
                        value: { from: data.fechaInicio, to: data.fechaFin },
                      },
                    ]);
                  }
                }}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
