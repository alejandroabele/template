"use client";
import {
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useGetContactoProximosQuery } from "@/hooks/contacto-proximo";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { columns } from "./columns";

interface ContactoProximoTableProps {
  casoId?: number;
}

export function ContactoProximoTable({ casoId }: ContactoProximoTableProps) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = React.useState([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState(
    casoId ? [{ id: "casoId", value: casoId }] : []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const { data = [], isLoading } = useGetContactoProximosQuery({
    pagination,
    columnFilters,
    sorting,
    globalFilter,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  if (isLoading) return <SkeletonTable />;

  return <DataTable table={table} toolbar columns={columns} create={false} />;
}
