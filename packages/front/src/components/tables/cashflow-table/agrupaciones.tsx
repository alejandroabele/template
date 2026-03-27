import React, { useMemo } from "react";
import { format } from "date-fns";
import { useCashflowStore } from "./store";
import {
  useGetCashflowResumenSemanaQuery,
  useGetCashflowResumenMesQuery,
  useGetCashflowResumenTrimestreQuery,
  useGetCashflowResumenSemanaMesQuery,
} from "@/hooks/cashflow-transaccion";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";
import { Agrupacion } from "./agrupacion";

interface AgrupacionesProps {
  onOpenNewTransaction: (categoria: CashflowCategoria, fecha: string) => void;
  onEditTransaction: (transaccion: CashflowTransaccion) => void;
  simulacionId?: number;
}

export const Agrupaciones: React.FC<AgrupacionesProps> = ({
  onOpenNewTransaction,
  onEditTransaction,
  simulacionId,
}) => {
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
  } = useCashflowStore();

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

  const resumen =
    vista === "semanal"
      ? resumenSemana
      : vista === "mensual"
        ? resumenMes
        : vista === "trimestral"
          ? resumenTrimestre
          : resumenSemanaMes;

  const columnas = useMemo(() => (resumen as any)?.fechas || [], [resumen]);
  const totalesPorDia = useMemo(() => (resumen as any)?.totalesPorFecha || {}, [resumen]);
  const semanasInfo = useMemo(() => (resumen as any)?.semanasInfo || {}, [resumen]);

  // Agrupar categorías por agrupacion_id, luego por rubro_id dentro de cada agrupación
  const agrupaciones = useMemo(() => {
    const categorias = ((resumen as any)?.categorias || []).filter(
      (cat: any) => cat.agrupacion_id != null
    );

    const agrupacionesMap: Record<
      string,
      {
        agrupacionId: number;
        agrupacionNombre: string;
        agrupacionTipo: "ingreso" | "egreso";
        agrupacionOrden: number;
        rubros: Record<string, any>;
      }
    > = {};

    categorias.forEach((categoria: any) => {
      const agrupacionId = categoria.agrupacion_id;
      const agrupacionKey = `agrupacion-${agrupacionId}`;

      if (!agrupacionesMap[agrupacionKey]) {
        agrupacionesMap[agrupacionKey] = {
          agrupacionId,
          agrupacionNombre: categoria.agrupacion_nombre,
          agrupacionTipo: categoria.agrupacion_tipo,
          agrupacionOrden: categoria.agrupacion_orden ?? 0,
          rubros: {},
        };
      }

      const rubroId = categoria.rubro_id || null;
      const rubroKey = rubroId ? `rubro-${rubroId}` : "sin-rubro";

      if (!agrupacionesMap[agrupacionKey].rubros[rubroKey]) {
        agrupacionesMap[agrupacionKey].rubros[rubroKey] = {
          rubroId,
          rubroNombre: categoria.rubro_nombre || null,
          categorias: [],
          totales: {},
        };
      }

      agrupacionesMap[agrupacionKey].rubros[rubroKey].categorias.push(categoria);

      Object.keys(categoria.transacciones || {}).forEach((fecha) => {
        if (!agrupacionesMap[agrupacionKey].rubros[rubroKey].totales[fecha]) {
          agrupacionesMap[agrupacionKey].rubros[rubroKey].totales[fecha] = 0;
        }
        agrupacionesMap[agrupacionKey].rubros[rubroKey].totales[fecha] += Number(
          categoria.transacciones[fecha] || 0
        );
      });
    });

    return Object.values(agrupacionesMap)
      .sort((a, b) => a.agrupacionOrden - b.agrupacionOrden)
      .map((ag) => ({
        ...ag,
        rubros: Object.values(ag.rubros),
      }));
  }, [resumen]);

  return (
    <>
      {agrupaciones.map((ag) => (
        <Agrupacion
          key={ag.agrupacionId}
          agrupacionId={ag.agrupacionId}
          agrupacionNombre={ag.agrupacionNombre}
          agrupacionTipo={ag.agrupacionTipo}
          rubros={ag.rubros}
          columnas={columnas}
          vista={vista}
          totalesPorDia={totalesPorDia}
          semanasInfo={semanasInfo}
          diasHabilesPermitidos={diasHabilesPermitidos}
          permitirEdicionSinLimite={permitirEdicionSinLimite}
          onOpenNewTransaction={onOpenNewTransaction}
          onEditTransaction={onEditTransaction}
        />
      ))}
    </>
  );
};
