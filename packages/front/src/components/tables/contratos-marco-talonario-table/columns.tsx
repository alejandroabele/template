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
import { ContratoMarcoTalonario } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { formatDate, today } from "@/utils/date";
import { Badge } from "@/components/ui/badge";

const baseUrl = "/contratos-marco";

const DataTableRowActions = ({ data }: { data: ContratoMarcoTalonario }) => {
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
        <Link
          className=""
          href={`${baseUrl}/${data.contratoMarcoId}/${data.id}`}
        >
          <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
        </Link>
        <Link
          className=""
          href={`${baseUrl}/${data.contratoMarcoId}/${data.id}`}
        >
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
const getContratoEstado = (fechaInicio: string, fechaFin: string) => {
  const today = new Date();
  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  const baseClass =
    "px-2 py-1 rounded text-sm font-medium whitespace-nowrap text-center";

  if (today < startDate) {
    // El contrato aún no comienza
    return (
      <div className={`${baseClass} bg-blue-100 text-blue-800`}>
        Por Iniciar
      </div>
    );
  }

  if (today > endDate) {
    // El contrato ya ha terminado
    return (
      <div className={`${baseClass} bg-red-100 text-red-800`}>Vencido</div>
    );
  }

  // El contrato está vigente
  return (
    <div className={`${baseClass} bg-green-100 text-green-800`}>Vigente</div>
  );
};

export const columns: ColumnDef<ContratoMarcoTalonario>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    enableColumnFilter: false,

    cell: ({ row }) => (
      <Link
        href={`${baseUrl}/${row.original.contratoMarcoId}/${row.getValue("id")}`}
      >
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
  },

  {
    accessorKey: "fechaInicio",
    header: "Fecha de Inicio",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <CellColumn>{formatDate(row.getValue("fechaInicio"))}</CellColumn>
    ),
  },
  {
    accessorKey: "fechaFin",
    header: "Fecha de Fin",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const fechaFin = row.getValue("fechaFin");
      return fechaFin ? (
        <CellColumn>{row.getValue("fechaFin")}</CellColumn>
      ) : (
        <CellColumn>
          <Badge>Talonario Actual</Badge>
        </CellColumn>
      );
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
