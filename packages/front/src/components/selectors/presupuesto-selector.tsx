"use client";

import * as React from "react";
import type { Presupuesto } from "@/types";
import { useListarPresupuestosQuery } from "@/hooks/presupuestos";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const presupuestoConfig: AutocompleteSelectorConfig<Presupuesto> = {
  useQuery: useListarPresupuestosQuery,
  searchField: "id",
  getDisplayValue: (item) => {
    if (!item) return "Seleccione presupuesto";
    return `N°${item.id} - ${item.descripcionCorta || ""}`;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => (
    <>
      N°{item.id} - {item.descripcionCorta}
    </>
  ),
  placeholder: "Buscar presupuesto",
  pageSize: 50,
};

interface PresupuestoSelectorProps {
  selectedResult?: Pick<Presupuesto, "id" | "descripcionCorta">;
  onSelectResult?: (presupuesto: Presupuesto) => void;
}

export function PresupuestoSelector({
  selectedResult,
  onSelectResult,
}: PresupuestoSelectorProps) {
  return (
    <AutocompleteSelector
      value={selectedResult as Presupuesto}
      onChange={onSelectResult}
      config={presupuestoConfig}
    />
  );
}
