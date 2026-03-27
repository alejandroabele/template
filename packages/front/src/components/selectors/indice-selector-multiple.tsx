import React from "react";
import { useGetIndicesQuery } from "@/hooks/indice";
import { MAX_LIMIT } from "@/constants/query";
import { MultiSelect } from "@/components/ui/multi-select";

type IndicesSelectorMultipleProps = {
    value: string[];
    onChange: (value: string[], porcentajes: number[]) => void;
};

export const IndicesSelectorMultiple = ({
    value = [],
    onChange,
}: IndicesSelectorMultipleProps) => {
    const { data, isLoading } = useGetIndicesQuery({
        pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
        columnFilters: [],
        globalFilter: "",
        sorting: [{ id: 'id', desc: true }],
    });

    const options = data?.map((indice) => ({
        label: `${indice.nombre} (${indice.porcentaje}%)`, // Muestra nombre y porcentaje
        value: String(indice.id),
        porcentaje: indice.porcentaje, // Mantenemos el valor numérico por si acaso
    })) || [];

    return (
        <MultiSelect
            options={options}
            onValueChange={(newValues) => {
                const selectedOptions = options.filter(option => newValues.includes(option.value));
                onChange(newValues, selectedOptions.map(o => o.porcentaje));
            }}
            defaultValue={value}
            placeholder={isLoading ? "Cargando..." : "Seleccione índices"}
            variant="inverted"
            className="w-full"
            modalPopover={true}
        />
    );
};