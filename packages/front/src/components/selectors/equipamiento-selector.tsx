"use client";

import * as React from "react";
import type { Equipamiento } from "@/types";
import { useGetEquipamientosQuery, useGetEquipamientoByIdQuery } from "@/hooks/equipamiento";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const equipamientoConfig: AutocompleteSelectorConfig<Equipamiento> = {
  useQuery: useGetEquipamientosQuery,
  searchField: "recurso.codigo",
  getDisplayValue: (item) => {
    if (!item) return "Seleccione equipamiento";
    const parts = [item.recurso?.codigo, item.nombre, item.modelo].filter(Boolean);
    return parts.join(" · ");
  },
  getItemKey: (item) => item.id!,
  placeholder: "Buscar equipamiento",
};

interface EquipamientoSelectorProps {
  value?: Equipamiento | number;
  onChange?: (equipamiento: Equipamiento) => void;
  onValueChange?: (equipamientoId: number | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function EquipamientoSelector({
  value,
  onChange,
  onValueChange,
  disabled = false,
  placeholder,
}: EquipamientoSelectorProps) {
  const equipamientoId = typeof value === "number" ? value : undefined;
  const { data: equipamientoById } = useGetEquipamientoByIdQuery(equipamientoId!);

  const resolvedValue: Equipamiento | undefined =
    typeof value === "number" ? equipamientoById : value;

  function handleChange(equipamiento: Equipamiento) {
    onChange?.(equipamiento);
    onValueChange?.(equipamiento?.id);
  }

  return (
    <AutocompleteSelector
      value={resolvedValue}
      onChange={handleChange}
      disabled={disabled}
      config={{ ...equipamientoConfig, placeholder: placeholder ?? equipamientoConfig.placeholder }}
    />
  );
}
