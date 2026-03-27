"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { NuevaOtMantenimientoForm } from "@/components/forms/nueva-ot-mantenimiento-form";

type NuevaOtMantenimientoDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  alquilerRecursoId: number;
  codigoRecurso?: string;
};

export function NuevaOtMantenimientoDialog({
  open,
  setOpen,
  alquilerRecursoId,
  codigoRecurso,
}: NuevaOtMantenimientoDialogProps) {
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Nueva OT de Mantenimiento</DialogTitle>
          <DialogDescription>
            Seleccioná el tipo y las tareas a realizar
          </DialogDescription>
        </DialogHeader>
        <NuevaOtMantenimientoForm
          alquilerRecursoId={alquilerRecursoId}
          codigoRecurso={codigoRecurso}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
