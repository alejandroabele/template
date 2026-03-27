import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Plus,
  FileSpreadsheet,
  Download,
} from "lucide-react";

import { format, getISOWeekYear, getISOWeek } from "date-fns";
import { es } from "date-fns/locale";
import { useCashflowStore, type Vista } from "./store";
import { TransaccionBusqueda } from "./transaccion-busqueda";

interface HeaderProps {
  onCreateTransaction?: () => void;
  onOpenMigration?: () => void;
  onExportarExcel?: () => void;
  simulacionId?: number;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTransaction, onOpenMigration, onExportarExcel, simulacionId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Store de Zustand con navegación integrada
  const {
    vista,
    setVista,
    weekStart,
    weekEnd,
    monthStart,
    currentWeek,
    currentYear,
    selectionMode,
    setSelectionMode,
    mostrarBancos,
    setMostrarBancos,
    setDialogOpen,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToPreviousYear,
    goToNextYear,
    goToCurrentYear,
  } = useCashflowStore();

  // Función para actualizar URL con semana
  const updateWeekInUrl = (date: Date) => {
    const year = getISOWeekYear(date);
    const week = getISOWeek(date);
    const weekParam = `${year}-W${week.toString().padStart(2, "0")}`;

    const params = new URLSearchParams(searchParams.toString());
    params.set("week", weekParam);

    router.push(`?${params.toString()}`);
  };

  // Función para actualizar URL con vista
  const updateVistaInUrl = (newVista: Vista) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vista", newVista);
    router.push(`?${params.toString()}`);
  };

  const getTitulo = () => {
    switch (vista) {
      case "semanal":
        return `Sem. ${format(weekStart, "dd", { locale: es })}-${format(weekEnd, "dd/MM", { locale: es })}`;
      case "semanal-mes":
        return format(currentWeek, "MMM yyyy", { locale: es });
      case "mensual":
        return format(monthStart, "MMM yyyy", { locale: es });
      case "trimestral":
        return `${currentYear}`;
    }
  };

  const getNavegacion = () => {
    if (vista === "semanal") {
      return {
        onPrevious: () => goToPreviousWeek(updateWeekInUrl),
        onNext: () => goToNextWeek(updateWeekInUrl),
        onToday: () => goToCurrentWeek(updateWeekInUrl),
      };
    } else if (vista === "mensual" || vista === "semanal-mes") {
      return {
        onPrevious: () => goToPreviousMonth(updateWeekInUrl),
        onNext: () => goToNextMonth(updateWeekInUrl),
        onToday: () => goToCurrentMonth(updateWeekInUrl),
      };
    } else {
      return {
        onPrevious: () => goToPreviousYear(updateWeekInUrl),
        onNext: () => goToNextYear(updateWeekInUrl),
        onToday: () => goToCurrentYear(updateWeekInUrl),
      };
    }
  };

  const { onPrevious, onNext, onToday } = getNavegacion();

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
  };

  const handleCreateTransaction = () => {
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            {getTitulo()}
          </CardTitle>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Selector de vista */}
            <ButtonGroup>
              <Button
                variant={vista === "semanal" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVista("semanal", updateVistaInUrl)}
              >
                Diaria
              </Button>
              <Button
                variant={vista === "semanal-mes" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVista("semanal-mes", updateVistaInUrl)}
              >
                Semanal
              </Button>
              <Button
                variant={vista === "mensual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVista("mensual", updateVistaInUrl)}
              >
                Mensual
              </Button>
              <Button
                variant={vista === "trimestral" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVista("trimestral", updateVistaInUrl)}
              >
                Trimestral
              </Button>
            </ButtonGroup>

            {/* Navegación */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={onToday}>
                Hoy
              </Button>
              <Button variant="outline" onClick={onNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Checkbox de mostrar bancos */}
            <div className="flex items-center gap-2 border rounded-md px-3 h-10">
              <Checkbox
                id="mostrar-bancos"
                checked={mostrarBancos}
                onCheckedChange={(checked) => setMostrarBancos(!!checked)}
              />
              <Label
                htmlFor="mostrar-bancos"
                className="text-sm font-medium cursor-pointer select-none"
              >
                B
              </Label>
            </div>

            {/* Botón de exportar a Excel — solo en modo real */}
            {!simulacionId && (
              <Button
                variant="outline"
                size="icon"
                onClick={onExportarExcel}
                title="Exportar cashflow a Excel"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {/* Botón de migrar desde Excel — solo en modo real */}
            {!simulacionId && (
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenMigration}
                title="Migrar transacciones desde Excel"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            )}

            {/* Botón de crear transacción */}
            <Button
              variant="outline"
              size="icon"
              onClick={onCreateTransaction || handleCreateTransaction}
              title="Crear nueva transacción"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Botón de selección múltiple */}
            <Button
              variant={selectionMode ? "default" : "outline"}
              size="icon"
              onClick={toggleSelectionMode}
              title={
                selectionMode ? "Cancelar selección" : "Seleccionar múltiples"
              }
            >
              <CheckSquare className="h-4 w-4" />
            </Button>

            {/* Buscador de transacciones */}
            <TransaccionBusqueda simulacionId={simulacionId} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
