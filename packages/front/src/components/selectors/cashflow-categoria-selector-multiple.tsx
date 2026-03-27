import React from "react";
import { useGetCashflowCategoriasQuery } from "@/hooks/cashflow-categoria";
import { MAX_LIMIT } from "@/constants/query";
import { MultiSelect } from "@/components/ui/multi-select";

type CashflowCategoriaSelectorMultipleProps = {
  value: string[];
  onChange: (value: string[]) => void;
  tipo: "ingreso" | "egreso";
};

export const CashflowCategoriaSelectorMultiple = ({
  value = [],
  onChange,
  tipo,
}: CashflowCategoriaSelectorMultipleProps) => {
  const { data, isLoading } = useGetCashflowCategoriasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [{ id: "tipo", value: tipo }],
    globalFilter: "",
    sorting: [{ id: "nombre", desc: false }],
  });

  const options =
    data?.map((categoria) => ({
      label: categoria.nombre,
      value: String(categoria.id),
    })) || [];

  return (
    <MultiSelect
      options={options}
      onValueChange={onChange}
      defaultValue={value}
      placeholder={
        isLoading
          ? "Cargando..."
          : `Seleccione categorías de ${tipo === "ingreso" ? "ingresos" : "egresos"}`
      }
      variant="inverted"
      className="w-full"
      modalPopover={true}
    />
  );
};
