import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBancoSaldoMutation } from "@/hooks/banco-saldo";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { BancoSaldo } from "@/types";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { CellColumn } from "@/components/ui/cell-column";
import { formatMoney } from "@/utils/number";
const baseUrl = "bancos";

const DataTableRowActions = ({ data }: { data: BancoSaldo }) => {
  const { mutate } = useDeleteBancoSaldoMutation();
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
        <Link className="" href={`/${baseUrl}/${data.bancoId}/${data.id}`}>
          <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => data.id && mutate(data.id)}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = (
  hideBancoColumn: boolean = false
): ColumnDef<BancoSaldo>[] => {
  const allColumns: ColumnDef<BancoSaldo>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableGrouping: true,
      cell: ({ row }) => <div className="pl-4">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "banco.nombre",
      header: "Banco",
      cell: ({ row }) => {
        const banco = row.original.banco;
        return (
          <Link className="pl-4" href={`${baseUrl}/${banco?.id}`}>
            <CellColumn>{banco?.nombre}</CellColumn>
          </Link>
        );
      },
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => {
        const monto = parseFloat(row.getValue("monto"));
        return <CellColumn>{formatMoney(monto)}</CellColumn>;
      },
    },
    {
      accessorKey: "descubiertoMonto",
      header: "Descubierto Monto",
      cell: ({ row }) => {
        const descubiertoMonto = parseFloat(row.getValue("descubiertoMonto"));
        return <CellColumn>{formatMoney(descubiertoMonto)}</CellColumn>;
      },
    },
    {
      accessorKey: "descubiertoUso",
      header: "Descubierto Uso",
      cell: ({ row }) => {
        const descubiertoUso = parseFloat(row.getValue("descubiertoUso"));
        return <CellColumn>{formatMoney(descubiertoUso)}</CellColumn>;
      },
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      meta: {
        filterVariant: "date",
      },

      cell: ({ row }) => {
        const fecha = row.getValue("fecha") as string;
        return <CellColumn>{formatDate(fecha)}</CellColumn>;
      },
    },
    {
      id: "acciones",
      cell: ({ row }) => {
        return <DataTableRowActions data={row.original} />;
      },
    },
  ];

  // Si se debe ocultar la columna banco (cuando se filtra por banco específico)
  if (hideBancoColumn) {
    return allColumns.filter((col, index) => index !== 1); // Remover la segunda columna (banco)
  }

  return allColumns;
};
