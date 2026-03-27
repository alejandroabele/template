"use client";

import * as React from "react";
import type { Receta } from "@/types";
import { useGetRecetasQuery } from "@/hooks/receta";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const recetaConfig: AutocompleteSelectorConfig<Receta> = {
  useQuery: useGetRecetasQuery,
  searchField: "nombre",
  getDisplayValue: (item) => item?.nombre || "Seleccione receta",
  getItemKey: (item) => item.id!,
  placeholder: "Buscar receta",
};

interface RecetaSelectorProps {
  value?: Receta;
  onChange?: (receta: Receta | null) => void;
  disabled?: boolean;
}

export function RecetaSelector({
  value,
  onChange,
  disabled = false,
}: RecetaSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={recetaConfig}
    />
  );
}
