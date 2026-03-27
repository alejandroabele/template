import React, { useMemo } from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { TrendingDown, ChevronDown, ChevronRight } from "lucide-react";
import { formatMoney } from "@/utils/number";
import { Categoria } from "./categoria";
import { Rubro } from "./rubro";
import { useCashflowStore } from "./store";
import {
  useGetCashflowResumenSemanaQuery,
  useGetCashflowResumenMesQuery,
  useGetCashflowResumenTrimestreQuery,
  useGetCashflowResumenSemanaMesQuery,
} from "@/hooks/cashflow-transaccion";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";

interface EgresosProps {
  onOpenNewTransaction: (categoria: CashflowCategoria, fecha: string) => void;
  onEditTransaction: (transaccion: CashflowTransaccion) => void;
  simulacionId?: number;
}

export const Egresos: React.FC<EgresosProps> = ({
  onOpenNewTransaction,
  onEditTransaction,
  simulacionId,
}) => {
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
    diasHabilesPermitidos,
    permitirEdicionSinLimite,
    expanded,
    toggleSeccion,
    toggleRubro,
    toggleCategory,
    selectionMode,
    selectedTransacciones,
    toggleTransaccionSelection,
  } = useCashflowStore();

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

  // 4. Extraer y agrupar datos de egresos por rubro
  const rubros = useMemo(() => {
    // El backend devuelve categorias, necesitamos agruparlas por rubro
    const categorias = ((resumen as any)?.categorias || []).filter(
      (cat: any) => cat.tipo === "egreso"
    );

    const grupos: Record<string, any> = {};

    categorias.forEach((categoria: any) => {
      const rubroId = categoria.rubro_id || null;
      const rubroKey = rubroId ? `rubro-${rubroId}` : "sin-rubro";

      if (!grupos[rubroKey]) {
        grupos[rubroKey] = {
          rubroId,
          rubroNombre: categoria.rubro_nombre || null,
          categorias: [],
          totales: {},
        };
      }

      grupos[rubroKey].categorias.push(categoria);

      // Calcular totales del rubro por fecha
      Object.keys(categoria.transacciones || {}).forEach((fecha) => {
        if (!grupos[rubroKey].totales[fecha]) {
          grupos[rubroKey].totales[fecha] = 0;
        }
        grupos[rubroKey].totales[fecha] += Number(
          categoria.transacciones[fecha] || 0
        );
      });
    });

    return Object.values(grupos);
  }, [resumen]);

  const columnas = useMemo(() => {
    return (resumen as any)?.fechas || [];
  }, [resumen]);

  const totalesPorDia = useMemo(() => {
    return (resumen as any)?.totalesPorFecha || {};
  }, [resumen]);

  const semanasInfo = useMemo(() => {
    return (resumen as any)?.semanasInfo || {};
  }, [resumen]);

  // 5. Renderizar
  const isSeccionCollapsed = !expanded.secciones.has("egreso");
  const ChevronIcon = isSeccionCollapsed ? ChevronRight : ChevronDown;

  return (
    <>
      {/* Header de Egresos */}
      <TableRow
        className="bg-rose-200 border-t border-rose-300 font-bold cursor-pointer hover:bg-rose-200"
        onClick={() => toggleSeccion("egreso")}
      >
        <TableCell
          className="py-2 px-3 text-rose-800 text-sm w-[200px] sticky left-0 z-10"
          style={{ background: "inherit" }}
        >
          <div className="flex items-center gap-2">
            <ChevronIcon className="h-4 w-4" />
            <TrendingDown className="h-4 w-4" />
            EGRESOS
          </div>
        </TableCell>
        {columnas.map((fecha) => {
          const valor = totalesPorDia[fecha]?.egresos || 0;

          return (
            <TableCell key={fecha} className="py-2 px-3 text-center">
              <div className="bg-white rounded p-1.5 shadow-sm">
                <div className="font-bold text-sm whitespace-nowrap text-rose-700">
                  {formatMoney(valor)}
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>

      {/* Rubros y Categorías */}
      {!isSeccionCollapsed && (
        <>
          {rubros.length > 0 ? (
            rubros.map((rubro) => {
              const rubroKey = rubro.rubroId
                ? `rubro-${rubro.rubroId}`
                : "sin-rubro";

              const isRubroCollapsed =
                !expanded.all && !expanded.rubros.has(rubroKey);

              return (
                <React.Fragment key={rubroKey}>
                  <Rubro
                    rubroId={rubro.rubroId}
                    rubroNombre={rubro.rubroNombre}
                    tipo="egreso"
                    columnas={columnas}
                    totalesRubro={rubro.totales}
                    isCollapsed={isRubroCollapsed}
                    onToggle={toggleRubro}
                  />

                  {!isRubroCollapsed &&
                    rubro.categorias.map((categoria: any) => (
                      <Categoria
                        key={categoria.id}
                        categoria={categoria}
                        tipo="egreso"
                        columnas={columnas}
                        vista={vista}
                        isCollapsed={!expanded.categorias.has(categoria.id)}
                        onToggle={toggleCategory}
                        onOpenNewTransaction={onOpenNewTransaction}
                        onEditTransaction={onEditTransaction}
                        selectionMode={selectionMode}
                        selectedTransacciones={selectedTransacciones}
                        onToggleSelection={toggleTransaccionSelection}
                        diasHabilesPermitidos={diasHabilesPermitidos}
                        permitirEdicionSinLimite={permitirEdicionSinLimite}
                        semanasInfo={semanasInfo}
                      />
                    ))}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnas.length + 1}
                className="py-2 px-3 text-center text-muted-foreground text-sm"
              >
                No hay categorías de egresos configuradas
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};
