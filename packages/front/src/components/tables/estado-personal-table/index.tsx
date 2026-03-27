"use client";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { useGetPersonasQuery } from "@/hooks/persona";
import { fetch as fetchJornadas } from "@/services/jornada";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { columns, PersonaConEstado } from "./columns";

export default function EstadoPersonalTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const hoy = format(new Date(), "yyyy-MM-dd");

  // Filtros locales (no se envían al backend)
  const columnFiltersBackend = useMemo(
    () => columnFilters.filter((f) => f.id !== "trabajos"),
    [columnFilters]
  );

  const { data: personas = [], isLoading: isLoadingPersonas } =
    useGetPersonasQuery({
      pagination,
      columnFilters: columnFiltersBackend,
      sorting,
      globalFilter,
    });

  const { data: jornadas = [] } = useQuery({
    queryKey: ["jornadas-hoy", hoy],
    queryFn: () =>
      fetchJornadas({
        pagination: { pageIndex: 0, pageSize: 1000 },
        columnFilters: [{ id: "fecha", value: { from: hoy, to: hoy } }],
        sorting: [],
      }),
    refetchInterval: 30000,
  });

  // Construir Map de personaId → JornadaPersona[], filtrando por OT si aplica
  const asignacionesPorPersona = useMemo(() => {
    const map = new Map<
      number,
      NonNullable<(typeof jornadas)[0]["jornadaPersonas"]>
    >();
    jornadas.forEach((jornada) => {
      if (jornada.cancelado === 1) return;
      jornada.jornadaPersonas?.forEach((jp) => {
        if (!jp.personaId) return;
        const existing = map.get(jp.personaId) ?? [];
        map.set(jp.personaId, [...existing, { ...jp, jornada }]);
      });
    });
    return map;
  }, [jornadas]);

  // Enriquecer personas con sus asignaciones del día
  const data: PersonaConEstado[] = useMemo(() => {
    return personas.map((persona) => ({
      ...persona,
      asignacionesHoy: persona.id
        ? (asignacionesPorPersona.get(persona.id) ?? [])
        : [],
    }));
  }, [personas, asignacionesPorPersona]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  if (isLoadingPersonas) return <SkeletonTable />;

  return (
    <div className="space-y-3">
      <DataTable table={table} toolbar columns={columns} />
    </div>
  );
}
