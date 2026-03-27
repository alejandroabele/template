"use client";

import * as React from "react";
import type { Flota } from "@/types";
import { useGetFlotasQuery, useGetFlotaByIdQuery } from "@/hooks/flota";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const flotaConfig: AutocompleteSelectorConfig<Flota> = {
  useQuery: useGetFlotasQuery,
  searchField: "recurso.codigo",
  getDisplayValue: (item) => {
    if (!item) return "Seleccione vehículo";
    const parts = [item.recurso?.codigo, item.patente, item.tipo].filter(Boolean);
    return parts.join(" · ");
  },
  getItemKey: (item) => item.id!,
  placeholder: "Buscar vehículo",
};

interface FlotaSelectorProps {
  value?: Flota | number;
  onChange?: (flota: Flota) => void;
  onValueChange?: (flotaId: number | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function FlotaSelector({
  value,
  onChange,
  onValueChange,
  disabled = false,
  placeholder,
}: FlotaSelectorProps) {
  // Cuando value es un número (ID), resolver el objeto Flota para el display
  const flotaId = typeof value === "number" ? value : undefined;
  const { data: flotaById } = useGetFlotaByIdQuery(flotaId!);

  const resolvedValue: Flota | undefined =
    typeof value === "number" ? flotaById : value;

  function handleChange(flota: Flota) {
    onChange?.(flota);
    onValueChange?.(flota?.id);
  }

  return (
    <AutocompleteSelector
      value={resolvedValue}
      onChange={handleChange}
      disabled={disabled}
      config={{ ...flotaConfig, placeholder: placeholder ?? flotaConfig.placeholder }}
    />
  );
}
