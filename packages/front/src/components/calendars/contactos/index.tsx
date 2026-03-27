"use client";

import React, { useState, useMemo } from "react";
import { useGetContactoProximosQuery } from "@/hooks/contacto-proximo";
import { useGetContactosQuery } from "@/hooks/contacto";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ContactoProximo, Contacto } from "@/types";
import { getTodayDateTime } from "@/utils/date";
import { GenericCalendar } from "@/components/ui/week-calendar";
import { Card } from "./card";
import { CompactCard } from "./compact-card";
import { Toolbar } from "./toolbar";

interface ContactosCalendarProps {
  defaultVendedorId?: number;
}

export function CalendarioContactos({
  defaultVendedorId,
}: ContactosCalendarProps) {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<string>(
    defaultVendedorId ? String(defaultVendedorId) : "todos"
  );

  // Estado para rango de fechas actual (semana o mes)
  const [rangoFechas, setRangoFechas] = useState<{
    inicio: Date;
    fin: Date;
  }>(() => {
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { inicio: inicioSemana, fin: finSemana };
  });

  // Construir filtros para contactos próximos (de la semana actual o futura)
  const columnFiltersProximos = useMemo(() => {
    const filters = [];

    // Filtro de vendedor
    if (vendedorSeleccionado !== "todos") {
      filters.push({
        id: "vendedorId",
        value: Number(vendedorSeleccionado),
      });
    }

    // Filtro de fecha: contactos en el rango actual o desde hoy
    const hoy = getTodayDateTime();
    const inicioStr = format(rangoFechas.inicio, "yyyy-MM-dd");
    const finStr = format(rangoFechas.fin, "yyyy-MM-dd");

    // Si el rango incluye o es posterior a hoy, filtrar por el rango
    // Si el rango es anterior a hoy, no traer contactos próximos (porque son futuros)
    if (rangoFechas.fin >= new Date(hoy)) {
      // Usar el mayor entre inicio del rango y hoy como fecha de inicio
      const fechaInicio = rangoFechas.inicio >= new Date(hoy) ? inicioStr : hoy;
      filters.push({
        id: "fecha",
        value: { from: fechaInicio, to: finStr },
      });
    } else {
      // Si el rango es completamente pasado, no hay contactos próximos
      filters.push({
        id: "fecha",
        value: { from: "9999-12-31", to: "9999-12-31" },
      });
    }

    return filters;
  }, [vendedorSeleccionado, rangoFechas]);

  // Construir filtros para contactos históricos (del rango actual)
  const columnFiltersHistoricos = useMemo(() => {
    const filters = [];

    // Filtro de vendedor
    if (vendedorSeleccionado !== "todos") {
      filters.push({
        id: "caso.vendedorId",
        value: Number(vendedorSeleccionado),
      });
    }

    // Filtro de fecha: contactos en el rango actual
    const inicioStr = format(rangoFechas.inicio, "yyyy-MM-dd'T'HH:mm:ss");
    const finStr = format(rangoFechas.fin, "yyyy-MM-dd'T'23:59:59");
    filters.push({
      id: "fecha",
      value: { from: inicioStr, to: finStr },
    });

    return filters;
  }, [vendedorSeleccionado, rangoFechas]);

  // Obtener contactos próximos (futuros desde hoy)
  const { data: contactosProximos = [], isLoading: isLoadingProximos } =
    useGetContactoProximosQuery({
      pagination: { pageIndex: 0, pageSize: 1000 },
      columnFilters: columnFiltersProximos,
      sorting: [{ id: "fecha", desc: false }],
    });

  // Obtener contactos históricos (realizados en la semana actual)
  const { data: contactosHistoricos = [], isLoading: isLoadingHistoricos } =
    useGetContactosQuery({
      pagination: { pageIndex: 0, pageSize: 1000 },
      columnFilters: columnFiltersHistoricos,
      sorting: [{ id: "fecha", desc: false }],
    });

  const isLoading = isLoadingProximos || isLoadingHistoricos;

  // Combinar contactos (ya vienen filtrados del backend)
  const contactosSemana = useMemo(() => {
    const todosContactos: Array<
      (ContactoProximo | Contacto) & { esProximo: boolean }
    > = [
      ...contactosProximos.map((c) => ({ ...c, esProximo: true })),
      ...contactosHistoricos.map((c) => ({ ...c, esProximo: false })),
    ];

    return todosContactos;
  }, [contactosProximos, contactosHistoricos]);

  // Obtener vendedores únicos
  const vendedoresUnicos = useMemo(() => {
    const vendedoresMap = new Map();
    contactosProximos.forEach((contacto) => {
      if (contacto.vendedor) {
        vendedoresMap.set(contacto.vendedor.id, contacto.vendedor);
      }
    });
    contactosHistoricos.forEach((contacto) => {
      if (contacto.caso?.vendedor) {
        vendedoresMap.set(contacto.caso.vendedor.id, contacto.caso.vendedor);
      }
    });
    return Array.from(vendedoresMap.values());
  }, [contactosProximos, contactosHistoricos]);

  const handleWeekChange = (inicio: Date, fin: Date) => {
    setRangoFechas({ inicio, fin });
  };

  const handleMonthChange = (inicio: Date, fin: Date) => {
    setRangoFechas({ inicio, fin });
  };

  return (
    <GenericCalendar
      data={contactosSemana}
      getDate={(contacto) => contacto.fecha}
      getId={(contacto) =>
        `${contacto.esProximo ? "proximo" : "historico"}-${contacto.id}`
      }
      renderCard={(contacto) => <Card data={contacto} />}
      renderCompactCard={(contacto) => <CompactCard data={contacto} />}
      titulo="Calendario de vendedores"
      toolbar={
        <Toolbar
          vendedorSeleccionado={vendedorSeleccionado}
          setVendedorSeleccionado={setVendedorSeleccionado}
          vendedores={vendedoresUnicos}
        />
      }
      isLoading={isLoading}
      onWeekChange={handleWeekChange}
      onMonthChange={handleMonthChange}
    />
  );
}
