import React, { useMemo } from "react";
import { format, addDays } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Landmark, ChevronDown, ChevronRight } from "lucide-react";
import { formatMoney } from "@/utils/number";
import { useCashflowStore } from "./store";
import { useGetSaldosPorFechasQuery } from "@/hooks/banco-saldo";
import { useGetCashflowColumnasQuery } from "@/hooks/cashflow-transaccion";

interface SaldoBancoAPI {
  banco_id: number;
  banco_nombre: string;
  monto: string;
  fecha: string;
  incluir_en_total: number;
  descubierto_monto: string;
  descubierto_uso: string;
}

export const CreditoDisponible: React.FC = () => {
  // 1. Leer parámetros globales del store
  const {
    vista,
    weekStart,
    monthStart,
    currentYear,
    currentMonth,
    expanded,
    toggleSeccion,
  } = useCashflowStore();

  // 2. Obtener columnas desde el backend
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

  const { data: columnasData, isLoading: isLoadingColumnas } =
    useGetCashflowColumnasQuery(vista, params);

  // 3. Calcular fechas reales para consultar saldos
  const fechasParaSaldos = useMemo(() => {
    const result: string[] = [];

    if (vista === "semanal") {
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        result.push(format(day, "yyyy-MM-dd"));
      }
    } else if (vista === "mensual") {
      // Para vista mensual, usar día actual si es el mes actual, sino último día del mes
      const hoy = new Date();
      for (let i = 0; i < 12; i++) {
        const mesActual =
          hoy.getFullYear() === currentYear && hoy.getMonth() === i;
        if (mesActual) {
          result.push(format(hoy, "yyyy-MM-dd"));
        } else {
          const lastDayOfMonth = new Date(currentYear, i + 1, 0);
          result.push(format(lastDayOfMonth, "yyyy-MM-dd"));
        }
      }
    } else if (vista === "trimestral") {
      // Para trimestral, usar día actual si es el trimestre actual, sino último día del trimestre
      const hoy = new Date();
      const trimestreActual = Math.floor(hoy.getMonth() / 3);
      const anioActual = hoy.getFullYear() === currentYear;

      for (let i = 0; i < 4; i++) {
        if (anioActual && trimestreActual === i) {
          result.push(format(hoy, "yyyy-MM-dd"));
        } else {
          const lastDayOfQuarter = new Date(currentYear, (i + 1) * 3, 0);
          result.push(format(lastDayOfQuarter, "yyyy-MM-dd"));
        }
      }
    } else if (vista === "semanal-mes") {
      // Para semanal-mes, consultar el último día de cada semana
      if (columnasData?.semanasInfo) {
        Object.values(columnasData.semanasInfo).forEach((info) => {
          result.push(info.fin);
        });
      }
    }

    return result;
  }, [vista, weekStart, currentYear, columnasData]);

  // 4. Llamar al backend para obtener saldos
  // Para semanal-mes, esperar a que columnasData esté disponible
  const shouldFetchSaldos = useMemo(() => {
    if (vista === "semanal-mes") {
      return (
        !isLoadingColumnas &&
        columnasData?.semanasInfo &&
        fechasParaSaldos.length > 0
      );
    }
    return fechasParaSaldos.length > 0;
  }, [vista, isLoadingColumnas, columnasData, fechasParaSaldos]);

  const { data: saldosPorFecha, isLoading: isLoadingSaldos } =
    useGetSaldosPorFechasQuery(fechasParaSaldos, shouldFetchSaldos);

  // 5. Mapear saldos a columnas (importante para todas las vistas)
  const saldosPorColumna = useMemo(() => {
    if (!saldosPorFecha || !columnasData) return {};

    const result: Record<
      string,
      {
        saldos: SaldoBancoAPI[];
        total: number;
        disponible: number;
      }
    > = {};

    if (vista === "semanal-mes" && columnasData.semanasInfo) {
      // Para semanal-mes, mapear cada semana a su fecha fin
      columnasData.fechas.forEach((semana) => {
        const info = columnasData.semanasInfo[semana];
        if (info && saldosPorFecha[info.fin]) {
          result[semana] = saldosPorFecha[info.fin];
        }
      });
    } else if (vista === "mensual" || vista === "trimestral") {
      // Para mensual/trimestral, mapear por índice (columnas usan etiquetas, saldos usan fechas)
      const fechasArray = Object.keys(saldosPorFecha);
      columnasData.fechas.forEach((columna, index) => {
        if (fechasArray[index] && saldosPorFecha[fechasArray[index]]) {
          result[columna] = saldosPorFecha[fechasArray[index]];
        }
      });
    } else {
      // Para vista semanal, usar directamente
      return saldosPorFecha;
    }

    return result;
  }, [saldosPorFecha, columnasData, vista]);

  // 6. Obtener columnas para mostrar
  const columnas = columnasData?.fechas || [];

  if (
    isLoadingColumnas ||
    isLoadingSaldos ||
    !saldosPorColumna ||
    Object.keys(saldosPorColumna).length === 0 ||
    columnas.length === 0
  ) {
    return null;
  }

  const primeraColumna = Object.keys(saldosPorColumna)[0];
  const bancos = (saldosPorColumna[primeraColumna]?.saldos ||
    []) as SaldoBancoAPI[];
  const isCollapsed = !expanded.secciones.has("credito-disponible");

  const ChevronIcon = isCollapsed ? ChevronRight : ChevronDown;

  return (
    <>
      {/* Header de Crédito Disponible */}
      <TableRow
        className="bg-indigo-50 border-t border-indigo-200 font-bold cursor-pointer hover:bg-indigo-50"
        onClick={() => toggleSeccion("credito-disponible")}
      >
        <TableCell className="py-2 px-3 text-indigo-700 text-sm w-[200px] sticky left-0 bg-indigo-50 z-10">
          <div className="flex items-center gap-2">
            <ChevronIcon className="h-4 w-4" />
            <Landmark className="h-4 w-4" />
            CRÉDITO DISPONIBLE
          </div>
        </TableCell>
        {columnas.map((fecha) => {
          const disponibleFecha = saldosPorColumna[fecha]?.disponible || 0;
          return (
            <TableCell key={fecha} className="py-2 px-3 text-center">
              <div className="bg-white rounded p-1.5 shadow-sm">
                <div
                  className={`font-bold text-sm whitespace-nowrap ${
                    disponibleFecha >= 0 ? "text-indigo-600" : "text-rose-700"
                  }`}
                >
                  {formatMoney(disponibleFecha)}
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>

      {/* Filas de cada banco */}
      {!isCollapsed &&
        bancos.map((banco: SaldoBancoAPI) => {
          const incluirEnTotal = banco.incluir_en_total === 1;
          return (
            <TableRow
              key={banco.banco_id}
              className="hover:bg-transparent"
            >
              <TableCell
                className={`py-2 px-3 pl-6 text-sm w-[200px] sticky left-0 bg-inherit z-10 ${
                  incluirEnTotal ? "" : "italic text-slate-400"
                }`}
              >
                {banco.banco_nombre}
                {!incluirEnTotal && (
                  <span className="text-xs ml-2">(no incluido en total)</span>
                )}
              </TableCell>
              {columnas.map((fecha) => {
                const saldoFecha = saldosPorColumna[fecha];
                const saldoBanco = saldoFecha?.saldos?.find(
                  (s) => s.banco_id === banco.banco_id
                );
                const descubiertoMonto = saldoBanco
                  ? parseFloat(saldoBanco.descubierto_monto || "0")
                  : 0;
                const descubiertoUso = saldoBanco
                  ? parseFloat(saldoBanco.descubierto_uso || "0")
                  : 0;
                const disponible = descubiertoMonto - descubiertoUso;

                const textColor = incluirEnTotal
                  ? disponible >= 0
                    ? "text-indigo-600"
                    : "text-rose-700"
                  : "text-slate-400";

                return (
                  <TableCell key={fecha} className="py-2 px-3 text-center">
                    <div
                      className={`font-medium text-sm whitespace-nowrap ${textColor}`}
                    >
                      {formatMoney(disponible)}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
    </>
  );
};
