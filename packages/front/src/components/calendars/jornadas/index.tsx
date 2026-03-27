"use client";

import React, { useState, useMemo } from "react";
import { useGetJornadasQuery } from "@/hooks/jornada";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Jornada } from "@/types";
import { DialogJornada } from "@/components/dialogs/dialog-jornada";
import { DialogPlanificacionJornadas } from "@/components/dialogs/dialog-planificacion-jornadas";

import { GenericCalendar } from "@/components/ui/week-calendar";
import { Card } from "./card";
import { CompactCard } from "./compact-card";
import { Toolbar } from "./toolbar";
import { Filtros } from "./filtros";

interface CalendarioJornadasProps {
  presupuestoId?: number; // Opcional: si se pasa, muestra solo ese presupuesto
}

export function CalendarioJornadas({ presupuestoId }: CalendarioJornadasProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPlanificacionOpen, setDialogPlanificacionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedJornada, setSelectedJornada] = useState<Jornada | undefined>();

  // Estados para filtros de la toolbar
  const [filtroPersonaId, setFiltroPersonaId] = useState<number | undefined>();
  const [filtroClienteId, setFiltroClienteId] = useState<number | undefined>();
  const [filtroPresupuestoId, setFiltroPresupuestoId] = useState<
    number | undefined
  >();
  const [filtroTrabajoId, setFiltroTrabajoId] = useState<number | undefined>();

  // Estado para rango de fechas actual (semana o mes)
  const [rangoFechas, setRangoFechas] = useState<{
    inicio: Date;
    fin: Date;
  }>(() => {
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { inicio: inicioSemana, fin: finSemana };
  });

  // Filtros para jornadas
  const columnFiltersJornadas = useMemo(() => {
    const filters = [];

    // Si hay presupuestoId prop (viene de la página de presupuesto), filtrar por él
    if (presupuestoId) {
      filters.push({
        id: "presupuestoId",
        value: presupuestoId,
      });
    }

    // Filtro de cliente (busca jornadas cuyo presupuesto tenga ese cliente)
    if (filtroClienteId) {
      filters.push({
        id: "clienteId",
        value: filtroClienteId,
      });
    }

    // Filtro de presupuesto (OT) desde la toolbar
    if (filtroPresupuestoId) {
      filters.push({
        id: "presupuestoId",
        value: filtroPresupuestoId,
      });
    }

    if (filtroPersonaId) {
      filters.push({
        id: "personaId",
        value: filtroPersonaId,
      });
    }

    if (filtroTrabajoId) {
      filters.push({
        id: "produccionTrabajoId",
        value: filtroTrabajoId,
      });
    }

    // Filtrar por rango de fechas (semana o mes según la vista)
    const inicioStr = format(rangoFechas.inicio, "yyyy-MM-dd");
    const finStr = format(rangoFechas.fin, "yyyy-MM-dd");

    filters.push({
      id: "fecha",
      value: { from: inicioStr, to: finStr },
    });

    return filters;
  }, [
    presupuestoId,
    filtroClienteId,
    filtroPresupuestoId,
    filtroPersonaId,
    filtroTrabajoId,
    rangoFechas,
  ]);

  const { data: jornadas = [], isLoading: isLoadingJornadas } =
    useGetJornadasQuery({
      pagination: { pageIndex: 0, pageSize: 1000 },
      columnFilters: columnFiltersJornadas,
      sorting: [{ id: "fecha", desc: false }],
    });

  // Obtener todas las personas para mostrar disponibilidad

  const isLoading = isLoadingJornadas;

  const handleJornadaClick = (jornada: Jornada) => {
    setSelectedJornada(jornada);
    setSelectedDate(undefined);
    setDialogOpen(true);
  };

  const handleAddJornada = () => {
    setDialogPlanificacionOpen(true);
  };

  const handleWeekChange = (inicio: Date, fin: Date) => {
    setRangoFechas({ inicio, fin });
  };

  const handleMonthChange = (inicio: Date, fin: Date) => {
    setRangoFechas({ inicio, fin });
  };

  const titulo = presupuestoId
    ? "Planificación de Jornadas"
    : "Planificaciones";

  return (
    <>
      <GenericCalendar
        data={jornadas}
        getDate={(jornada) => jornada.fecha}
        getId={(jornada) => jornada.id ?? 0}
        renderCard={(jornada) => (
          <Card
            data={jornada}
            presupuestoId={presupuestoId}
            onClick={handleJornadaClick}
          />
        )}
        renderCompactCard={(jornada) => (
          <CompactCard data={jornada} onClick={handleJornadaClick} />
        )}
        titulo={titulo}
        toolbar={
          <Toolbar
            presupuestoId={presupuestoId}
            onAgregarJornada={handleAddJornada}
          />
        }
        filtros={
          <Filtros
            filtroPersonaId={filtroPersonaId}
            filtroClienteId={filtroClienteId}
            filtroPresupuestoId={filtroPresupuestoId}
            filtroTrabajoId={filtroTrabajoId}
            onFiltroPersonaChange={setFiltroPersonaId}
            onFiltroClienteChange={setFiltroClienteId}
            onFiltroPresupuestoChange={setFiltroPresupuestoId}
            onFiltroTrabajoChange={setFiltroTrabajoId}
          />
        }
        isLoading={isLoading}
        onWeekChange={handleWeekChange}
        onMonthChange={handleMonthChange}
      />

      <DialogJornada
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        presupuestoId={presupuestoId}
        selectedDate={selectedDate}
        jornada={selectedJornada}
      />

      <DialogPlanificacionJornadas
        open={dialogPlanificacionOpen}
        onOpenChange={setDialogPlanificacionOpen}
        presupuestoId={presupuestoId}
      />
    </>
  );
}
