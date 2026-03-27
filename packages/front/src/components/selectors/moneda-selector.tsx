import React from "react";
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

type MonedaSelectorProps = {
  value?: string; // Ajusta a string porque el formulario usará strings
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const MonedaSelector = ({
  value = "",
  onChange,
  disabled = false,
}: MonedaSelectorProps) => {
  const data = [
    { value: "$", label: "AR$ (Peso argentino)" },
    { value: "US$", label: "US$ (Dólar estadounidense)" },
  ];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"Seleccionar moneda"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Seleccione la moneda para el precio</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")} // Función para borrar la selección
          >
            BORRAR SELECCIÓN
          </Button>
          {data.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
