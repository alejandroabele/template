import React from "react";
import { useGetProduccionTrabajosQuery } from "@/hooks/produccion-trabajos";
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

type ProduccionTrabajoSelectorProps = {
  value?: string; // Ajusta a string porque el formulario usará strings
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
  tipo?: string; // Filtrar por tipo: 'producto' o 'servicio'
};

export const ProduccionTrabajoSelector = ({
  value = "",
  onChange,
  disabled,
  compact = false,
  tipo,
}: ProduccionTrabajoSelectorProps) => {
  const { data, isLoading } = useGetProduccionTrabajosQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: tipo ? [{ id: "tipo", value: tipo }] : [],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select value={`${value}`} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={compact ? "h-7 text-xs px-2" : "w-full"}>
        <SelectValue
          placeholder={
            isLoading
              ? "Cargando..."
              : compact
                ? "Trabajo"
                : "Selecciona un trabajo"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {!compact && <SelectLabel>Trabajos</SelectLabel>}
          <Button
            className={
              compact
                ? "w-full text-primary text-xs h-6"
                : "w-full text-primary"
            }
            variant="ghost"
            size={compact ? "sm" : "sm"}
            onClick={() => {
              onChange(""); // Borra la selección
            }}
          >
            {compact ? "Borrar" : "BORRAR SELECCIÓN"}
          </Button>

          {data &&
            data.map((categoria) => (
              <SelectItem
                key={categoria.id}
                value={`${categoria.id}`}
                className={compact ? "text-xs py-1" : ""}
              >
                {categoria.nombre}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
