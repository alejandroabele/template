"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CashflowCategoria, CashflowTransaccion } from "@/types";
import CashflowTransaccionForm from "@/components/forms/cashflow-transaccion-form";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface CashflowTransaccionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoria?: CashflowCategoria | null;
  fecha?: string;
  transaccion?: CashflowTransaccion | null;
  simulacionId?: number;
}

export function CashflowTransaccionDialog({
  open,
  setOpen,
  categoria,
  fecha,
  transaccion,
  simulacionId,
}: CashflowTransaccionDialogProps) {
  const dialogTitle = transaccion ? "Editar Transacción" : "Nueva Transacción";
  const currentCategoria = transaccion?.categoria || categoria;
  const currentFecha = transaccion?.fecha || fecha;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>
            {currentCategoria && currentFecha && (
              <>
                Categoría: <strong>{currentCategoria.nombre}</strong> - Fecha:{" "}
                <strong>
                  {format(parseISO(currentFecha), "dd MMMM yyyy", {
                    locale: es,
                  })}
                </strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <CashflowTransaccionForm
          data={transaccion}
          categoria={categoria}
          fecha={fecha}
          setOpen={setOpen}
          simulacionId={simulacionId}
        />
      </DialogContent>
    </Dialog>
  );
}
