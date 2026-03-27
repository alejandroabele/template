"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHeader } from "@/components/ui/table";

import { CashflowTransaccionDialog } from "@/components/dialogs/cashflow-transaccion-dialog";
import { MigracionCashflowExcelDialog } from "@/components/dialogs/migracion-cashflow-excel-dialog";
import { CashflowExportarExcelDialog } from "@/components/dialogs/cashflow-exportar-excel-dialog";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useEditCashflowTransaccionMutation } from "@/hooks/cashflow-transaccion";
import { fetchConciliar } from "@/services/cashflow-transaccion";
import { DeleteDialog } from "@/components/ui/delete-dialog";

import { isDateDisabled } from "@/utils/cashflow-date";
import { Header } from "./header";
import { Columns } from "./columns";
import { Bancos } from "./bancos";
import { Agrupaciones } from "./agrupaciones";
import { CreditoDisponible } from "./credito-disponible";
import { Saldo } from "./saldo";
import { SaldoAcumulado } from "./saldo-acumulado";
import { AccionesLoteBar } from "./acciones-lote-bar";
import { CambiarFechaDialog } from "@/components/dialogs/cambiar-fecha-dialog";
import { useGetConfigByKeyQuery } from "@/hooks/config";
import { CONFIGURACIONES } from "@/constants/config";
import { useCashflowStore } from "./store";

