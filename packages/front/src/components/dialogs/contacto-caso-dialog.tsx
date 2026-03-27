"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactoCasoForm from "@/components/forms/contacto-caso-form";
import { ContactoCaso } from "@/types";

interface ContactoCasoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: ContactoCaso | null;
}

export function ContactoCasoDialog({
  open,
  setOpen,
  data,
}: ContactoCasoDialogProps) {
  const dialogTitle = data ? "Editar Caso de Contacto" : "Nuevo Caso de Contacto";

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <ContactoCasoForm
          data={data}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
