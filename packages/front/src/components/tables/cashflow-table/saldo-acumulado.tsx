import React, { useMemo } from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChartNoAxesCombined } from "lucide-react";
import { formatMoney } from "@/utils/number";
import { useCashflowStore } from "./store";
import {
  useGetCashflowResumenSemanaQuery,
  useGetCashflowResumenMesQuery,
  useGetCashflowResumenTrimestreQuery,
  useGetCashflowResumenSemanaMesQuery,
  useGetCashflowColumnasQuery,
} from "@/hooks/cashflow-transaccion";

interface SaldoAcumuladoProps {
  simulacionId?: number;
}

export const SaldoAcumulado: React.FC<SaldoAcumuladoProps> = ({ simulacionId }) => {
  // 1. Leer parámetros del store
  const {
    vista,
    weekStart,
    weekEnd,
    monthStart,
    monthEnd,
    currentYear,
    currentMonth,
    incluirProyectado,
  } = useCashflowStore();

  // 1.1 Obtener columnas desde el backend
  const params = useMemo(() => {
    if (vista === "semanal") {
      return { from: format(weekStart, "yyyy-MM-dd") };
    } else if (vista === "mensual" || vista === "trimestral") {
      return { year: currentYear };
    } else if (vista === "semanal-mes") {
      return { year: currentYear, month: currentMonth };
    }
    return {};
  }, [vista, weekStart, currentYear, currentMonth]);

  const { data: columnasData } = useGetCashflowColumnasQuery(vista, params);

  // 2. Hacer queries según la vista para obtener ingresos/egresos
  const { data: resumenSemana } = useGetCashflowResumenSemanaQuery(
    format(weekStart, "yyyy-MM-dd"),
    format(weekEnd, "yyyy-MM-dd"),
    incluirProyectado,
    { enabled: vista === "semanal" },
    simulacionId
  );

  const { data: resumenMes } = useGetCashflowResumenMesQuery(
    format(monthStart, "yyyy-MM-dd"),
    format(monthEnd, "yyyy-MM-dd"),
    incluirProyectado,
    { enabled: vista === "mensual" },
    simulacionId
  );

  const { data: resumenTrimestre } = useGetCashflowResumenTrimestreQuery(
    currentYear,
    incluirProyectado,
    { enabled: vista === "trimestral" },
    simulacionId
  );

  const { data: resumenSemanaMes } = useGetCashflowResumenSemanaMesQuery(
    currentYear,
    currentMonth,
    incluirProyectado,
    { enabled: vista === "semanal-mes" },
    simulacionId
  );

  // 3. Seleccionar datos según la vista
  const resumen =
    vista === "semanal"
      ? resumenSemana
      : vista === "mensual"
        ? resumenMes
        : vista === "trimestral"
          ? resumenTrimestre
          : resumenSemanaMes;

  // 4. Obtener columnas desde columnasData (nueva fuente de verdad)
  const columnas = useMemo(() => {
    return columnasData?.fechas || [];
  }, [columnasData]);

  // 5. Obtener proyección acumulada directamente del backend
  // El backend ya calcula el saldo acumulado histórico para todas las vistas
  const proyeccionPorFechaBackend = useMemo(() => {
    return (resumen as { proyeccionPorFecha?: Record<string, number> })?.proyeccionPorFecha || {};
  }, [resumen]);

  // 6. Mapear proyección a columnas (solo para mensual/trimestral que usan índices)
  const proyeccionPorFecha = useMemo(() => {
    if (!proyeccionPorFechaBackend || !columnas.length) return {};

    const result: Record<string, number> = {};

    if (vista === "mensual" || vista === "trimestral") {
      // Para mensual/trimestral, mapear por índice
      const fechasArray = Object.keys(proyeccionPorFechaBackend);
      columnas.forEach((columna, index) => {
        if (fechasArray[index] && proyeccionPorFechaBackend[fechasArray[index]] !== undefined) {
          result[columna] = proyeccionPorFechaBackend[fechasArray[index]];
        }
      });
    } else {
      // Para semanal y semanal-mes, usar directamente
      // El backend ya retorna las claves correctas (fechas para semanal, S1/S2/S3 para semanal-mes)
      return proyeccionPorFechaBackend;
    }

    return result;
  }, [proyeccionPorFechaBackend, columnas, vista]);

  // Si no hay columnas, no renderizar
  if (!columnas.length) {
    return null;
  }

  return (
    <TableRow className="bg-sky-50 border-t hover:bg-sky-50 cursor-default">
      <TableCell className="py-2 px-3 font-semibold text-sky-800 text-sm w-[200px] sticky left-0 bg-sky-50 z-10">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined className="h-4 w-4" />
          SALDO ACUMULADO
        </div>
      </TableCell>
      {columnas.map((fecha) => {
        const proyeccionAcumulada = proyeccionPorFecha[fecha] || 0;
        return (
          <TableCell key={fecha} className="py-2 px-3 text-center">
            <div className="bg-white rounded p-1.5 shadow-sm">
              <div
                className={`font-bold text-xs whitespace-nowrap ${
                  proyeccionAcumulada >= 0 ? "text-slate-700" : "text-rose-700"
                }`}
                title="Saldo Acumulado desde el inicio"
              >
                {formatMoney(proyeccionAcumulada)}
              </div>
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};
