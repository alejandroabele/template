"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Currency } from "@/components/ui/currency";
import { useGetFacturasQuery } from "@/hooks/factura";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfDay,
  addMonths,
  eachWeekOfInterval,
  format,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { FACTURA_ESTADO } from "@/constants/factura";
import type { ColumnFiltersState } from "@tanstack/react-table";

interface FacturacionGraficoBarrasProps {
  onApplyFilter?: (filtros: ColumnFiltersState) => void;
  filtrosActivos?: ColumnFiltersState;
}

export function FacturacionGraficoBarras({
  onApplyFilter,
  filtrosActivos = [],
}: FacturacionGraficoBarrasProps) {
  const [vista, setVista] = useState<"semanal" | "mensual">("semanal");
  const [offset, setOffset] = useState(0); // 0 = período actual, 1 = siguiente, etc.

  // Obtener todas las facturas (ya incluyen cobros por relación)
  const { data: facturas = [], isLoading } = useGetFacturasQuery({
    pagination: { pageIndex: 0, pageSize: 10000 },
    columnFilters: [],
    sorting: [],
    globalFilter: "",
  });

  // Calcular datos para vista mensual (12 meses del año)
  const dataMensual = useMemo(() => {
    if (!facturas.length) return [];

    const hoy = startOfDay(new Date());
    const anioActual = hoy.getFullYear();
    const anioSeleccionado = anioActual + offset;

    // Generar 12 meses del año seleccionado
    const meses = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date(anioSeleccionado, i, 1);
      return {
        inicio: startOfMonth(mes),
        fin: endOfMonth(mes),
      };
    });

    // Calcular facturas atrasadas SOLO si estamos viendo el año actual
    let facturasAtrasadas = 0;
    let indicePrimerMesActivo = -1;

    if (offset === 0) {
      // Encontrar el primer mes activo (actual o futuro)
      indicePrimerMesActivo = meses.findIndex(
        (mes) => startOfDay(mes.fin) >= hoy
      );

      // Solo calcular atrasadas si hay un mes activo
      if (indicePrimerMesActivo !== -1) {
        facturas.forEach((factura) => {
          if (factura.estado === FACTURA_ESTADO.PARCIAL || factura.estado === FACTURA_ESTADO.PENDIENTE) {
            const facturaCobros = factura.cobros || [];
            const totalCobrado = facturaCobros.reduce(
              (sum, cobro) => sum + (Number(cobro.monto) || 0),
              0
            );
            const montoFactura = Number(factura.monto) || 0;
            const saldoPendiente = Math.max(0, montoFactura - totalCobrado);

            if (saldoPendiente > 0 && factura.fechaVencimiento) {
              const fechaVenc = startOfDay(parseISO(factura.fechaVencimiento));
              // Todo lo vencido hasta ayer (antes de hoy)
              if (fechaVenc < hoy) {
                facturasAtrasadas += saldoPendiente;
              }
            }
          }
        });
      }
    }

    return meses.map((mes, index) => {
      let aCobrar = 0;
      let atrasadas = 0;

      // Solo en el primer mes activo del año actual mostramos las atrasadas
      if (offset === 0 && index === indicePrimerMesActivo) {
        atrasadas = facturasAtrasadas;
      }

      // Solo calcular aCobrar para meses actuales o futuros
      if (startOfDay(mes.fin) >= hoy) {
        facturas.forEach((factura) => {
          if (factura.estado === FACTURA_ESTADO.PARCIAL || factura.estado === FACTURA_ESTADO.PENDIENTE) {
            const facturaCobros = factura.cobros || [];
            const totalCobrado = facturaCobros.reduce(
              (sum, cobro) => sum + (Number(cobro.monto) || 0),
              0
            );
            const montoFactura = Number(factura.monto) || 0;
            const saldoPendiente = Math.max(0, montoFactura - totalCobrado);

            if (saldoPendiente > 0 && factura.fechaVencimiento) {
              const fechaVenc = startOfDay(parseISO(factura.fechaVencimiento));

              // Facturas que vencen en este mes (desde hoy en adelante)
              if (
                fechaVenc >= hoy &&
                fechaVenc >= startOfDay(mes.inicio) &&
                fechaVenc <= startOfDay(mes.fin)
              ) {
                aCobrar += saldoPendiente;
              }
            }
          }
        });
      }

      return {
        mes: format(mes.inicio, "MMM", { locale: es }),
        mesCompleto: format(mes.inicio, "MMMM", { locale: es }),
        aCobrar: aCobrar,
        atrasadas: atrasadas,
        fechaInicio: format(mes.inicio, "yyyy-MM-dd"),
        fechaFin: format(mes.fin, "yyyy-MM-dd"),
      };
    });
  }, [facturas, offset]);

  // Calcular datos para vista semanal (semanas del mes seleccionado)
  const dataSemanal = useMemo(() => {
    if (!facturas.length) return [];

    const hoy = startOfDay(new Date());
    const mesSeleccionado = addMonths(startOfMonth(hoy), offset);
    const inicioMes = startOfMonth(mesSeleccionado);
    const finMes = endOfMonth(mesSeleccionado);

    // Generar semanas del mes seleccionado
    const semanas = eachWeekOfInterval(
      { start: inicioMes, end: finMes },
      { weekStartsOn: 1 }
    ).map((inicioSemana) => ({
      inicio: inicioSemana,
      fin: endOfWeek(inicioSemana, { weekStartsOn: 1 }),
    }));

    // Calcular facturas atrasadas SOLO si estamos viendo el mes actual
    let facturasAtrasadas = 0;
    let indicePrimeraSemanaActiva = -1;

    if (offset === 0) {
      // Encontrar la primera semana activa (actual o futura)
      indicePrimeraSemanaActiva = semanas.findIndex(
        (semana) => startOfDay(semana.fin) >= hoy
      );

      // Solo calcular atrasadas si hay una semana activa
      if (indicePrimeraSemanaActiva !== -1) {
        facturas.forEach((factura) => {
          if (factura.estado === FACTURA_ESTADO.PARCIAL || factura.estado === FACTURA_ESTADO.PENDIENTE) {
            const facturaCobros = factura.cobros || [];
            const totalCobrado = facturaCobros.reduce(
              (sum, cobro) => sum + (Number(cobro.monto) || 0),
              0
            );
            const montoFactura = Number(factura.monto) || 0;
            const saldoPendiente = Math.max(0, montoFactura - totalCobrado);

            if (saldoPendiente > 0 && factura.fechaVencimiento) {
              const fechaVenc = startOfDay(parseISO(factura.fechaVencimiento));
              // Todo lo vencido hasta ayer (antes de hoy)
              if (fechaVenc < hoy) {
                facturasAtrasadas += saldoPendiente;
              }
            }
          }
        });
      }
    }

    return semanas.map((semana, index) => {
      let aCobrar = 0;
      let atrasadas = 0;

      // Solo en la primera semana activa del mes actual mostramos las atrasadas
      if (offset === 0 && index === indicePrimeraSemanaActiva) {
        atrasadas = facturasAtrasadas;
      }

      // Solo calcular aCobrar para semanas actuales o futuras
      if (startOfDay(semana.fin) >= hoy) {
        facturas.forEach((factura) => {
          if (factura.estado === FACTURA_ESTADO.PARCIAL || factura.estado === FACTURA_ESTADO.PENDIENTE) {
            const facturaCobros = factura.cobros || [];
            const totalCobrado = facturaCobros.reduce(
              (sum, cobro) => sum + (Number(cobro.monto) || 0),
              0
            );
            const montoFactura = Number(factura.monto) || 0;
            const saldoPendiente = Math.max(0, montoFactura - totalCobrado);

            if (saldoPendiente > 0 && factura.fechaVencimiento) {
              const fechaVenc = startOfDay(parseISO(factura.fechaVencimiento));

              // Facturas que vencen en esta semana (desde hoy en adelante)
              if (
                fechaVenc >= hoy &&
                fechaVenc >= startOfDay(semana.inicio) &&
                fechaVenc <= startOfDay(semana.fin)
              ) {
                aCobrar += saldoPendiente;
              }
            }
          }
        });
      }

      const rangoLabel = `${format(semana.inicio, "dd/MM", { locale: es })} - ${format(semana.fin, "dd/MM", { locale: es })}`;

      return {
        semana: `S${index + 1}`,
        rango: rangoLabel,
        aCobrar: aCobrar,
        atrasadas: atrasadas,
        fechaInicio: format(semana.inicio, "yyyy-MM-dd"),
        fechaFin: format(semana.fin, "yyyy-MM-dd"),
      };
    });
  }, [facturas, offset]);

  const data = vista === "semanal" ? dataSemanal : dataMensual;

  // Detectar si hay filtro activo de proyección (estado + fechaVencimiento)
  const filtroActivo = useMemo(() => {
    const tieneEstado = filtrosActivos.some((f) => f.id === "estado");
    const tieneFechaVencimiento = filtrosActivos.some(
      (f) => f.id === "fechaVencimiento"
    );
    return tieneEstado && tieneFechaVencimiento;
  }, [filtrosActivos]);

  const handleToggleFiltro = () => {
    if (onApplyFilter && filtroActivo) {
      // Limpiar filtro pasando array vacío
      onApplyFilter([]);
    }
  };

  // Determinar si podemos retroceder (no antes del período actual)
  const puedeRetroceder = offset > 0;

  // Handler para cambiar de período
  const handlePeriodoAnterior = () => {
    if (puedeRetroceder) {
      setOffset(offset - 1);
    }
  };

  const handlePeriodoSiguiente = () => {
    setOffset(offset + 1);
  };

  // Título del período actual
  const tituloPeriodo = useMemo(() => {
    const hoy = new Date();
    if (vista === "semanal") {
      // Vista semanal: mostrar mes y año
      const mes = addMonths(startOfMonth(hoy), offset);
      return format(mes, "MMMM yyyy", { locale: es });
    } else {
      // Vista mensual: mostrar año
      const anioActual = hoy.getFullYear();
      const anioSeleccionado = anioActual + offset;
      return anioSeleccionado.toString();
    }
  }, [vista, offset]);

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
      const totalACobrar = (item.aCobrar || 0) + (item.atrasadas || 0);

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">
            {vista === "semanal"
              ? `Semana ${item.semana?.replace("S", "")}`
              : item.mesCompleto}
          </p>
          {vista === "semanal" && item.rango && (
            <p className="text-xs text-muted-foreground mb-2">{item.rango}</p>
          )}

          {item.aCobrar > 0 && (
            <div className="flex items-center gap-2 text-sm mb-1">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>Vencen:</span>
              <span className="font-semibold">
                <Currency>{item.aCobrar}</Currency>
              </span>
            </div>
          )}

          {item.atrasadas > 0 && (
            <div className="flex items-center gap-2 text-sm mb-1">
              <div className="w-3 h-3 rounded bg-rose-500" />
              <span>Atrasadas:</span>
              <span className="font-semibold">
                <Currency>{item.atrasadas}</Currency>
              </span>
            </div>
          )}

          {totalACobrar > 0 && (
            <div className="flex items-center gap-2 text-sm mt-2 pt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                <Currency>{totalACobrar}</Currency>
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={filtroActivo ? "ring-2 ring-primary" : ""}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Proyección de Cobranzas</CardTitle>
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
            <ToggleGroup
              type="single"
              value={vista}
              onValueChange={(value) => {
                if (value) {
                  setVista(value as "semanal" | "mensual");
                  setOffset(0);
                }
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="semanal" aria-label="Vista semanal">
                Semanal
              </ToggleGroupItem>
              <ToggleGroupItem value="mensual" aria-label="Vista mensual">
                Mensual
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePeriodoAnterior}
              disabled={!puedeRetroceder}
              title="Período anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm font-medium capitalize">{tituloPeriodo}</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePeriodoSiguiente}
              title="Período siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={vista === "semanal" ? "semana" : "mes"}
                className="text-xs"
                tick={({ x, y, payload }: any) => {
                  if (vista === "semanal") {
                    const item = (data || []).find(
                      (d: any) => d.semana === payload.value
                    ) as any;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={12}
                          textAnchor="middle"
                          className="text-xs font-medium fill-foreground"
                        >
                          {`Semana ${payload.value.replace("S", "")}`}
                        </text>
                        {item?.rango && (
                          <text
                            x={0}
                            y={0}
                            dy={26}
                            textAnchor="middle"
                            className="text-[10px] fill-muted-foreground"
                          >
                            {item.rango}
                          </text>
                        )}
                      </g>
                    );
                  } else {
                    // Vista mensual: mostrar nombre del mes
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={12}
                          textAnchor="middle"
                          className="text-xs font-medium fill-foreground capitalize"
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }
                }}
                height={vista === "semanal" ? 45 : 30}
              />
              <YAxis className="text-xs" tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="aCobrar"
                name="Vencen"
                fill="#10b981"
                stackId="stack"
                radius={[0, 0, 0, 0]}
                onClick={(data: any) => {
                  if (onApplyFilter && data.fechaInicio && data.fechaFin) {
                    onApplyFilter([
                      { id: "estado", value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE] },
                      {
                        id: "fechaVencimiento",
                        value: { from: data.fechaInicio, to: data.fechaFin },
                      },
                    ]);
                  }
                }}
                cursor="pointer"
              />
              <Bar
                dataKey="atrasadas"
                name="Atrasadas"
                fill="#f43f5e"
                stackId="stack"
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  if (onApplyFilter && data.fechaInicio && data.fechaFin) {
                    const hoy = new Date();
                    const ayer = format(subDays(hoy, 1), "yyyy-MM-dd");
                    onApplyFilter([
                      { id: "estado", value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE] },
                      {
                        id: "fechaVencimiento",
                        value: { from: "1900-01-01", to: ayer },
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
