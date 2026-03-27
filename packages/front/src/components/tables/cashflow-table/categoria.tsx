import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Plus, Clock, Check } from "lucide-react";
import { formatMoney } from "@/utils/number";
import { isDateDisabled } from "@/utils/cashflow-date";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";
import { useCashflowStore } from "./store";

type CategoriaConDetalle = CashflowCategoria & {
  transacciones?: Record<string, number>;
  transaccionesDetalle?: Record<string, CashflowTransaccion[]>;
};

type Vista = "semanal" | "semanal-mes" | "mensual" | "trimestral";

interface CategoriaProps {
  categoria: CategoriaConDetalle;
  tipo: "ingreso" | "egreso";
  columnas: string[];
  vista: Vista;
  semanasInfo: Record<string, { inicio: string; fin: string }>;
  diasHabilesPermitidos: number;
  permitirEdicionSinLimite: boolean;
  onOpenNewTransaction: (categoria: CashflowCategoria, fecha: string) => void;
  onEditTransaction: (transaccion: CashflowTransaccion) => void;
}

export const Categoria: React.FC<CategoriaProps> = ({
  categoria,
  tipo,
  columnas,
  vista,
  semanasInfo,
  diasHabilesPermitidos,
  permitirEdicionSinLimite,
  onOpenNewTransaction,
  onEditTransaction,
}) => {
  const {
    expanded,
    toggleCategory,
    selectionMode,
    selectedTransacciones,
    toggleTransaccionSelection,
    mostrarBancos,
  } = useCashflowStore();

  const isCollapsed = !expanded.categorias.has(categoria.id);
  const transaccionesDetalle = categoria.transaccionesDetalle || {};
  const totalesCategoriaByDay = columnas.map(
    (fecha) => categoria.transacciones[fecha] || 0
  );

  // Todas las transacciones de la categoría (across all fechas)
  const todasTransacciones = Object.values(transaccionesDetalle).flat();
  const seleccionables = todasTransacciones.filter((t) => t.id);
  const todosSeleccionados =
    seleccionables.length > 0 &&
    seleccionables.every((t) => selectedTransacciones.has(t.id!));
  const algunos = seleccionables.some((t) => selectedTransacciones.has(t.id!));

  const toggleTodosCategoria = () => {
    if (todosSeleccionados) {
      seleccionables.forEach((t) => toggleTransaccionSelection(t.id!));
    } else {
      seleccionables.forEach((t) => {
        if (!selectedTransacciones.has(t.id!)) {
          toggleTransaccionSelection(t.id!, t);
        }
      });
    }
  };

  // Función para obtener la fecha a usar según la vista
  const getFechaForNewTransaction = (columna: string): string => {
    if (vista === "semanal-mes" && semanasInfo[columna]) {
      // En vista semanal-mes, usar el primer día de la semana
      return semanasInfo[columna].inicio;
    }
    // En otras vistas, usar la columna directamente como fecha
    return columna;
  };

  return (
    <>
      {/* Fila principal de categoría */}
      <TableRow
        className={`${
          tipo === "ingreso"
            ? "bg-emerald-50/30 !hover:bg-emerald-50/30"
            : "bg-rose-50/30 !hover:bg-rose-50/30"
        } border-b cursor-pointer`}
        onClick={() => toggleCategory(categoria.id)}
      >
        <TableCell className="py-2 px-3 font-medium w-[200px] sticky left-0 bg-inherit z-10">
          <div className="flex items-center gap-2">
            {selectionMode && seleccionables.length > 0 && (
              <Checkbox
                checked={todosSeleccionados}
                onCheckedChange={toggleTodosCategoria}
                onClick={(e) => e.stopPropagation()}
                className={
                  algunos && !todosSeleccionados
                    ? "data-[state=unchecked]:bg-primary/20"
                    : ""
                }
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(categoria.id);
              }}
              className="h-5 w-5 p-0 hover:bg-white/50"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            <span className="font-medium text-sm">{categoria.nombre}</span>
            {Object.values(transaccionesDetalle).flat().length > 0 && (
              <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
                {Object.values(transaccionesDetalle).flat().length}
              </Badge>
            )}
          </div>
        </TableCell>

        {columnas.map((fecha, index) => {
          const fechaForNewTransaction = getFechaForNewTransaction(fecha);
          const disabled = isDateDisabled(
            fechaForNewTransaction,
            vista,
            diasHabilesPermitidos,
            permitirEdicionSinLimite
          );

          // Transacciones seleccionables para esta fecha
          const transaccionesDelDia = (
            transaccionesDetalle[fecha] || []
          ).filter((t) => t.id);
          const todosDelDiaSeleccionados =
            transaccionesDelDia.length > 0 &&
            transaccionesDelDia.every((t) => selectedTransacciones.has(t.id!));
          const algunosDelDia = transaccionesDelDia.some((t) =>
            selectedTransacciones.has(t.id!)
          );

          const toggleTodosDelDia = () => {
            if (todosDelDiaSeleccionados) {
              transaccionesDelDia.forEach((t) =>
                toggleTransaccionSelection(t.id!)
              );
            } else {
              transaccionesDelDia.forEach((t) => {
                if (!selectedTransacciones.has(t.id!)) {
                  toggleTransaccionSelection(t.id!, t);
                }
              });
            }
          };

          return (
            <TableCell
              key={fecha}
              className={`py-2 px-3 text-center ${disabled ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center justify-center gap-2">
                {selectionMode && transaccionesDelDia.length > 0 && (
                  <Checkbox
                    checked={todosDelDiaSeleccionados}
                    onCheckedChange={toggleTodosDelDia}
                    onClick={(e) => e.stopPropagation()}
                    className={
                      algunosDelDia && !todosDelDiaSeleccionados
                        ? "data-[state=unchecked]:bg-primary/20"
                        : ""
                    }
                  />
                )}
                <div
                  className={`font-semibold text-sm whitespace-nowrap ${
                    disabled
                      ? "text-gray-400"
                      : totalesCategoriaByDay[index] > 0
                        ? tipo === "ingreso"
                          ? "text-emerald-700"
                          : "text-rose-700"
                        : "text-muted-foreground"
                  }`}
                >
                  {formatMoney(totalesCategoriaByDay[index] || 0)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenNewTransaction(categoria, fechaForNewTransaction);
                  }}
                  disabled={disabled}
                  className={`h-5 w-5 p-0 transition-opacity ${
                    disabled
                      ? "opacity-30 cursor-not-allowed"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  title={
                    disabled
                      ? "No se pueden crear transacciones en fechas antiguas"
                      : `Agregar transacción para ${categoria.nombre}`
                  }
                >
                  <Plus className="h-2 w-2" />
                </Button>
              </div>
            </TableCell>
          );
        })}
      </TableRow>

      {/* Sub-filas de transacciones */}
      {!isCollapsed && Object.keys(transaccionesDetalle).length > 0 && (
        <TableRow className="bg-background">
          <TableCell className="py-1 px-3 text-xs text-muted-foreground border-l-2 border-muted w-[200px] sticky left-0 bg-inherit z-10">
            Transacciones
          </TableCell>
          {columnas.map((fecha) => {
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
            return (
              <TableCell
                key={fecha}
                className={`py-1 px-2 text-center align-top w-[130px] min-w-[130px] max-w-[130px] ${disabled ? "bg-gray-50" : ""}`}
              >
                <div className="space-y-0.5">
                  {transaccionesDetalle[fecha]?.map(
                    (transaccion: CashflowTransaccion) => {
                      const isLinked = false;
                      const isProyectado = transaccion.proyectado;
                      const isTransactionDisabled = isDateDisabled(
                        transaccion.fecha,
                        vista,
                        diasHabilesPermitidos,
                        permitirEdicionSinLimite
                      );
                      const isSelected = selectedTransacciones.has(
                        transaccion.id || 0
                      );

                      return (
                        <div
                          key={transaccion.id}
                          className={`p-1 text-xs border rounded ${
                            isLinked || isTransactionDisabled
                              ? "bg-muted text-muted-foreground cursor-not-allowed italic opacity-60"
                              : isProyectado
                                ? "bg-card hover:bg-accent cursor-pointer border-l-2 border-l-amber-400 bg-amber-50/30"
                                : "bg-card hover:bg-accent cursor-pointer border-l-2 border-l-green-400"
                          } ${isSelected ? "ring-2 ring-primary" : ""}`}
                          onClick={() => {
                            if (
                              selectionMode &&
                              !isTransactionDisabled &&
                              transaccion.id
                            ) {
                              toggleTransaccionSelection(
                                transaccion.id,
                                transaccion
                              );
                            } else if (!isLinked && !isTransactionDisabled) {
                              onEditTransaction(transaccion);
                            }
                          }}
                          title={
                            transaccion.descripcion
                              ? transaccion.descripcion
                              : isTransactionDisabled
                                ? "Transacción no editable (fecha antigua)"
                                : isProyectado
                                  ? "Transacción proyectada"
                                  : "Transacción confirmada"
                          }
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              {selectionMode && !isTransactionDisabled && (
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    transaccion.id &&
                                    toggleTransaccionSelection(
                                      transaccion.id,
                                      transaccion
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <div
                                  className={`truncate leading-tight ${
                                    isLinked || isTransactionDisabled
                                      ? "text-muted-foreground"
                                      : "text-foreground/80"
                                  }`}
                                >
                                  {transaccion.descripcion || "Sin descripción"}
                                </div>
                                {isProyectado && !isTransactionDisabled && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 px-1 text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-300"
                                  >
                                    P
                                  </Badge>
                                )}
                              </div>
                              <div
                                className={`font-semibold mt-0.5 flex items-center gap-1 ${
                                  isLinked || isTransactionDisabled
                                    ? "text-muted-foreground"
                                    : isProyectado
                                      ? tipo === "ingreso"
                                        ? "text-amber-600"
                                        : "text-amber-700"
                                      : tipo === "ingreso"
                                        ? "text-emerald-700"
                                        : "text-rose-700"
                                }`}
                              >
                                {formatMoney(Number(transaccion.monto) || 0)}
                                {transaccion.bancoId &&
                                  (transaccion.conciliado ? (
                                    <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <Clock className="h-3 w-3 text-amber-500 shrink-0" />
                                  ))}
                              </div>
                              {mostrarBancos && transaccion.banco?.nombre && (
                                <div className="text-[10px] text-slate-500 mt-0.5 truncate text-left">
                                  {transaccion.banco.nombre}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  ) || null}
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      )}
    </>
  );
};
