import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { formatMoney } from "@/utils/number";
import { CategoryRow } from "./categoria";
import { RubroRow } from "./rubro";
import { useCashflowStore } from "./store";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";

type Vista = "semanal" | "semanal-mes" | "mensual" | "trimestral";

interface RubroAgrupado {
  rubroId: number | null;
  rubroNombre: string | null;
  categorias: any[];
  totales: Record<string, number>;
}

interface SeccionIngresosEgresosProps {
  tipo: "ingreso" | "egreso";
  rubros: RubroAgrupado[];
  columnas: string[];
  vista: Vista;
  totalesPorDia: Record<
    string,
    { ingresos: number; egresos: number; neto: number }
  >;
  semanasInfo: Record<string, { inicio: string; fin: string }>;
  diasHabilesPermitidos: number;
  permitirEdicionSinLimite: boolean;
  onOpenNewTransaction: (categoria: CashflowCategoria, fecha: string) => void;
  onEditTransaction: (transaccion: CashflowTransaccion) => void;
}

export const SeccionIngresosEgresos: React.FC<SeccionIngresosEgresosProps> = ({
  tipo,
  rubros,
  columnas,
  vista,
  totalesPorDia,
  semanasInfo,
  diasHabilesPermitidos,
  permitirEdicionSinLimite,
  onOpenNewTransaction,
  onEditTransaction,
}) => {
  const {
    expanded,
    toggleSeccion,
    toggleRubro,
    toggleCategory,
    selectionMode,
    selectedTransacciones,
    toggleTransaccionSelection,
  } = useCashflowStore();

  const seccionKey = tipo;
  const isSeccionCollapsed = !expanded.secciones.has(seccionKey);

  const bgColor =
    tipo === "ingreso"
      ? "bg-emerald-200 hover:bg-emerald-200"
      : "bg-rose-200 hover:bg-rose-200";
  const borderColor =
    tipo === "ingreso" ? "border-emerald-300" : "border-rose-300";
  const textColor = tipo === "ingreso" ? "text-emerald-800" : "text-rose-800";
  const Icon = tipo === "ingreso" ? TrendingUp : TrendingDown;
  const label = tipo === "ingreso" ? "INGRESOS" : "EGRESOS";
  const ChevronIcon = isSeccionCollapsed ? ChevronRight : ChevronDown;

  return (
    <>
      {/* Header de Sección */}
      <TableRow
        className={`${bgColor} border-t ${borderColor} font-bold cursor-pointer`}
        onClick={() => toggleSeccion(seccionKey)}
      >
        <TableCell
          className={`py-2 px-3 ${textColor} text-sm w-[200px] sticky left-0 z-10`}
          style={{ background: "inherit" }}
        >
          <div className="flex items-center gap-2">
            <ChevronIcon className="h-4 w-4" />
            <Icon className="h-4 w-4" />
            {label}
          </div>
        </TableCell>
        {columnas.map((fecha) => {
          const valor =
            tipo === "ingreso"
              ? totalesPorDia[fecha]?.ingresos || 0
              : totalesPorDia[fecha]?.egresos || 0;

          const valueColor =
            tipo === "ingreso" ? "text-emerald-700" : "text-rose-700";

          return (
            <TableCell key={fecha} className="py-2 px-3 text-center">
              <div className="bg-white rounded p-1.5 shadow-sm">
                <div
                  className={`font-bold text-sm whitespace-nowrap ${valueColor}`}
                >
                  {formatMoney(valor)}
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>

      {!isSeccionCollapsed && (
        <>
          {rubros.length > 0 ? (
            rubros.map((rubro) => {
              const rubroKey = rubro.rubroId
                ? `rubro-${rubro.rubroId}`
                : "sin-rubro";

              // Lógica: el rubro está colapsado si NO está en expanded.rubros Y expanded.all es false
              const isRubroCollapsed =
                !expanded.all && !expanded.rubros.has(rubroKey);

              return (
                <React.Fragment key={rubroKey}>
                  <RubroRow
                    rubroId={rubro.rubroId}
                    rubroNombre={rubro.rubroNombre}
                    tipo={tipo}
                    columnas={columnas}
                    totalesRubro={rubro.totales}
                    isCollapsed={isRubroCollapsed}
                    onToggle={toggleRubro}
                  />

                  {!isRubroCollapsed &&
                    rubro.categorias.map((categoria: any) => (
                      <CategoryRow
                        key={categoria.id}
                        categoria={categoria}
                        tipo={tipo}
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
                No hay categorías de{" "}
                {tipo === "ingreso" ? "ingresos" : "egresos"} configuradas
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};
