"use client";

import { useHerramientas } from "@/hooks/herramienta";
import {
    AutocompleteSelector,
    AutocompleteSelectorConfig,
} from "./autocomplete-selector";

const herramientaConfig: AutocompleteSelectorConfig<any> = {
    useQuery: (params: any) => useHerramientas(params),
    searchField: "nombre",
    getDisplayValue: (item) => item?.nombre ?? "Seleccionar herramienta...",
    getItemKey: (item) => item.id,
    renderItem: (item) => <>{item.nombre}{item.sku ? ` — ${item.sku}` : ""}</>,
    placeholder: "Buscar herramienta...",
};

interface HerramientaSelectorProps {
    value?: number;
    onValueChange: (value: number | undefined) => void;
}

export function HerramientaSelector({ value, onValueChange }: HerramientaSelectorProps) {
    const { data: herramientas = [] } = useHerramientas({
        pagination: { pageIndex: 0, pageSize: 100 },
        columnFilters: [],
        sorting: [],
        globalFilter: "",
    });

    const selected = (herramientas as any[]).find((h) => h.id === value);

    return (
        <AutocompleteSelector
            value={selected}
            onChange={(h: any) => onValueChange(h?.id)}
            config={herramientaConfig}
        />
    );
}
