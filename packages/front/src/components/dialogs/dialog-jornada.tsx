"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Jornada } from "@/types";
import JornadaForm from "@/components/forms/jornada-form";

interface DialogJornadaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presupuestoId?: number;
  selectedDate?: Date;
  jornada?: Jornada;
}

export function DialogJornada({
  open,
  onOpenChange,
  presupuestoId,
  selectedDate,
  jornada,
}: DialogJornadaProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <JornadaForm
          jornada={jornada}
          presupuestoId={presupuestoId}
          selectedDate={selectedDate}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
