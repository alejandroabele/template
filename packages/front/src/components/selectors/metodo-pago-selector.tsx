import React from "react";
import { useGetMetodoPagosQuery } from "@/hooks/metodo-pago";
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

type MetodoPagoSelectorProps = {
  value?: string; // Ajusta a string porque el formulario usará strings
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const MetodoPagoSelector = ({
  value = "",
  onChange,
  disabled = false,
}: MetodoPagoSelectorProps) => {
  const { data, isLoading } = useGetMetodoPagosQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select
      value={`${value}`}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading ? "Cargando..." : "Selecciona un método de pago"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Método de Pago</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(""); // Borra la selección
            }}
          >
            BORRAR SELECCIÓN
          </Button>

          {data &&
            data.map((categoria) => (
              <SelectItem key={categoria.id} value={`${categoria.id}`}>
                {categoria.nombre}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
