"use client";

import * as React from "react";
import type { Proveedor } from "@/types";
import { useGetProveedorsQuery } from "@/hooks/proveedor";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const proveedorConfig: AutocompleteSelectorConfig<Proveedor> = {
  useQuery: useGetProveedorsQuery,
  searchField: "razonSocial",
  getDisplayValue: (item) => {
    if (!item) return "Seleccione proveedor";
    return item.nombreFantasia
      ? `${item.razonSocial} (${item.nombreFantasia})`
      : item.razonSocial;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => (
    <span>
      {item.razonSocial}
      {item.nombreFantasia && (
        <span className="text-muted-foreground ml-1">
          ({item.nombreFantasia})
        </span>
      )}
    </span>
  ),
  placeholder: "Buscar proveedor",
};

interface ProveedorSelectorProps {
  value?: Proveedor;
  onChange?: (proveedor: Proveedor) => void;
  disabled?: boolean;
}

export function ProveedorSelector({
  value,
  onChange,
  disabled = false,
}: ProveedorSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={proveedorConfig}
    />
  );
}
