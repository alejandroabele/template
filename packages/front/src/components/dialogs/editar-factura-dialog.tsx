import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FacturaForm from "@/components/forms/factura-form";
import type { Factura } from "@/types";

type EditarFacturaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  factura: Factura;
};

export const EditarFacturaDialog = ({
  open,
  setOpen,
  factura,
}: EditarFacturaDialogProps) => {
  if (!open) return null;

  if (!factura || !factura.modelo || !factura.modeloId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Factura {factura.folio || `#${factura.id}`}</DialogTitle>
        </DialogHeader>

        <FacturaForm
          data={factura}
          setOpen={setOpen}
          modelo={factura.modelo as "presupuesto" | "alquiler"}
          modeloId={factura.modeloId}
        />
      </DialogContent>
    </Dialog>
  );
};
