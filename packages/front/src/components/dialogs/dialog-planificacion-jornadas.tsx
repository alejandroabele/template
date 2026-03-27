"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanificacionJornadasForm } from "@/components/forms/jornada-form";

interface DialogPlanificacionJornadasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presupuestoId?: number;
}

export function DialogPlanificacionJornadas({
  open,
  onOpenChange,
  presupuestoId,
}: DialogPlanificacionJornadasProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Planificación</DialogTitle>
        </DialogHeader>

        <PlanificacionJornadasForm
          presupuestoId={presupuestoId}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
