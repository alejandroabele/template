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

type EstadoSolcomSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const EstadoSolcomSelector = ({
  value = "",
  onChange,
  placeholder = "Selecciona un estado",
  disabled = false,
}: EstadoSolcomSelectorProps) => {
  const { data, isLoading } = useGetEstadoComprasQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [{ id: "tipo", value: "SOLCOM" }],
    globalFilter: "",
    sorting: [],
  });

  return (
    <Select value={`${value}`} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Estado de Solicitud de Compra</SelectLabel>
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
                  <span>{estado.nombre}</span>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
