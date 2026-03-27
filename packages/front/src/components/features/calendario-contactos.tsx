"use client";

import React, { useState, useMemo } from "react";
import { useGetContactoProximosQuery } from "@/hooks/contacto-proximo";
import { useGetContactosQuery } from "@/hooks/contacto";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ContactoProximo, Contacto } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTodayDateTime } from "@/utils/date";

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// Helper para obtener el icono dinámicamente
const getIconComponent = (iconName: string | null | undefined) => {
  if (!iconName) return Circle;

  // Convertir el nombre del icono a PascalCase si es necesario
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent =
    (LucideIcons as any)[iconKey] || (LucideIcons as any)[iconName] || Circle;

  return IconComponent;
};

interface CalendarioContactosProps {
  defaultVendedorId?: number;
}

export function CalendarioContactos({
  defaultVendedorId,
}: CalendarioContactosProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<string>(
    defaultVendedorId ? String(defaultVendedorId) : "todos"
  );

  // Calcular inicio y fin de la semana actual
  const inicioSemana = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes
  const finSemana = endOfWeek(currentDate, { weekStartsOn: 1 }); // Domingo

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

    // Filtro de fecha: contactos en el rango de la semana actual o desde hoy si la semana es actual
    const hoy = getTodayDateTime();
    const inicioSemanaStr = format(inicioSemana, "yyyy-MM-dd'T'HH:mm:ss");
    const finSemanaStr = format(finSemana, "yyyy-MM-dd'T'23:59:59");

    // Si la semana incluye o es posterior a hoy, filtrar por el rango de la semana
    // Si la semana es anterior a hoy, no traer contactos próximos (porque son futuros)
    if (finSemana >= new Date(hoy)) {
      // Usar el mayor entre inicioSemana y hoy como fecha de inicio
      const fechaInicio = inicioSemana >= new Date(hoy) ? inicioSemanaStr : hoy;
      filters.push({
        id: "fecha",
        value: { from: fechaInicio, to: finSemanaStr },
      });
    } else {
      // Si la semana es completamente pasada, no hay contactos próximos
      filters.push({
        id: "fecha",
        value: { from: "9999-12-31", to: "9999-12-31" },
      });
    }

    return filters;
  }, [vendedorSeleccionado, inicioSemana, finSemana]);

  // Construir filtros para contactos históricos (de la semana actual)
  const columnFiltersHistoricos = useMemo(() => {
    const filters = [];

    // Filtro de vendedor
    if (vendedorSeleccionado !== "todos") {
      filters.push({
        id: "caso.vendedorId",
        value: Number(vendedorSeleccionado),
      });
    }

    // Filtro de fecha: contactos en el rango de la semana actual
    const inicioSemanaStr = format(inicioSemana, "yyyy-MM-dd'T'HH:mm:ss");
    const finSemanaStr = format(finSemana, "yyyy-MM-dd'T'23:59:59");
    filters.push({
      id: "fecha",
      value: { from: inicioSemanaStr, to: finSemanaStr },
    });

    return filters;
  }, [vendedorSeleccionado, inicioSemana, finSemana]);

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

  // Generar array de días de la semana
  const diasSemana = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));
  }, [inicioSemana]);

  // Agrupar contactos por día
  const contactosPorDia = useMemo(() => {
    const grupos: Record<
      string,
      Array<(ContactoProximo | Contacto) & { esProximo: boolean }>
    > = {};

    diasSemana.forEach((dia) => {
      const diaKey = format(dia, "yyyy-MM-dd");
      grupos[diaKey] = contactosSemana.filter((contacto) => {
        if (!contacto.fecha) return false;
        return isSameDay(new Date(contacto.fecha), dia);
      });
    });

    return grupos;
  }, [diasSemana, contactosSemana]);

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

  const cambiarSemana = (direccion: number) => {
    setCurrentDate((prev) => addDays(prev, direccion * 7));
  };

  const irHoy = () => {
    setCurrentDate(new Date());
  };

  const formatoSemana = `${format(inicioSemana, "d", { locale: es })} - ${format(finSemana, "d MMM, yyyy", { locale: es })}`;

  if (isLoading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header con navegación */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Calendario semanal de vendedores {formatoSemana}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Selector de vendedor */}
          <div className="flex items-center gap-2">
            <Select
              value={vendedorSeleccionado}
              onValueChange={setVendedorSeleccionado}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Todos los vendedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los vendedores</SelectItem>
                {vendedoresUnicos.map((vendedor) => (
                  <SelectItem key={vendedor.id} value={String(vendedor.id)}>
                    {vendedor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navegación de semanas */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => cambiarSemana(-1)}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={irHoy} variant="outline">
              Hoy
            </Button>
            <Button
              onClick={() => cambiarSemana(1)}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
        {diasSemana.map((dia, index) => {
          const diaKey = format(dia, "yyyy-MM-dd");
          const contactosDia = contactosPorDia[diaKey] || [];
          const esHoy = isSameDay(dia, new Date());

          return (
            <div key={diaKey} className="flex flex-col">
              {/* Header del día */}
              <div
                className={`text-center p-2 sm:p-3 rounded-t-lg border-b-2 ${
                  esHoy
                    ? "bg-primary/10 border-primary"
                    : "bg-muted border-border"
                }`}
              >
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {DIAS_SEMANA[index]}
                </div>
                <div
                  className={`text-base sm:text-lg font-semibold ${
                    esHoy ? "text-primary" : ""
                  }`}
                >
                  {format(dia, "d")}
                </div>
              </div>

              {/* Contactos del día */}
              <div className="flex-1 p-1.5 sm:p-2 space-y-1.5 sm:space-y-2 bg-background border border-t-0 rounded-b-lg min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
                {contactosDia.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Sin contactos
                  </p>
                ) : (
                  contactosDia.map((contacto) => {
                    // Color del icono: siempre del tipo de contacto
                    const iconColor = contacto.tipo?.color || "#3b82f6";

                    // Determinar icono
                    const IconComponent = getIconComponent(
                      contacto.tipo?.icono
                    ); // Históricos: icono del tipo

                    // Colores sobrios de la tarjeta
                    const cardClassName = contacto.esProximo
                      ? "bg-blue-50 border-blue-200" // Próximos: azul claro
                      : "bg-gray-50 border-gray-200"; // Históricos: gris

                    return (
                      <Link
                        key={`${contacto.esProximo ? "proximo" : "historico"}-${contacto.id}`}
                        href={`/contacto-casos/?id=${contacto.casoId}`}
                        className={`block p-2 sm:p-2.5 rounded-lg border hover:shadow-md transition-shadow ${cardClassName}`}
                      >
                        <div className="space-y-1">
                          {/* Header con icono y cliente */}
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <IconComponent
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0"
                              style={{ color: iconColor }}
                            />
                            {contacto.caso?.cliente && (
                              <div className="font-semibold text-xs sm:text-sm truncate flex-1">
                                {contacto.caso.cliente.nombre}
                              </div>
                            )}
                          </div>

                          {/* Hora */}
                          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                            {contacto.fecha &&
                              format(new Date(contacto.fecha), "HH:mm")}
                          </div>

                          {/* Descripción (para contactos históricos) o Nota (para próximos) */}
                          {contacto.esProximo
                            ? contacto?.nota && (
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {contacto?.nota}
                                </div>
                              )
                            : (contacto as Contacto).descripcion && (
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {(contacto as Contacto).descripcion}
                                </div>
                              )}

                          {/* Vendedor */}
                          {(contacto.esProximo
                            ? contacto.vendedor
                            : contacto.caso?.vendedor) && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                              <span className="font-medium">
                                {(
                                  contacto.esProximo
                                    ? contacto.vendedor?.nombre
                                    : contacto.caso?.vendedor?.nombre
                                )?.split(" ")[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
