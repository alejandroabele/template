import React from "react";
import { useGetContactoTiposQuery } from "@/hooks/contacto-tipo";
import { ContactoTipo } from "@/types";
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

type ContactoTipoSelectorProps = {
  contactoTipo?: ContactoTipo | null;
  onChange: (tipo: ContactoTipo) => void;
};

export const ContactoTipoSelector = ({
  contactoTipo,
  onChange,
}: ContactoTipoSelectorProps) => {
  const { data: contactoTipos = [], isLoading } = useGetContactoTiposQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    globalFilter: "",
    sorting: [{ id: "nombre", desc: false }],
  });

  return (
    <Select
      value={contactoTipo?.id ? `${contactoTipo.id}` : ""}
      onValueChange={(value) => {
        const tipo = contactoTipos.find((t) => `${t.id}` === value);
        if (tipo) {
          onChange(tipo);
        }
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading ? "Cargando..." : "Seleccionar tipo de contacto"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipo de Contacto</SelectLabel>
          <Button
            className="w-full text-primary"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null as any);
            }}
          >
            BORRAR SELECCIÓN
          </Button>

          {contactoTipos &&
            contactoTipos.map((tipo) => (
              <SelectItem key={tipo.id} value={`${tipo.id}`}>
                {tipo.nombre}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
