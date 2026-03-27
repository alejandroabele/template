"use client";

import * as React from "react";
import type { Area } from "@/types";
import { useGetAreasQuery } from "@/hooks/area";
import {
  AutocompleteSelector,
  AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const areaConfig: AutocompleteSelectorConfig<Area> = {
  useQuery: useGetAreasQuery,
  searchField: "nombre",
  getDisplayValue: (item) => item?.nombre || "Seleccione área",
  getItemKey: (item) => item.id!,
  placeholder: "Buscar área",
};

interface AreaSelectorProps {
  value?: Area;
  onChange?: (area: Area) => void;
  disabled?: boolean;
}

export function AreaSelector({
  value,
  onChange,
  disabled = false,
}: AreaSelectorProps) {
  return (
    <AutocompleteSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      config={areaConfig}
    />
  );
}
