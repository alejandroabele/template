"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ContactoProximo } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { formatTime } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { isPast } from "date-fns";
import * as LucideIcons from "lucide-react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const baseUrl = "/contacto-casos";

// Helper para obtener el icono dinámicamente
const getIconComponent = (iconName: string | null | undefined) => {
  if (!iconName) return Circle;
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent =
    (LucideIcons as any)[iconKey] || (LucideIcons as any)[iconName] || Circle;
  return IconComponent;
};

export const columns: ColumnDef<ContactoProximo>[] = [
  {
    accessorFn: (row) => row.fecha,
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.original.fecha;
      const esVencido = fecha ? isPast(new Date(fecha)) : false;

      return (
        <CellColumn>
          <span className={cn(esVencido && "text-red-600 font-semibold")}>
            {formatTime(fecha)}
          </span>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.tipo?.nombre,
    id: "tipo.nombre",
    accessorKey: "tipo.nombre",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.original.tipo;

      if (!tipo) return <CellColumn>-</CellColumn>;

      const IconComponent = getIconComponent(tipo.icono);
      const iconColor = tipo.color || "#3b82f6";

      return (
        <CellColumn>
          <div className="flex items-center gap-2">
            <IconComponent style={{ color: iconColor }} />
            <Badge
              variant="outline"
              style={{
                borderColor: iconColor,
                color: iconColor,
              }}
            >
              {tipo.nombre}
            </Badge>
          </div>
        </CellColumn>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.nota,
    id: "nota",
    accessorKey: "nota",
    header: "Nota",
    cell: ({ row }) => (
      <CellColumn>
        <div className="max-w-[300px] truncate">
          {row.getValue("nota") || "-"}
        </div>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.vendedor?.nombre,
    id: "vendedor.nombre",
    accessorKey: "vendedor.nombre",
    header: "Vendedor",
    cell: ({ row }) => (
      <CellColumn>{row.getValue("vendedor.nombre") || "-"}</CellColumn>
    ),
    enableColumnFilter: false,
  },
];
