import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteContratoMarcoMutation } from "@/hooks/contrato-marco";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { ContratoMarco } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { formatDate, today } from "@/utils/date";

const baseUrl = "contratos-marco";

const DataTableRowActions = ({ data }: { data: ContratoMarco }) => {
  const { mutate } = useDeleteContratoMarcoMutation();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <Link className="" href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link className="" href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate(data.id)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Función para determinar el estado del contrato
export const getContratoEstado = (
  fechaInicio: string | Date,
  fechaFin: string | Date
) => {
  const today = new Date();
  const startDate = new Date(fechaInicio);
  const endDate = fechaFin ? new Date(fechaFin) : null;

  if (today < startDate) {
    // El contrato aún no comienza
    return {
      label: "Por Iniciar",
      colors: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        badgeVariant: "secondary" as const,
      },
    };
  }

  if (endDate && today > endDate) {
    // El contrato ya ha terminado
    return {
      label: "Vencido",
      colors: {
        bg: "bg-red-100",
        text: "text-red-800",
        badgeVariant: "destructive" as const,
      },
    };
  }

  // El contrato está vigente
  return {
    label: "Vigente",
    colors: {
      bg: "bg-green-100",
      text: "text-green-800",
      badgeVariant: "default" as const,
    },
  };
};

// Función para renderizar el estado en las columnas
const renderContratoEstado = (fechaInicio: string, fechaFin: string) => {
  const estado = getContratoEstado(fechaInicio, fechaFin);
  const baseClass =
    "px-2 py-1 rounded text-sm font-medium whitespace-nowrap text-center";

  return (
    <div className={`${baseClass} ${estado.colors.bg} ${estado.colors.text}`}>
      {estado.label}
    </div>
  );
};

export const columns: ColumnDef<ContratoMarco>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "nroContrato",
    header: "Número de Contrato",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("nroContrato")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.cliente?.nombre,
    id: "cliente.nombre",
    header: "Cliente",
    cell: ({ row }) => (
      <Link className="" href={`/clientes/${row.original.cliente?.id}`}>
        <CellColumn>{row.original.cliente?.nombre || "-"}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "fechaInicio",
    header: "Fecha de Inicio",
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.getValue("fechaInicio"))}</CellColumn>
    ),
  },
  {
    accessorKey: "fechaFin",
    header: "Fecha de Fin",
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.getValue("fechaFin"))}</CellColumn>
    ),
  },
  {
    accessorKey: "observaciones",
    header: "Observaciones",
    cell: ({ row }) => <span>{row.getValue("observaciones")}</span>,
  },
  {
    accessorKey: "monto",
    header: "Monto",
    cell: ({ row }) => <span>{row.getValue("monto")}</span>,
  },
  {
    accessorKey: "termDePago",
    header: "Término de Pago",
    cell: ({ row }) => <CellColumn>{row.getValue("termDePago")}</CellColumn>,
  },
  {
    id: "estado",
    header: "Estado",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const estado = renderContratoEstado(
        row.getValue("fechaInicio"),
        row.getValue("fechaFin")
      );
      return estado;
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