function CashflowTableContent({ simulacionId }: { simulacionId?: number }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [migracionOpen, setMigracionOpen] = React.useState(false);
  const [exportarExcelOpen, setExportarExcelOpen] = React.useState(false);

  // Store de Zustand
  const {
    vista,
    selectedTransacciones,
    selectedTransaccionesMap,
    dialogOpen,
    changeDateDialogOpen,
    selectedCategoria,
    selectedFecha,
    editingTransaccion,
    diasHabilesPermitidos,
    permitirEdicionSinLimite,
    clearSelection,
    setDialogOpen,
    setChangeDateDialogOpen,
    openNewTransaction,
    openEmptyTransaction,
    openEditTransaction,
    setDiasHabilesPermitidos,
    setPermitirEdicionSinLimite,
    initializeFromUrl,
  } = useCashflowStore();

  // Obtener configuración de días hábiles
  const { data: configDiasHabiles } = useGetConfigByKeyQuery(
    CONFIGURACIONES.CASHFLOW_DIAS_HABILES_EDICION
  );

  // Obtener configuración de edición sin límite
  const { data: configPermitirEdicionSinLimite } = useGetConfigByKeyQuery(
    CONFIGURACIONES.CASHFLOW_PERMITIR_EDICION_SIN_LIMITE
  );

  // Inicializar store desde URL en el primer render
  React.useEffect(() => {
    const weekParam = searchParams.get("week");
    const vistaParam = searchParams.get("vista");
    initializeFromUrl(weekParam, vistaParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar store cuando cambien las configuraciones
  React.useEffect(() => {
    if (configDiasHabiles?.valor) {
      setDiasHabilesPermitidos(parseInt(configDiasHabiles.valor));
    }
  }, [configDiasHabiles, setDiasHabilesPermitidos]);

  React.useEffect(() => {
    if (configPermitirEdicionSinLimite?.valor !== undefined) {
      setPermitirEdicionSinLimite(
        configPermitirEdicionSinLimite.valor === "true"
      );
    }
  }, [configPermitirEdicionSinLimite, setPermitirEdicionSinLimite]);

  const { mutateAsync: editTransaccion } = useEditCashflowTransaccionMutation();
  const [conciliarLoteOpen, setConciliarLoteOpen] = React.useState(false);

  const conciliableIds = React.useMemo(() => {
    const ids: number[] = [];
    selectedTransaccionesMap.forEach((t, id) => {
      if (t.bancoId && !t.conciliado) ids.push(id);
    });
    return ids;
  }, [selectedTransaccionesMap]);

  const montoTotal = React.useMemo(() => {
    let total = 0;
    selectedTransaccionesMap.forEach((t) => {
      total += Number(t.monto) || 0;
    });
    return total;
  }, [selectedTransaccionesMap]);

  const handleConciliarLote = async () => {
    if (conciliableIds.length === 0) return;

    toast({
      title: "Conciliando transacciones",
      description: `Conciliando ${conciliableIds.length} transacción${conciliableIds.length > 1 ? "es" : ""}...`,
    });

    try {
      let exitosos = 0;
      let errores = 0;

      for (const id of conciliableIds) {
        try {
          await fetchConciliar(id);
          exitosos++;
        } catch {
          errores++;
        }
      }

      if (errores > 0) {
        toast({
          title: "Conciliación parcial",
          description: `${exitosos} exitosa${exitosos !== 1 ? "s" : ""}, ${errores} error${errores !== 1 ? "es" : ""}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conciliación exitosa",
          description: `Se conciliaron ${exitosos} transacción${exitosos !== 1 ? "es" : ""} correctamente`,
        });
      }

      setConciliarLoteOpen(false);
      clearSelection();
      window.location.reload();
    } catch {
      toast({
        title: "Error",
        description: "Hubo un error al conciliar las transacciones",
        variant: "destructive",
      });
    }
  };

  const handleCambiarFechaLote = async (
    nuevaFecha: string,
    categoriaId?: string
  ) => {
    const idsArray = Array.from(selectedTransacciones);

    toast({
      title: "Actualizando transacciones",
      description: `Actualizando ${idsArray.length} transacción${idsArray.length > 1 ? "es" : ""}...`,
    });

    try {
      for (const id of idsArray) {
        const updateData: Partial<CashflowTransaccion> = { fecha: nuevaFecha };

        if (categoriaId) {
          updateData.categoriaId = parseInt(categoriaId);
        }

        await editTransaccion({
          id,
          data: updateData as CashflowTransaccion,
        });
      }

      toast({
        title: "Actualización exitosa",
        description: `Se actualizaron ${idsArray.length} transacción${idsArray.length > 1 ? "es" : ""} correctamente`,
      });

      clearSelection();
      setChangeDateDialogOpen(false);

      window.location.reload();
    } catch {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar las transacciones",
        variant: "destructive",
      });
    }
  };

  const openNewTransactionDialog = (
    categoria: CashflowCategoria,
    fecha: string
  ) => {
    if (
      isDateDisabled(
        fecha,
        vista,
        diasHabilesPermitidos,
        permitirEdicionSinLimite
      )
    ) {
      toast({
        title: "Fecha no disponible",
        description: `No se pueden crear transacciones con más de ${diasHabilesPermitidos} días hábiles de antigüedad`,
        variant: "destructive",
      });
      return;
    }
    openNewTransaction(categoria, fecha);
  };

  const handleCreateTransaction = () => {
    // Abrir diálogo de nueva transacción sin estado previo
    openEmptyTransaction();
  };

  const editTransaction = (transaccion: CashflowTransaccion) => {
    if (
      isDateDisabled(
        transaccion.fecha,
        vista,
        diasHabilesPermitidos,
        permitirEdicionSinLimite
      )
    ) {
      toast({
        title: "Transacción no editable",
        description: `No se pueden editar transacciones con más de ${diasHabilesPermitidos} días hábiles de antigüedad`,
        variant: "destructive",
      });
      return;
    }
    openEditTransaction(transaccion);
  };

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <Header
        onCreateTransaction={handleCreateTransaction}
        onOpenMigration={() => setMigracionOpen(true)}
        onExportarExcel={() => setExportarExcelOpen(true)}
        simulacionId={simulacionId}
      />

      {/* Tabla principal */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-500">
            <Table className="w-auto min-w-full">
              <TableHeader>
                <Columns />
              </TableHeader>

              <TableBody>
                {/* Cada sección lee del store y hace sus propias queries */}
                {!simulacionId && <Bancos />}
                <Agrupaciones
                  onOpenNewTransaction={openNewTransactionDialog}
                  onEditTransaction={editTransaction}
                  simulacionId={simulacionId}
                />
                {!simulacionId && <CreditoDisponible />}
                <Saldo simulacionId={simulacionId} />
                <SaldoAcumulado simulacionId={simulacionId} />
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Barra de acciones para selección múltiple */}
      <AccionesLoteBar
        cantidadSeleccionadas={selectedTransacciones.size}
        cantidadConciliables={conciliableIds.length}
        montoTotal={montoTotal}
        onCambiarFecha={() => setChangeDateDialogOpen(true)}
        onConciliar={() => setConciliarLoteOpen(true)}
        onCancelar={clearSelection}
        simulacionId={simulacionId}
      />

      {/* Diálogo para editar transacción individual */}
      <CashflowTransaccionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        transaccion={editingTransaccion}
        categoria={selectedCategoria}
        fecha={selectedFecha}
        simulacionId={simulacionId}
      />

      {/* Diálogo para cambiar fecha en lote */}
      <CambiarFechaDialog
        open={changeDateDialogOpen}
        setOpen={setChangeDateDialogOpen}
        cantidadTransacciones={selectedTransacciones.size}
        onConfirm={handleCambiarFechaLote}
      />

      {/* Diálogo de confirmación para conciliar en lote */}
      <DeleteDialog
        open={conciliarLoteOpen}
        onClose={() => setConciliarLoteOpen(false)}
        onDelete={handleConciliarLote}
        message={`¿Está seguro que desea conciliar ${conciliableIds.length} transacción${conciliableIds.length !== 1 ? "es" : ""} con sus bancos asociados?`}
      />

      {/* Diálogo para migrar transacciones desde Excel */}
      <MigracionCashflowExcelDialog
        open={migracionOpen}
        onClose={() => setMigracionOpen(false)}
      />

      {/* Diálogo para exportar cashflow a Excel */}
      <CashflowExportarExcelDialog
        open={exportarExcelOpen}
        onOpenChange={setExportarExcelOpen}
      />
    </div>
  );
}

export default function CashflowTable({ simulacionId }: { simulacionId?: number } = {}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando cashflow...</div>
          </div>
        </div>
      }
    >
      <CashflowTableContent simulacionId={simulacionId} />
    </Suspense>
  );
}
