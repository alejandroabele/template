"use client";

import * as React from "react";
import type { Cliente } from "@/types";
import { useGetClientesQuery } from "@/hooks/clientes";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const clienteConfig: AutocompleteSelectorConfig<Cliente> = {
  useQuery: useGetClientesQuery,
  searchField: "nombre",
  getDisplayValue: (item) => item?.nombre ?? "Seleccione cliente",
  getItemKey: (item) => item.id!,
  placeholder: "Buscar cliente",
};

interface ClienteSelectorProps {
  value?: Cliente;
  onChange?: (cliente: Cliente) => void;
  disabled?: boolean;
}

export function ClienteSelector({
  value,
  onChange,
  disabled = false,
}: ClienteSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={clienteConfig}
    />
  );
}
