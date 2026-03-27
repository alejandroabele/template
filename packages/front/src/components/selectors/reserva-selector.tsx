"use client";

import * as React from "react";
import type { Reserva } from "@/types";
import { useGetReservasQuery } from "@/hooks/reserva";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

// Wrapper que fuerza orden descendente por id
const useGetReservasQueryDesc: typeof useGetReservasQuery = (query) =>
  useGetReservasQuery({ ...query, sorting: [{ id: "id", desc: true }] });

const reservaConfig: AutocompleteSelectorConfig<Reserva> = {
  useQuery: useGetReservasQueryDesc,
  searchField: "id",
  getDisplayValue: (item) => {
    if (!item) return "Seleccione reserva";
    return `N°${item.id}`;
  },
  getItemKey: (item) => item.id!,
  renderItem: (item) => <>N°{item.id}</>,
  placeholder: "Buscar reserva",
  pageSize: 50,
};

interface ReservaSelectorProps {
  value?: Pick<Reserva, "id">;
  onChange?: (reserva: Reserva) => void;
}

export function ReservaSelector({ value, onChange }: ReservaSelectorProps) {
  return (
    <AutocompleteSelector
      value={value as Reserva}
      onChange={onChange}
      config={reservaConfig}
    />
  );
}
