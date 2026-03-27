"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Calendar } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Currency } from "@/components/ui/currency";
import { useRouter } from "next/navigation";
import {
  useGetVentasSemanalesQuery,
  useGetAuditablesSemanalesQuery,
  useGetAuditablesSemanalesCantidadQuery,
  useGetCantidadPresupuestosPorCambioFechaQuery,
  useGetVentasPorClienteQuery,
  useGetAuditablesPorClienteQuery,
  useGetPresupuestosPorClienteQuery,
  useGetPresupuestosAuditablesClienteQuery,
} from "@/hooks/reportes-presupuestos";
import { PROCESO_GENERAL } from "@/constants/presupuesto";
import { formatTime } from "@/utils/date";

const meses = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

interface PresupuestosFechasChartProps {
  agrupacion: {
    id: number;
    nombre: string;
    procesos: number[];
    color: string;
  };
  tipo: "fecha" | "auditoria" | "cantidad";
  anio?: number;
  mes?: number;
  campoFecha?: string;
  from?: string;
  to?: string;
  variante?: string;
}

export function PresupuestosFechasChart({
  agrupacion,
  tipo,
  anio,
  mes,
  campoFecha,
  from,
  to,
  variante,
}: PresupuestosFechasChartProps) {
  const router = useRouter();
  const fechaActual = new Date();
  const [selectedYear, setSelectedYear] = useState(
    anio || fechaActual.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    String(mes || fechaActual.getMonth() + 1)
  );
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null
  );

  // Los charts específicos siempre usan modo semanal

  // Estado para los filtros específicos de este chart
  const [procesosSeleccionados, setProcesosSeleccionados] = useState<number[]>(
    [...agrupacion.procesos] // Por defecto todos seleccionados
  );

  // Efecto para sincronizar estado con props cuando cambien
  useEffect(() => {
    if (anio) {
      setSelectedYear(anio);
    }
    if (mes) {
      setSelectedMonth(String(mes));
    }
  }, [anio, mes]);

  // Efecto para sincronizar procesos cuando cambien
  useEffect(() => {
    setProcesosSeleccionados([...agrupacion.procesos]);
  }, [agrupacion.procesos]);

  // Diccionarios de hooks según el tipo
  const ventasSemanalesHooks = {
    fecha: () =>
      useGetVentasSemanalesQuery(
        selectedYear,
        parseInt(selectedMonth),
        procesosSeleccionados,
        campoFecha
      ),

    cantidad: () =>
      useGetCantidadPresupuestosPorCambioFechaQuery({
        anio: selectedYear,
        mes: parseInt(selectedMonth),
        procesosGenerales: procesosSeleccionados,
        from,
        to,
      }),
    auditoria: () =>
      useGetAuditablesSemanalesQuery({
        anio: selectedYear,
        mes: parseInt(selectedMonth),
        procesosGenerales: procesosSeleccionados,
        from,
        to,
        variante,
      }),
  };

  const ventasPorClienteHooks = {
    fecha: () =>
      useGetVentasPorClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        procesosSeleccionados,
        campoFecha
      ),

    cantidad: () =>
      useGetAuditablesPorClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        procesosSeleccionados
      ),
    auditoria: () =>
      useGetAuditablesPorClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        procesosSeleccionados,
        variante
      ),
  };

  const presupuestosPorClienteHooks = {
    fecha: () =>
      useGetPresupuestosPorClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        selectedClienteId || 0,
        procesosSeleccionados,
        campoFecha
      ),

    cantidad: () =>
      useGetPresupuestosAuditablesClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        selectedClienteId || 0,
        procesosSeleccionados
      ),
    auditoria: () =>
      useGetPresupuestosAuditablesClienteQuery(
        selectedYear,
        parseInt(selectedMonth),
        selectedWeek || 0,
        selectedClienteId || 0,
        procesosSeleccionados,
        variante
      ),
  };

  // Ejecutar solo los hooks que necesitamos
  const ventasSemanalesQuery = ventasSemanalesHooks[tipo]();
  const ventasPorClienteQuery = ventasPorClienteHooks[tipo]();
  const presupuestosPorClienteQuery = presupuestosPorClienteHooks[tipo]();

  const {
    data: ventasSemanales,
    isLoading: isLoadingSemanales,
    error: errorSemanales,
  } = ventasSemanalesQuery;

  const {
    data: ventasPorCliente,
    isLoading: isLoadingClientes,
    error: errorClientes,
  } = ventasPorClienteQuery;

  const {
    data: presupuestosPorCliente,
    isLoading: isLoadingPresupuestos,
    error: errorPresupuestos,
  } = presupuestosPorClienteQuery;

  const handleBarClick = (data: any, index: number) => {
    // Charts específicos siempre permiten drill-down semanal
    const semanaNum = data?.semanaNum || data?.payload?.semanaNum;
    if (semanaNum) {
      if (selectedWeek === semanaNum) {
        setSelectedWeek(null);
      } else {
        setSelectedWeek(semanaNum);
      }
    }
  };

  const handleProcesoToggle = (procesoId: number) => {
    setProcesosSeleccionados((prev) => {
      const isSelected = prev.includes(procesoId);
      if (isSelected) {
        return prev.filter((p) => p !== procesoId);
      } else {
        return [...prev, procesoId];
      }
    });
  };

  const handleToggleAll = () => {
    const todosMarcados = agrupacion.procesos.every((p) =>
      procesosSeleccionados.includes(p)
    );
    if (todosMarcados) {
      setProcesosSeleccionados([]);
    } else {
      setProcesosSeleccionados([...agrupacion.procesos]);
    }
  };

  const getNombreProceso = (procesoId: number) => {
    const entradas = Object.entries(PROCESO_GENERAL);
    const entrada = entradas.find(([_, valor]) => valor === procesoId);
    return entrada
      ? entrada[0].replace(/_/g, " ").toLowerCase()
      : `Proceso ${procesoId}`;
  };

  const tipoTexto =
    tipo === "fecha"
      ? "fabricación"
      : tipo === "cantidad"
        ? "cantidad"
        : "auditoria";
  const tipoTextoCapitalizado =
    tipo === "fecha"
      ? "Fabricación"
      : tipo === "cantidad"
        ? "Cantidad"
        : "Auditoría";

  const esModoQuantidad = tipo === "cantidad";

  if (isLoadingSemanales) {
    return <SkeletonChart />;
  }

  if (errorSemanales) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            No se pudieron cargar los datos de{" "}
            {tipo === "auditoria"
              ? tipoTexto
              : `ventas por fecha de ${tipoTexto}`}
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Generar datos del chart siempre en formato semanal
  const chartData = Array.from({ length: 4 }, (_, index) => {
    const semanaNum = index + 1;
    const ventaExistente = ventasSemanales?.find((venta) => {
      // Para tipo cantidad, el período viene como "Semana 1", "Semana 2", etc.
      if (venta.periodo && venta.periodo.startsWith("Semana")) {
        const numeroSemana = parseInt(venta.periodo.replace("Semana ", ""));
        return numeroSemana === semanaNum;
      }
      // Para otros tipos, puede venir como número directo
      return venta.semana === semanaNum;
    });

    return {
      semana: `Semana ${semanaNum}`,
      semanaNum,
      totalVentas: ventaExistente?.totalVentas || 0,
      cantidadPresupuestos: ventaExistente?.cantidadPresupuestos || 0,
    };
  });

  const totalVentas =
    ventasSemanales?.reduce((acc, semana) => acc + semana.totalVentas, 0) || 0;

  const totalPresupuestos =
    ventasSemanales?.reduce(
      (acc, semana) => acc + semana.cantidadPresupuestos,
      0
    ) || 0;

  const volver = () => {
    if (selectedClienteId) {
      setSelectedClienteId(null);
    } else {
      setSelectedWeek(null);
    }
  };

  const handleClienteClick = (clienteId: number) => {
    setSelectedClienteId(clienteId);
  };

  const handlePresupuestoClick = (presupuestoId: number) => {
    router.push(`/presupuestos/${presupuestoId}`);
  };

  const customChartConfig = {
    totalVentas: {
      label: esModoQuantidad ? "Cantidad" : "Ventas Totales",
      color: agrupacion.color,
    },
    cantidadPresupuestos: {
      label: "Cantidad",
      color: agrupacion.color,
    },
  } satisfies ChartConfig;

  const todosMarcados = agrupacion.procesos.every((p) =>
    procesosSeleccionados.includes(p)
  );
  const algunosMarcados = agrupacion.procesos.some((p) =>
    procesosSeleccionados.includes(p)
  );

  return (
    <div className="w-full space-y-4 overflow-hidden">
      <Card
        className="w-full overflow-hidden flex flex-col h-[70vh]"
        style={{ minHeight: "700px" }}
      >
        {/* Header con título y controles */}
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: agrupacion.color }}
                />
                <CardTitle className="text-lg sm:text-xl">
                  {agrupacion.nombre}
                  {tipo !== "auditoria" &&
                    ` - Fecha de ${tipoTextoCapitalizado}`}
                </CardTitle>
              </div>
              <CardDescription>
                {selectedClienteId && selectedWeek
                  ? `Presupuestos del cliente - Semana ${selectedWeek}`
                  : selectedWeek
                    ? `Desglose por cliente - Semana ${selectedWeek}`
                    : tipo === "auditoria"
                      ? `Ventas agrupadas por semana según auditoría de ${tipoTexto}`
                      : tipo === "cantidad"
                        ? `Cantidad de presupuestos agrupados por semana según auditoría`
                        : `Ventas agrupadas por semana según fecha de ${tipoTexto} estimada`}
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Select
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-24">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {meses.map((mes) => (
                    <SelectItem key={mes.value} value={mes.value}>
                      {mes.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedWeek || selectedClienteId) && (
                <button
                  onClick={volver}
                  className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  ← Volver
                </button>
              )}
            </div>
          </div>

          {/* Filtros integrados */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`toggle-all-${agrupacion.id}-${tipo}`}
                  checked={todosMarcados}
                  ref={(el) => {
                    if (el && "indeterminate" in el)
                      (el as any).indeterminate =
                        algunosMarcados && !todosMarcados;
                  }}
                  onCheckedChange={handleToggleAll}
                />
                <label
                  htmlFor={`toggle-all-${agrupacion.id}-${tipo}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Seleccionar todos los procesos
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                {agrupacion.procesos.map((procesoId) => (
                  <div key={procesoId} className="flex items-center space-x-2">
                    <Checkbox
                      id={`proceso-${procesoId}-${agrupacion.id}-${tipo}`}
                      checked={procesosSeleccionados.includes(procesoId)}
                      onCheckedChange={() => handleProcesoToggle(procesoId)}
                    />
                    <label
                      htmlFor={`proceso-${procesoId}-${agrupacion.id}-${tipo}`}
                      className="text-xs text-muted-foreground capitalize cursor-pointer"
                    >
                      {getNombreProceso(procesoId)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 overflow-hidden flex-1 flex flex-col">
          <div className="w-full overflow-hidden flex-1 flex flex-col">
            {!selectedWeek ? (
              <ChartContainer
                config={customChartConfig}
                className="w-full h-full min-h-[300px]"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" fontSize={12} interval={0} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) =>
                      esModoQuantidad
                        ? `${value}`
                        : new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value)
                    }
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    content={<ChartTooltipContent hideLabel />}
                    formatter={(value, name) => [
                      esModoQuantidad
                        ? `${value}`
                        : new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value as number),
                      esModoQuantidad ? "Cantidad" : "Ventas Totales",
                    ]}
                  />
                  <Bar
                    dataKey={
                      esModoQuantidad ? "cantidadPresupuestos" : "totalVentas"
                    }
                    fill={agrupacion.color}
                    radius={[4, 4, 0, 0]}
                    onClick={handleBarClick}
                    style={{ cursor: "pointer" }}
                  />
                </BarChart>
              </ChartContainer>
            ) : !selectedClienteId ? (
              <div className="space-y-4 overflow-hidden flex-1 flex flex-col">
                {isLoadingClientes ? (
                  <div className="text-center py-8">Cargando clientes...</div>
                ) : errorClientes ? (
                  <div className="text-center py-8 text-red-500">
                    Error al cargar datos de clientes
                  </div>
                ) : ventasPorCliente && ventasPorCliente.length > 0 ? (
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {ventasPorCliente.map((cliente, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg bg-card cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() =>
                          handleClienteClick(Number(cliente.clienteId))
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            {cliente.clienteNombre}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cliente.cantidadPresupuestos} presupuesto
                            {cliente.cantidadPresupuestos !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          {cliente.totalVentas ? (
                            <Currency className="font-semibold">
                              {cliente.totalVentas}
                            </Currency>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay datos para esta semana
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 overflow-hidden flex-1 flex flex-col">
                {isLoadingPresupuestos ? (
                  <div className="text-center py-8">
                    Cargando presupuestos...
                  </div>
                ) : errorPresupuestos ? (
                  <div className="text-center py-8 text-red-500">
                    Error al cargar presupuestos
                  </div>
                ) : presupuestosPorCliente &&
                  presupuestosPorCliente.length > 0 ? (
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {presupuestosPorCliente.map((presupuesto) => (
                      <div
                        key={presupuesto.id}
                        className="flex justify-between items-center p-3 border rounded-lg bg-card cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handlePresupuestoClick(presupuesto.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            Presupuesto #{presupuesto.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(presupuesto.fecha)} -{" "}
                            {presupuesto.cliente.nombre}
                            <span className="pl-2 text-sm font-bold text-primary">
                              Hace{" "}
                              {Math.floor(
                                (new Date().getTime() -
                                  new Date(
                                    presupuesto.fechaDesdeProceso
                                  ).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              días
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <Currency className="font-semibold">
                            {presupuesto.ventaTotal}
                          </Currency>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay presupuestos para este cliente en esta semana
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-sm border-t pt-4 flex-shrink-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between w-full">
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4" />
              Total del período:{" "}
              {esModoQuantidad ? (
                <span>{totalPresupuestos}</span>
              ) : (
                <Currency>{totalVentas}</Currency>
              )}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              {totalPresupuestos} presupuesto
              {totalPresupuestos !== 1 ? "s" : ""} total
              {totalPresupuestos !== 1 ? "es" : ""}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            Datos basados en{" "}
            {tipo === "auditoria"
              ? `auditoría de ${tipoTexto}`
              : `fecha de ${tipoTexto} estimada`}{" "}
            - {procesosSeleccionados.length} de {agrupacion.procesos.length}{" "}
            procesos seleccionados
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
