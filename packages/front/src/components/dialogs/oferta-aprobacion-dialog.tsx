import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
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
import {
  useAprobarOfertaAprobacionMutation,
  useRechazarOfertaAprobacionMutation,
} from "@/hooks/oferta-aprobacion";
import { useToast } from "@/hooks/use-toast";
import type { OfertaAprobacion } from "@/types";

type OfertaAprobacionDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  aprobacion: OfertaAprobacion | null;
  accion: "aprobar" | "rechazar" | null;
  motivo: string;
  setMotivo: Dispatch<SetStateAction<string>>;
};

export const OfertaAprobacionDialog = ({
  open,
  setOpen,
  aprobacion,
  accion,
  motivo,
  setMotivo,
}: OfertaAprobacionDialogProps) => {
  const { toast } = useToast();
  const { mutateAsync: aprobar, isPending: isPendingAprobar } =
    useAprobarOfertaAprobacionMutation();
  const { mutateAsync: rechazar, isPending: isPendingRechazar } =
    useRechazarOfertaAprobacionMutation();

  const handleSubmit = async () => {
    if (!aprobacion) return;

    try {
      if (accion === "aprobar") {
        await aprobar({
          id: aprobacion.id,
          motivo: motivo || undefined,
        });
        toast({
          description: "Aprobación registrada exitosamente",
          variant: "default",
        });
      } else if (accion === "rechazar") {
        if (!motivo.trim()) {
          toast({
            description: "Debes ingresar un motivo para rechazar",
            variant: "destructive",
          });
          return;
        }
        await rechazar({ id: aprobacion.id, motivo });
        toast({
          description: "Rechazo registrado exitosamente",
          variant: "default",
        });
      }
      setOpen(false);
      setMotivo("");
    } catch (error) {
      console.error("Error al procesar aprobación", error);
      toast({
        description: "Error al procesar la aprobación",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-md pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {accion === "aprobar"
              ? "¿Está seguro que desea aprobar?"
              : "¿Está seguro que desea rechazar?"}
          </DialogTitle>
          <DialogDescription>
            {aprobacion?.ofertaAprobacionTipo?.nombre}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            id="motivo"
            placeholder="Motivo (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPendingAprobar || isPendingRechazar}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPendingAprobar || isPendingRechazar}
          >
            {isPendingAprobar || isPendingRechazar ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {accion === "aprobar" ? "Aprobando..." : "Rechazando..."}
              </>
            ) : accion === "aprobar" ? (
              "Aprobar"
            ) : (
              "Rechazar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
