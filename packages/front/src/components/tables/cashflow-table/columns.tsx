import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { format, parseISO, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { formatDate, formatDay, today } from "@/utils/date";
import { isDateDisabled } from "@/utils/cashflow-date";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCashflowStore } from "./store";
import { useGetCashflowColumnasQuery } from "@/hooks/cashflow-transaccion";

export const Columns: React.FC = () => {
  const {
    vista,
    weekStart,
    currentYear,
    currentMonth,
    diasHabilesPermitidos,
    permitirEdicionSinLimite,
    expanded,
    collapseAll,
    expandAll,
  } = useCashflowStore();

  // Preparar parámetros según la vista
  const params = React.useMemo(() => {
    if (vista === "semanal") {
      return { from: format(weekStart, "yyyy-MM-dd") };
    } else if (vista === "mensual" || vista === "trimestral") {
      return { year: currentYear };
    } else if (vista === "semanal-mes") {
      return { year: currentYear, month: currentMonth };
    }
    return {};
  }, [vista, weekStart, currentYear, currentMonth]);

  // Obtener columnas desde el backend
  const { data: columnasData, isLoading } = useGetCashflowColumnasQuery(
    vista,
    params
  );

  // Fallback mientras carga
  const columnas = React.useMemo(() => {
    if (columnasData && columnasData.fechas) {
      return columnasData.fechas;
    }
    // Fallback básico según vista
    if (vista === "trimestral") return ["Q1", "Q2", "Q3", "Q4"];
    if (vista === "semanal-mes") return ["S1", "S2", "S3", "S4"];
    return [];
  }, [columnasData, vista]);

  if (isLoading || columnas.length === 0) {
    return null;
  }

  const isAllCollapsed = !expanded.all;

  return (
    <TableRow className="border-b bg-muted/50">
      <TableHead className="py-2 px-3 text-left font-semibold text-sm w-[200px]">
        <div className="flex items-center gap-2">
          <div title={isAllCollapsed ? "Expandir todo" : "Colapsar todo"}>
            {isAllCollapsed ? (
              <ChevronRight
                className="h-4 w-4 cursor-pointer hover:text-primary transition-colors"
                onClick={() => expandAll()}
              />
            ) : (
              <ChevronDown
                className="h-4 w-4 cursor-pointer hover:text-primary transition-colors"
                onClick={() => collapseAll()}
              />
            )}
          </div>
          <span></span>
        </div>
      </TableHead>
      {columnas.map((fecha) => {
        // Obtener fecha de inicio para vista semanal-mes
        const semanasInfo = columnasData?.semanasInfo || {};
        const fechaReal =
          vista === "semanal-mes" && semanasInfo[fecha]
            ? semanasInfo[fecha].inicio
            : fecha;

        const disabled = isDateDisabled(
          fechaReal,
          vista,
          diasHabilesPermitidos,
          permitirEdicionSinLimite
        );
        const isToday = today() === fecha;

        // Vista trimestral: Q1, Q2, Q3, Q4
        if (vista === "trimestral") {
          return (
            <TableHead
              key={fecha}
              className="py-2 px-3 text-center font-semibold"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold">{fecha}</span>
                <span className="text-xs text-muted-foreground">
                  {currentYear}
                </span>
              </div>
            </TableHead>
          );
        }

        // Vista semanal-mes: S1, S2, S3, S4, S5
        if (vista === "semanal-mes") {
          const info = semanasInfo[fecha];

          // Verificar si la semana actual está dentro de este rango
          const isCurrentWeek = info
            ? isWithinInterval(new Date(), {
                start: parseISO(info.inicio),
                end: parseISO(info.fin),
              })
            : false;

          return (
            <TableHead
              key={fecha}
              className="py-2 px-3 text-center font-semibold"
            >
              <div className="flex flex-col">
                <span
                  className={`text-sm ${isCurrentWeek ? "font-bold text-gray-800" : "font-medium"}`}
                >
                  {fecha.replace("S", "Semana ")}
                </span>
                {info && (
                  <span
                    className={`text-xs ${isCurrentWeek ? "font-bold text-gray-800" : "text-muted-foreground"}`}
                  >
                    {format(parseISO(info.inicio), "dd/MM", { locale: es })} -{" "}
                    {format(parseISO(info.fin), "dd/MM", { locale: es })}
                  </span>
                )}
              </div>
            </TableHead>
          );
        }

        // Vista mensual: nombre del mes
        if (vista === "mensual") {
          const [year, month] = fecha.split("-");
          const monthDate = new Date(Number(year), Number(month) - 1, 1);
          return (
            <TableHead
              key={fecha}
              className="py-2 px-3 text-center font-semibold"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {format(monthDate, "MMM", { locale: es })}
                </span>
                <span className="text-xs text-muted-foreground">{year}</span>
              </div>
            </TableHead>
          );
        }

        // Vista semanal (diaria): día y fecha
        return (
          <TableHead
            key={fecha}
            className={`py-2 px-3 text-center font-semibold ${
              disabled ? "bg-gray-100 text-gray-500" : ""
            }`}
          >
            <div className="flex flex-col">
              <span
                className={`text-sm ${isToday ? "font-bold text-gray-800" : "font-medium"} ${
                  disabled ? "text-gray-400" : ""
                }`}
              >
                {formatDate(fecha)}
              </span>
              <span
                className={`text-xs ${
                  isToday ? "font-bold text-gray-800" : "text-muted-foreground"
                } ${disabled ? "text-gray-400" : ""}`}
              >
                {formatDay(fecha)}
              </span>
            </div>
          </TableHead>
        );
      })}
    </TableRow>
  );
};
