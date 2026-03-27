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
import { useFinalizarSolcomMutation } from "@/hooks/solcom";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Solcom } from "@/types";

type FinalizarSolcomDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  solcom: Solcom;
};

export const FinalizarSolcomDialog = ({
  open,
  setOpen,
  solcom,
}: FinalizarSolcomDialogProps) => {
  const { mutate: finalizarSolcom, isPending } = useFinalizarSolcomMutation();
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    if (!solcom?.id) return;

    finalizarSolcom(solcom.id, {
      onSuccess: () => {
        toast({
          description: `SOLCOM #${solcom.id} finalizada exitosamente`,
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          description: error?.message || "Error al finalizar la SOLCOM",
          variant: "destructive",
        });
      },
    });
  };

  if (!solcom) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-md pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Finalizar SOLCOM
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea finalizar la SOLCOM #{solcom.id}?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            Al finalizar esta solicitud de compra, su estado cambiará a
            "Finalizada" y no podrá ser modificada posteriormente.
          </p>

          {solcom.presupuesto && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Presupuesto: {solcom.presupuesto.nombre}
              </p>
            </div>
          )}

          {solcom.centro && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Centro de Costo: {solcom.centro.nombre}
              </p>
            </div>
          )}
        </div>

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
                Finalizando...
              </>
            ) : (
              "Confirmar Finalización"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
