import React from "react";
import { useGetPlazoPagosQuery } from "@/hooks/plazo-pago";
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

type PlazoPagoSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const PlazoPagoSelector = ({
  value = "",
  onChange,
  disabled = false,
}: PlazoPagoSelectorProps) => {
  const { data, isLoading } = useGetPlazoPagosQuery({
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
            isLoading ? "Cargando..." : "Selecciona un plazo de pago"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plazo de Pago</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
            }}
          >
            BORRAR SELECCIÓN
          </Button>

          {data &&
            data.map((plazo) => (
              <SelectItem key={plazo.id} value={`${plazo.id}`}>
                {plazo.descripcion}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
