"use client";

import * as React from "react";
import type { AlquilerRecurso } from "@/types";
import { useGetAlquilerRecursosQuery } from "@/hooks/alquiler-recurso";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const alquilerRecursoConfig: AutocompleteSelectorConfig<AlquilerRecurso> = {
  useQuery: useGetAlquilerRecursosQuery,
  searchField: "codigo",
  getDisplayValue: (item) => item?.codigo || "Seleccione recurso",
  getItemKey: (item) => item.id!,
  placeholder: "Buscar recurso",
};

interface AlquilerRecursoSelectorProps {
  value?: AlquilerRecurso;
  onChange?: (alquilerRecurso: AlquilerRecurso) => void;
  disabled?: boolean;
}

export function AlquilerRecursoSelector({
  value,
  onChange,
  disabled = false,
}: AlquilerRecursoSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={alquilerRecursoConfig}
    />
  );
}
