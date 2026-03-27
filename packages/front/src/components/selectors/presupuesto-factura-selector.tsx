import React from "react";
import { useGetFacturasQuery } from "@/hooks/factura";
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

type PresupuestosFacturaSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
  modeloId?: number;
  modelo?: "presupuesto" | "alquiler";
};

export const PresupuestosFacturaSelector = ({
  value = "",
  onChange,
  modeloId,
  modelo = "presupuesto",
}: PresupuestosFacturaSelectorProps) => {
  const { data, isLoading } = useGetFacturasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [
      {
        id: "modeloId",
        value: modeloId,
      },
      {
        id: "modelo",
        value: modelo,
      },
    ],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select value={`${value}`} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Cargando..." : "Selecciona un factura"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Facturas</SelectLabel>
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
            data.map((factura) => (
              <SelectItem key={factura.id} value={`${factura.id}`}>
                {factura.folio || `Factura #${factura.id}`}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
