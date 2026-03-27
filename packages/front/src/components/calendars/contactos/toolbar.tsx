"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vendedor {
  id: number;
  nombre: string;
}

interface ToolbarProps {
  vendedorSeleccionado: string;
  setVendedorSeleccionado: (value: string) => void;
  vendedores: Vendedor[];
}

export function Toolbar({
  vendedorSeleccionado,
  setVendedorSeleccionado,
  vendedores,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={vendedorSeleccionado}
        onValueChange={setVendedorSeleccionado}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Todos los vendedores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los vendedores</SelectItem>
          {vendedores.map((vendedor) => (
            <SelectItem key={vendedor.id} value={String(vendedor.id)}>
              {vendedor.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
