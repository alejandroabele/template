import React from "react";
import { useGetInventarioConversionsQuery } from "@/hooks/inventario-conversion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { MAX_LIMIT } from "@/constants/query";
import { Button } from "@/components/ui/button";
import { InventarioConversion } from "@/types";

type UnidadMedidaInventarioSelectorProps = {
  value?: string | number; // Ajusta a string porque el formulario usará strings
  onChange?: (value: string) => void;
  onSelect?: (conversion: InventarioConversion) => void; // extra
  id: number;
  unidadBase?: string; // Unidad de medida base del inventario
  disabled?: boolean;
};

export const UnidadMedidaInventarioSelector = ({
  value = "",
  onChange,
  id,
  onSelect,
  unidadBase,
  disabled = false,
}: UnidadMedidaInventarioSelectorProps) => {
  const { data, isLoading } = useGetInventarioConversionsQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [{ id: "inventarioId", value: id }],
    globalFilter: "list",
    sorting: [],
  });

  // Determinar qué mostrar cuando no hay conversión seleccionada
  const getPlaceholder = () => {
    if (isLoading) return "Cargando...";
    if (!value || value === "") {
      // Si no hay conversión seleccionada, mostrar la unidad base
      return unidadBase || "Sin unidad asignada";
    }
    return "Seleccione";
  };

  return (
    <Select
      value={`${value}`}
      disabled={disabled || isLoading}
      onValueChange={(val) => {
        if (onChange) {
          onChange(val);
        }
        const conversionSeleccionada = data?.find((c) => `${c.id}` === val);
        if (conversionSeleccionada && onSelect) {
          onSelect(conversionSeleccionada);
        }
      }}
    >
      <SelectTrigger className="w-full" disabled={data?.length === 0}>
        <SelectValue placeholder={getPlaceholder()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Conversión</SelectLabel>

          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (onChange) onChange("");
              onSelect?.(null as any);
            }}
            disabled={disabled || data?.length === 0} // Deshabilitar si no hay datos
          >
            {data?.length === 0 ? "Sin unidad asignada" : "BORRAR SELECCIÓN"}
          </Button>

          {data?.length > 0 &&
            data.map((conversion) => {
              const label = conversion.descripcion
                ? `${conversion.descripcion} - ${conversion.unidadOrigen}`
                : conversion.unidadOrigen;

              return (
                <SelectItem key={conversion.id} value={`${conversion.id}`}>
                  {label}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
