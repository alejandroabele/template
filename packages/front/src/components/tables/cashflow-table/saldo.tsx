import React, { useMemo } from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChartSpline } from "lucide-react";
import { formatMoney } from "@/utils/number";
import { useCashflowStore } from "./store";
import {
  useGetCashflowResumenSemanaQuery,
  useGetCashflowResumenMesQuery,
  useGetCashflowResumenTrimestreQuery,
  useGetCashflowResumenSemanaMesQuery,
  useGetCashflowColumnasQuery,
} from "@/hooks/cashflow-transaccion";

interface SaldoProps {
  simulacionId?: number;
}

export const Saldo: React.FC<SaldoProps> = ({ simulacionId }) => {
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

  // 2. Hacer queries según la vista
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

  const totalesPorDia = useMemo(() => {
    return (resumen as any)?.totalesPorFecha || {};
  }, [resumen]);

  // 5. Mapear totales a columnas (para mensual/trimestral usar índice)
  const totalesPorColumna = useMemo(() => {
    if (!totalesPorDia || !columnas.length) return {};

    const result: Record<string, { ingresos: number; egresos: number }> = {};

    if (vista === "mensual" || vista === "trimestral") {
      // Para mensual/trimestral, mapear por índice
      const fechasArray = Object.keys(totalesPorDia);
      columnas.forEach((columna, index) => {
        if (fechasArray[index] && totalesPorDia[fechasArray[index]]) {
          result[columna] = totalesPorDia[fechasArray[index]];
        }
      });
    } else {
      // Para semanal y semanal-mes, usar directamente
      // El backend ya retorna las claves correctas (fechas para semanal, S1/S2/S3 para semanal-mes)
      return totalesPorDia;
    }

    return result;
  }, [totalesPorDia, columnas, vista]);

  // Si no hay columnas, no renderizar
  if (!columnas.length) {
    return null;
  }

  return (
    <TableRow className="bg-muted border-t-4 border-muted-foreground/30 font-bold cursor-default">
      <TableCell className="py-2 px-3 text-foreground/80 text-sm w-[200px] sticky left-0 bg-muted z-10">
        <div className="flex items-center gap-2">
          <ChartSpline className="h-4 w-4" />
          RESULTADO
        </div>
      </TableCell>
      {columnas.map((fecha: string) => {
        const saldo =
          (totalesPorColumna[fecha]?.ingresos || 0) -
          (totalesPorColumna[fecha]?.egresos || 0);
        return (
          <TableCell key={fecha} className="py-2 px-3 text-center">
            <div className="bg-white rounded p-1.5 shadow-sm">
              <div
                className={`font-bold text-sm whitespace-nowrap ${
                  saldo >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
                title="Saldo del Día"
              >
                {formatMoney(saldo)}
              </div>
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};
