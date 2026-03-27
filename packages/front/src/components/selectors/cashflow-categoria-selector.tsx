import React from "react";
import { useGetCashflowCategoriasQuery } from "@/hooks/cashflow-categoria";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "@/components/ui/select";
import { MAX_LIMIT } from "@/constants/query";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

type CashflowCategoriaSelectorProps = {
  value?: string; // Ajusta a string porque el formulario usará strings
  onChange: (value: string) => void;
};

export const CashflowCategoriaSelector = ({
  value = "",
  onChange,
}: CashflowCategoriaSelectorProps) => {
  const { data, isLoading } = useGetCashflowCategoriasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [],
    globalFilter: "",
    sorting: [],
  });

  const categoriasIngresos =
    data?.filter((cat) => cat.tipo === "ingreso") || [];
  const categoriasEgresos = data?.filter((cat) => cat.tipo === "egreso") || [];

  return (
    <Select value={`${value}`} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading ? "Cargando..." : "Selecciona una categoria de cashflow "
          }
        />
      </SelectTrigger>
      <SelectContent>
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

        {categoriasIngresos.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              Ingresos
            </SelectLabel>
            {categoriasIngresos.map((categoria) => (
              <SelectItem key={categoria.id} value={`${categoria.id}`}>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">▲</span>
                  {categoria.nombre}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {categoriasIngresos.length > 0 && categoriasEgresos.length > 0 && (
          <SelectSeparator />
        )}

        {categoriasEgresos.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2 text-rose-600">
              <TrendingDown className="h-4 w-4" />
              Egresos
            </SelectLabel>
            {categoriasEgresos.map((categoria) => (
              <SelectItem key={categoria.id} value={`${categoria.id}`}>
                <div className="flex items-center gap-2">
                  <span className="text-rose-600">▼</span>
                  {categoria.nombre}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};
