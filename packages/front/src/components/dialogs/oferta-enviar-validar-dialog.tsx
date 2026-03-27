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
import { useEnviarAValidarOfertaMutation } from "@/hooks/oferta";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type OfertaEnviarValidarDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ofertaId: number;
};

export const OfertaEnviarValidarDialog = ({
  open,
  setOpen,
  ofertaId,
}: OfertaEnviarValidarDialogProps) => {
  const { mutate: enviarAValidar, isPending } =
    useEnviarAValidarOfertaMutation();
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    if (!ofertaId) return;

    enviarAValidar(ofertaId, {
      onSuccess: () => {
        toast({
          description: "Oferta enviada a validar correctamente",
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          description: error?.message || "Error al enviar a validar",
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
          <DialogTitle>¿Está seguro que desea enviar a validar?</DialogTitle>
          <DialogDescription>
            Esta acción enviará la oferta para su validación.
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
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar a Validar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
