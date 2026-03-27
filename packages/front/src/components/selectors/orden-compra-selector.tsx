"use client";

import * as React from "react";
import type { OrdenCompra } from "@/types";
import { useGetOrdenComprasQuery } from "@/hooks/orden-compra";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const ordenCompraConfig: AutocompleteSelectorConfig<OrdenCompra> = {
  useQuery: useGetOrdenComprasQuery,
  searchField: "id",
  getDisplayValue: (item) => {
    if (!item) return "Selecciona una orden de compra";
    return `OC #${item.id} - ${item.oferta?.proveedor?.razonSocial || "Sin proveedor"}`;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => (
    <>
      OC #{item.id} - {item.oferta?.proveedor?.razonSocial || "Sin proveedor"}
    </>
  ),
  placeholder: "Buscar orden de compra",
  pageSize: 10,
};

interface OrdenCompraSelectorProps {
  value?: OrdenCompra | string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const OrdenCompraSelector = ({
  value,
  onChange,
  disabled = false,
}: OrdenCompraSelectorProps) => {
  // Convertir el value de string a objeto si es necesario
  const ordenCompraValue =
    typeof value === "string" && value
      ? { id: parseInt(value, 10), descripcionCorta: "" }
      : value;

  return (
    <AutocompleteSelector
      value={ordenCompraValue as OrdenCompra}
      onChange={(ordenCompra) => {
        onChange(ordenCompra?.id?.toString() || "");
      }}
      disabled={disabled}
      config={ordenCompraConfig}
    />
  );
};
