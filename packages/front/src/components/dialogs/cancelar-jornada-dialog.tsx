"use client";

import { useState } from "react";
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
import { useCancelarJornadaMutation } from "@/hooks/jornada";
import { useToast } from "@/hooks/use-toast";

interface CancelarJornadaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jornadaId?: number;
  onSuccess?: () => void;
}

export function CancelarJornadaDialog({
  open,
  onOpenChange,
  jornadaId,
  onSuccess,
}: CancelarJornadaDialogProps) {
  const [motivo, setMotivo] = useState("");
  const { toast } = useToast();
  const { mutateAsync: cancelarJornada, isPending } =
    useCancelarJornadaMutation();

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      toast({
        description: "Debe indicar el motivo de la cancelación",
        variant: "destructive",
      });
      return;
    }

    if (!jornadaId) {
      toast({
        description: "No se pudo identificar la jornada",
        variant: "destructive",
      });
      return;
    }

    try {
      await cancelarJornada({ id: jornadaId, motivo });
      toast({
        description: "Jornada cancelada exitosamente",
        variant: "default",
      });
      setMotivo("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error("Error al cancelar jornada:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al cancelar la jornada";
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      setMotivo("");
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancelar Jornada</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea cancelar la jornada? Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <Label htmlFor="motivo">Motivo de cancelación *</Label>
          <Textarea
            id="motivo"
            placeholder="Indique el motivo de la cancelación..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="min-h-[100px]"
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Volver
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || !motivo.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Confirmar Cancelación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
