import React from "react";
import { useGetCashflowRubrosQuery } from "@/hooks/cashflow-rubro";
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

type CashflowRubroSelectorProps = {
  value?: string | number | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  tipo?: "ingreso" | "egreso";
  placeholder?: string;
};

export const CashflowRubroSelector = ({
  value = "",
  onChange,
  disabled = false,
  tipo,
  placeholder = "Selecciona un rubro",
}: CashflowRubroSelectorProps) => {
  const { data, isLoading } = useGetCashflowRubrosQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: tipo ? [{ id: "tipo", value: tipo }] : [],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select
      value={value ? `${value}` : ""}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Cargando..." : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Rubro</SelectLabel>
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
            data.map((rubro) => (
              <SelectItem key={rubro.id} value={`${rubro.id}`}>
                {rubro.nombre}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
