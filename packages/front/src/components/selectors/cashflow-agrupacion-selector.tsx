import React from "react";
import { useGetCashflowAgrupacionesQuery } from "@/hooks/cashflow-agrupacion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type CashflowAgrupacionSelectorProps = {
  value?: string | number | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const CashflowAgrupacionSelector = ({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Selecciona una agrupación",
}: CashflowAgrupacionSelectorProps) => {
  const { data, isLoading } = useGetCashflowAgrupacionesQuery();

  return (
    <Select
      value={value ? `${value}` : ""}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Agrupación</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            BORRAR SELECCIÓN
          </Button>
          {data &&
            data.map((agrupacion) => (
              <SelectItem key={agrupacion.id} value={`${agrupacion.id}`}>
                {agrupacion.nombre} ({agrupacion.tipo})
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
