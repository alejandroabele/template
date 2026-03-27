"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEditOrdenCompraMutation } from "@/hooks/orden-compra";
import { useToast } from "@/hooks/use-toast";

interface EditarObservacionesOrdenCompraDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ordenCompraId?: number;
  observacionesActuales?: string;
  onSuccess?: () => void;
}

export function EditarObservacionesOrdenCompraDialog({
  open,
  setOpen,
  ordenCompraId,
  observacionesActuales = "",
  onSuccess,
}: EditarObservacionesOrdenCompraDialogProps) {
  const [observaciones, setObservaciones] = useState(observacionesActuales);
  const { toast } = useToast();
  const { mutateAsync: editarOrdenCompra, isPending } =
    useEditOrdenCompraMutation();

  useEffect(() => {
    if (open) {
      setObservaciones(observacionesActuales || "");
    }
  }, [open, observacionesActuales]);

  const handleConfirm = async () => {
    if (!ordenCompraId) {
      toast({
        description: "No se pudo identificar la orden de compra",
        variant: "destructive",
      });
      return;
    }

    try {
      await editarOrdenCompra({
        id: ordenCompraId,
        data: { obs: observaciones },
      });
      toast({
        description: "Observaciones actualizadas exitosamente",
        variant: "default",
      });
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error("Error al actualizar observaciones:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar las observaciones";
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Observaciones</DialogTitle>
          <DialogDescription>
            Modificar las observaciones de la orden de compra #{ordenCompraId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            placeholder="Ingrese las observaciones..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="min-h-[150px]"
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
