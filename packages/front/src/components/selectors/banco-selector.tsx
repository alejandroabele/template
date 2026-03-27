"use client";

import * as React from "react";
import type { Banco } from "@/types";
import { useGetBancosQuery } from "@/hooks/banco";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const bancoConfig: AutocompleteSelectorConfig<Banco> = {
  useQuery: useGetBancosQuery,
  searchField: "nombre",
  getDisplayValue: (item) => {
    if (!item) return "Seleccionar banco...";
    return item.nombre;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => <>{item.nombre}</>,
  placeholder: "Buscar banco",
  pageSize: 50,
};

interface BancoSelectorProps {
  value?: Banco;
  onChange?: (banco: Banco) => void;
}

export function BancoSelector({ value, onChange }: BancoSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      config={bancoConfig}
    />
  );
}
