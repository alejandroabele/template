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
import { useToast } from "@/hooks/use-toast";
import { useEditOrdenCompraItemMutation } from "@/hooks/orden-compra";

interface EditarDescripcionOrdenCompraItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemId?: number;
  descripcionActual?: string;
  nombreProducto?: string;
  onSuccess?: () => void;
}

export function EditarDescripcionOrdenCompraItemDialog({
  open,
  setOpen,
  itemId,
  descripcionActual = "",
  nombreProducto = "",
  onSuccess,
}: EditarDescripcionOrdenCompraItemDialogProps) {
  const [descripcion, setDescripcion] = useState(descripcionActual);
  const { toast } = useToast();
  const { mutateAsync: editItem, isPending } = useEditOrdenCompraItemMutation();

  useEffect(() => {
    if (open) {
      setDescripcion(descripcionActual || "");
    }
  }, [open, descripcionActual]);

  const handleConfirm = async () => {
    if (!itemId) {
      toast({
        description: "No se pudo identificar el item",
        variant: "destructive",
      });
      return;
    }

    try {
      await editItem({ id: itemId, data: { descripcion } });
      toast({
        description: "Descripción actualizada exitosamente",
        variant: "default",
      });
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error("Error al actualizar descripción:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar la descripción";
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
            Modificar las observaciones del producto:{" "}
            <span className="font-semibold">{nombreProducto}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <Label htmlFor="descripcion">Observaciones</Label>
          <Textarea
            id="descripcion"
            placeholder="Ingrese las observaciones del producto..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
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
