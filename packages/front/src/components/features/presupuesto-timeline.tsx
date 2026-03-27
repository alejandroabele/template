"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { usePresupuestoHistorial } from "@/hooks/auditoria";
import { useGetProcesoGeneralQuery } from "@/hooks/proceso-general";
import { formatTime } from "@/utils/date";
import { Skeleton } from "@/components/ui/skeleton";
import { ProcesoGeneral } from "@/types";

interface PresupuestoTimelineProps {
  presupuestoId: number;
}

export const PresupuestoTimeline: React.FC<PresupuestoTimelineProps> = ({
  presupuestoId,
}) => {
  const { data: historial, isLoading } = usePresupuestoHistorial(presupuestoId);
  const { data: procesosData } = useGetProcesoGeneralQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
  });

  // Crear un mapa de ID a nombre de proceso
  const procesosMap = React.useMemo(() => {
    if (!procesosData) return new Map<number, ProcesoGeneral>();
    return new Map(procesosData.map((p: ProcesoGeneral) => [p.id, p]));
  }, [procesosData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Estados</CardTitle>
          <CardDescription>Línea de tiempo del presupuesto</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center min-w-[200px]">
                <Skeleton className="h-16 w-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Estados</CardTitle>
          <CardDescription>Línea de tiempo del presupuesto</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay historial de cambios disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (nombre?: string) => {
    if (!nombre) return "??";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getProcesoInfo = (valor?: string) => {
    if (!valor) return { nombre: "Sin especificar", color: "#808080" };
    const procesoId = parseInt(valor);
    const proceso = procesosMap.get(procesoId);
    return {
      nombre: proceso?.nombre || `Proceso #${valor}`,
      color: proceso?.color || "#808080",
    };
  };

  // Invertir el historial para mostrar desde el más antiguo al más reciente
  const historialOrdenado = [...historial].reverse();

  // Calcular tiempo acumulado por proceso
  const calcularTiempoPorProceso = () => {
    const tiempoPorProceso = new Map<number, number>(); // procesoId -> milliseconds

    for (let i = 0; i < historialOrdenado.length; i++) {
      const registroActual = historialOrdenado[i];
      const procesoId = parseInt(registroActual.valorNuevo || "0");

      if (!procesoId) continue;

      const fechaInicio = new Date(registroActual.fecha);
      let fechaFin: Date;

      // Si es el último registro, usar la fecha actual
      if (i === historialOrdenado.length - 1) {
        fechaFin = new Date();
      } else {
        // Usar la fecha del siguiente cambio
        fechaFin = new Date(historialOrdenado[i + 1].fecha);
      }

      const tiempoEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
      const tiempoActual = tiempoPorProceso.get(procesoId) || 0;
      tiempoPorProceso.set(procesoId, tiempoActual + tiempoEnMilisegundos);
    }

    return tiempoPorProceso;
  };

  const formatearTiempo = (milisegundos: number) => {
    const segundosTotales = Math.floor(milisegundos / 1000);
    const minutosTotales = Math.floor(segundosTotales / 60);
    const horasTotales = Math.floor(minutosTotales / 60);
    const dias = Math.floor(horasTotales / 24);

    const horas = horasTotales % 24;
    const minutos = minutosTotales % 60;

    const partes: string[] = [];
    if (dias > 0) partes.push(`${dias}d`);
    if (horas > 0) partes.push(`${horas}h`);
    if (minutos > 0 || partes.length === 0) partes.push(`${minutos}m`);

    return partes.join(" ");
  };

  const tiempoPorProceso = calcularTiempoPorProceso();

  // Obtener procesos únicos ordenados por el total de tiempo (descendente)
  const procesosConTiempo = Array.from(tiempoPorProceso.entries())
    .map(([procesoId, tiempo]) => ({
      procesoId,
      tiempo,
      info: getProcesoInfo(procesoId.toString()),
    }))
    .sort((a, b) => b.tiempo - a.tiempo);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Estados
        </CardTitle>
        <CardDescription>
          Línea de tiempo de cambios del presupuesto (de más antiguo a más
          reciente)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Timeline horizontal */}
        <div className="relative">
          {/* Línea horizontal continua */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-muted via-primary/20 to-primary" />

          {/* Timeline items */}
          <div className="flex flex-wrap gap-x-8 gap-y-12 relative">
            {historialOrdenado.map((registro) => {
              const procesoInfo = getProcesoInfo(registro.valorNuevo);

              return (
                <div
                  key={registro.id}
                  className="flex flex-col items-center min-w-[180px] max-w-[220px]"
                >
                  {/* Punto en la línea */}
                  <div className="relative mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-background z-10 relative"
                      style={{
                        backgroundColor: procesoInfo.color,
                      }}
                    >
                      <Avatar className="h-14 w-14 border-2 border-white/20">
                        <AvatarFallback
                          className="text-white font-bold text-lg"
                          style={{ backgroundColor: procesoInfo.color }}
                        >
                          {getInitials(registro.usuario?.nombre)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Información del cambio */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    {/* Badge del proceso */}
                    <Badge
                      className="font-semibold text-white border-0 shadow-sm"
                      style={{
                        backgroundColor: procesoInfo.color,
                      }}
                    >
                      {procesoInfo.nombre}
                    </Badge>

                    {/* Usuario */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium">
                        {registro.usuario?.nombre || "Usuario desconocido"}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(String(registro.fecha))}</span>
                    </div>

                    {/* Estado inicial indicator */}
                    {!registro.valorAnterior && (
                      <p className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                        Estado inicial
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección de tiempo acumulado por proceso - Diseño con Cards */}
        {procesosConTiempo.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo Acumulado por Estado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {procesosConTiempo.map(({ procesoId, tiempo, info }) => {
                const porcentaje =
                  (tiempo /
                    procesosConTiempo.reduce((sum, p) => sum + p.tiempo, 0)) *
                  100;

                return (
                  <div
                    key={procesoId}
                    className="relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Barra de color superior */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: info.color }}
                    />

                    <div className="pt-2">
                      {/* Nombre del proceso */}
                      <div className="mb-3">
                        <Badge
                          className="font-semibold text-white border-0"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.nombre}
                        </Badge>
                      </div>

                      {/* Tiempo total */}
                      <div className="mb-2">
                        <span className="text-2xl font-bold text-foreground tabular-nums">
                          {formatearTiempo(tiempo)}
                        </span>
                      </div>

                      {/* Desglose detallado */}
                      <div className="mb-3 text-xs text-muted-foreground">
                        {Math.floor(tiempo / (1000 * 60 * 60 * 24))} días,{" "}
                        {Math.floor((tiempo / (1000 * 60 * 60)) % 24)} horas,{" "}
                        {Math.floor((tiempo / (1000 * 60)) % 60)} minutos
                      </div>

                      {/* Porcentaje del tiempo total */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">
                            Del tiempo total
                          </span>
                          <span className="font-semibold">
                            {porcentaje.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: info.color,
                              width: `${porcentaje}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
