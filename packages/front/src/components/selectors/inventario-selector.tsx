"use client";

import * as React from "react";
import type { Inventario } from "@/types";
import { useGetInventarioQuery } from "@/hooks/inventario";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const inventarioConfig: AutocompleteSelectorConfig<Inventario> = {
  useQuery: useGetInventarioQuery,
  searchField: "nombre",
  getDisplayValue: (item) => item?.nombre ?? "Seleccione producto",
  getItemKey: (item) => item.id!,
  placeholder: "Buscar producto",
};

interface InventarioSelectorProps {
  value?: Inventario;
  onChange?: (inventario: Inventario) => void;
  disabled?: boolean;
}

export function InventarioSelector({
  value,
  onChange,
  disabled = false,
}: InventarioSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={inventarioConfig}
    />
  );
}
