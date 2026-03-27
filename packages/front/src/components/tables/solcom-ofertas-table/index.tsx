"use client";

import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetSolcomsQuery } from "@/hooks/solcom";
import { columns } from "./columns";
import { OfertaTable } from "@/components/tables/oferta-table";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useSolcomOfertasTableStore } from "./store";
import type { Solcom } from "@/types";

export function SolcomOfertasTable() {
  const {
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    expanded,
    setExpanded,
  } = useSolcomOfertasTableStore();

  const { data = [], isLoading } = useGetSolcomsQuery({
    pagination,
    columnFilters,
    sorting: [{ id: "id", desc: true }],
    globalFilter: "",
  });

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    manualFiltering: true,
    manualPagination: true,
    state: {
      columnFilters,
      expanded,
      pagination,
    },
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <DataTable
      table={table}
      columns={columns}
      toolbar={true}
      pagination={true}
      renderSubComponent={(row: Solcom) => (
        <OfertaTable solcomId={row.id!} simple />
      )}
    />
  );
}
