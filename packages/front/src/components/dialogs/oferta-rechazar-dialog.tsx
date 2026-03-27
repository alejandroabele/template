import type { Dispatch, SetStateAction } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRechazarOfertaMutation } from "@/hooks/oferta";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OfertaRechazarDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ofertaId: number;
};

export const OfertaRechazarDialog = ({
  open,
  setOpen,
  ofertaId,
}: OfertaRechazarDialogProps) => {
  const { mutate: rechazarOferta, isPending } = useRechazarOfertaMutation();
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    if (!ofertaId) return;

    rechazarOferta(ofertaId, {
      onSuccess: () => {
        toast({
          description: "Oferta rechazada correctamente",
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          description: error?.message || "Error al rechazar el presupuesto",
          variant: "destructive",
        });
      },
    });
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
          <DialogTitle>¿Está seguro que desea rechazar?</DialogTitle>
          <DialogDescription>
            Esta acción rechazará el presupuesto y cambiará su estado.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              "Rechazar presupuesto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
