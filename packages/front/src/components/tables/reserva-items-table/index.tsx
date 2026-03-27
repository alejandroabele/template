"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useGetReservaByIdQuery } from "@/hooks/reserva";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

interface ReservaItemsTableProps {
  reservaId: number;
}

export function ReservaItemsTable({ reservaId }: ReservaItemsTableProps) {
  const { data: reserva, isLoading } = useGetReservaByIdQuery(reservaId);

  const table = useReactTable({
    data: reserva?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
    enableSorting: false,
    enableFilters: false,
  });

  if (isLoading) return <SkeletonTable />;

  if (!reserva?.items || reserva.items.length === 0) {
    return (
      <div className="border border-dashed rounded py-8 text-center text-muted-foreground text-sm">
        No hay productos en esta reserva
      </div>
    );
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      toolbar={true}
      pagination={false}
    />
  );
}
