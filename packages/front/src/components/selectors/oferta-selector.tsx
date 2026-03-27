import React from "react";
import { useGetOfertasQuery } from "@/hooks/oferta";
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
import { Oferta } from "@/types";

type OfertaSelectorProps = {
  value?: number;
  onChange: (value: number, oferta?: Oferta) => void;
  disabled?: boolean;
};

export const OfertaSelector = ({
  value,
  onChange,
  disabled = false,
}: OfertaSelectorProps) => {
  const { data, isLoading } = useGetOfertasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select
      value={value ? `${value}` : ""}
      onValueChange={(val) => {
        const ofertaId = parseInt(val);
        const oferta = data?.find((o) => o.id === ofertaId);
        onChange(ofertaId, oferta);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Cargando..." : "Selecciona una oferta"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Presupuesto</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(0);
            }}
          >
            BORRAR SELECCIÓN
          </Button>

          {data &&
            data.map((oferta) => (
              <SelectItem key={oferta.id} value={`${oferta.id}`}>
                Presupuesto #{oferta.id} -{" "}
                {oferta.proveedor?.razonSocial || "Sin proveedor"}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
