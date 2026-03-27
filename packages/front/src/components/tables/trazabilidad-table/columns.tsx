"use client";
import { ColumnDef } from "@tanstack/react-table";
import { JornadaPersona } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { duracionMinutos } from "@/utils/produccion";
import { getTime } from "@/utils/date";

function formatFechaHora(str?: string): string {
  if (!str) return "-";
  const hora = getTime(str);
  const dia = str.slice(8, 10);
  const mes = str.slice(5, 7);
  return `${hora} ${dia}/${mes}`;
}

function formatDuracion(inicio?: string, fin?: string): string {
  if (!inicio || !fin) return "-";
  const min = duracionMinutos(inicio, fin);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

export const columns: ColumnDef<JornadaPersona>[] = [
  {
    id: "operario",
    header: "Operario",
    accessorFn: (row) =>
      `${row.persona?.nombre ?? ""} ${row.persona?.apellido ?? ""}`.trim(),
    cell: ({ getValue }) => (
      <CellColumn>
        <span className="font-medium">{getValue<string>() || "-"}</span>
      </CellColumn>
    ),
  },
  {
    id: "ot",
    header: "OT",
    accessorFn: (row) =>
      `#${row.jornada?.presupuesto?.id} — ${row.jornada?.presupuesto?.cliente?.nombre ?? ""}`,
    cell: ({ row }) => {
      const id = row.original.jornada?.presupuesto?.id;
      const cliente = row.original.jornada?.presupuesto?.cliente?.nombre;
      return (
        <CellColumn>
          <span className="font-medium">#{id}</span>
          {cliente && (
            <span className="text-muted-foreground ml-1 hidden sm:inline">
              — {cliente}
            </span>
          )}
        </CellColumn>
      );
    },
  },
  {
    id: "tipo",
    header: "Tipo de trabajo",
    accessorFn: (row) => row.produccionTrabajo?.nombre ?? "",
    cell: ({ row }) => {
      const nombre = row.original.produccionTrabajo?.nombre;
      const color = row.original.produccionTrabajo?.color;
      return (
        <CellColumn>
          <div className="flex items-center gap-1.5">
            {color && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
            )}
            <span>{nombre ?? "-"}</span>
          </div>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "inicio",
    header: "Inicio",
    meta: { filterVariant: "date-range" },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      let parsed: { from?: string; to?: string } | null = null;
      try {
        parsed =
          typeof filterValue === "string"
            ? JSON.parse(filterValue)
            : filterValue;
      } catch {
        return true;
      }
      if (!parsed?.from || !parsed?.to) return true;
      const val = row.getValue<string>(columnId);
      if (!val) return false;
      const fecha = val.slice(0, 10); // "YYYY-MM-DD"
      return fecha >= parsed.from && fecha <= parsed.to;
    },
    cell: ({ getValue }) => (
      <CellColumn>
        <span className="font-mono text-xs">
          {formatFechaHora(getValue<string>())}
        </span>
      </CellColumn>
    ),
  },
  {
    accessorKey: "fin",
    meta: { filterVariant: "date-range" },
    header: "Fin",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.fin ? (
          <span className="font-mono text-xs">
            {formatFechaHora(row.original.fin)}
          </span>
        ) : (
          <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-400 text-xs">
            En curso
          </Badge>
        )}
      </CellColumn>
    ),
  },
  {
    id: "duracion",
    header: "Duración",
    enableColumnFilter: false,
    accessorFn: (row) =>
      row.inicio && row.fin ? duracionMinutos(row.inicio, row.fin) : -1,
    cell: ({ row }) => (
      <CellColumn>
        <span className="font-mono font-medium">
          {formatDuracion(row.original.inicio, row.original.fin)}
        </span>
      </CellColumn>
    ),
  },
];
