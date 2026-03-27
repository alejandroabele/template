import React from "react";
import { useGetEstadoComprasQuery } from "@/hooks/estado-compras";
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
import { Badge } from "@/components/ui/badge";

type EstadoComprasSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
  tipo?: "SOLCOM" | "OFERTA" | "ORDEN_COMPRA";
  placeholder?: string;
};

export const EstadoComprasSelector = ({
  value = "",
  onChange,
  tipo,
  placeholder = "Selecciona un estado",
}: EstadoComprasSelectorProps) => {
  const { data, isLoading } = useGetEstadoComprasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: tipo ? [{ id: "tipo", value: tipo }] : [],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select value={`${value}`} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Estado</SelectLabel>
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
            data.map((estado) => (
              <SelectItem key={estado.id} value={`${estado.id}`}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {estado.codigo}
                  </Badge>
                  <span>{estado.nombre}</span>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
