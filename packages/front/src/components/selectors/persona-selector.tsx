"use client";

import * as React from "react";

import { useGetPersonasQuery } from "@/hooks/persona";
import type { Persona } from "@/types";

import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const personaConfig: AutocompleteSelectorConfig<Persona> = {
  useQuery: useGetPersonasQuery,
  searchField: "nombre",
  getDisplayValue: (item) => {
    if (!item) return "Seleccionar persona...";
    return `${item.nombre} ${item.apellido}`;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => (
    <>
      {item.nombre} {item.apellido} - DNI: {item.dni}
    </>
  ),
  placeholder: "Buscar persona...",
};

interface PersonaSelectorProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
}

export function PersonaSelector({
  value,
  onValueChange,
  placeholder = "Seleccionar persona...",
}: PersonaSelectorProps) {
  const { data: personas = [] } = useGetPersonasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [],
    globalFilter: "",
  });

  const selectedPersona = personas.find((p) => p.id === value);

  return (
    <AutocompleteSelector
      value={selectedPersona}
      onChange={(persona) => onValueChange(persona?.id)}
      config={{ ...personaConfig, placeholder }}
    />
  );
}
