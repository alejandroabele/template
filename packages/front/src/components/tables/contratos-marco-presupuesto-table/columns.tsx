import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteContratoMarcoPresupuestoMutation } from "@/hooks/contrato-marco-presupuesto";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { ContratoMarcoPresupuesto } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { SelectFilter } from "@/components/select-filter";

const baseUrl = "/contratos-marco-presupuesto";

const DataTableRowActions = ({ data }: { data: ContratoMarcoPresupuesto }) => {
  const { mutate } = useDeleteContratoMarcoPresupuestoMutation();
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
        <Link href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem>Ver</DropdownMenuItem>
        </Link>
        <Link href={`${baseUrl}/${data.id}`}>
          <DropdownMenuItem>Editar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate(data.id)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const badgeBaseClass =
  "px-2 py-1 rounded text-sm font-medium whitespace-nowrap text-center inline-block";

// Visual para el tipo (servicio/producto)
const getTipoBadge = (tipo: string) => {
  if (tipo === "servicio") {
    return (
      <div className={`${badgeBaseClass} bg-purple-100 text-purple-800`}>
        Servicio
      </div>
    );
  }
  if (tipo === "producto") {
    return (
      <div className={`${badgeBaseClass} bg-yellow-100 text-yellow-800`}>
        Producto
      </div>
    );
  }
  return <div className={badgeBaseClass}>{tipo}</div>;
};

// Visual para el estado (nuevo/iniciado/finalizado)
const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "nuevo":
      return (
        <div className={`${badgeBaseClass} bg-blue-100 text-blue-800`}>
          Nuevo
        </div>
      );
    case "servicio":
      return (
        <div className={`${badgeBaseClass} bg-amber-100 text-amber-800`}>
          Servicio
        </div>
      );
    case "valorizacion":
      return (
        <div className={`${badgeBaseClass} bg-red-100 text-red-800`}>
          Administración
        </div>
      );
    case "finalizado":
      return (
        <div className={`${badgeBaseClass} bg-green-100 text-green-800`}>
          Finalizado
        </div>
      );
    default:
      return <div className={badgeBaseClass}>{estado}</div>;
  }
};

export const columns: ColumnDef<ContratoMarcoPresupuesto>[] = [
  {
    accessorKey: "id",
    header: "N°",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("id")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <CellColumn>{getEstadoBadge(row.getValue("estado"))}</CellColumn>
    ),
  },
  {
    accessorKey: "presupuesto.id",
    header: "N° OT",
    cell: ({ row }) => (
      <Link href={`/presupuestos/${row.original.presupuesto?.id}`}>
        <CellColumn>{row.original.presupuesto?.id || "-"}</CellColumn>
      </Link>
    ),
  },

  {
    accessorKey: "presupuesto.presupuesto.procesoGeneral.nombre",
    id: "procesoGeneral.nombre",
    header: "Proceso",
    meta: {
      customFilter: (table: TableType<ContratoMarcoPresupuesto>) => (
        <SelectFilter table={table} columnId="procesoGeneral.nombre" />
      ),
    },
    cell: ({ row }) => (
      <CellColumn>
        <Badge
          style={{
            backgroundColor: row.original.presupuesto?.procesoGeneral?.color,
            color: "white",
          }}
          className="w-full justify-center text-center"
          variant={"secondary"}
        >
          {row.original.presupuesto?.procesoGeneral?.nombre || "-"}
        </Badge>
      </CellColumn>
    ),
  },

  {
    accessorKey: "presupuesto.descripcionCorta",
    header: "Descripción",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.presupuesto?.descripcionCorta || "-"}
      </CellColumn>
    ),
  },
  {
    accessorKey: "presupuesto.fechaEntregaEstimada",
    header: "Fecha Entrega P.",
    cell: ({ row }) => (
      <CellColumn>
        {formatDate(row.original.presupuesto?.fechaEntregaEstimada)}
      </CellColumn>
    ),
  },

  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <CellColumn>{getTipoBadge(row.getValue("tipo"))}</CellColumn>
    ),
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
];
