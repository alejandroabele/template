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
import { useCancelarOrdenCompraMutation } from "@/hooks/orden-compra";
import { useToast } from "@/hooks/use-toast";
import { Loader2, XCircle } from "lucide-react";

type CancelarOrdenCompraDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ordenCompraId: number;
  onSuccess?: () => void;
};

export const CancelarOrdenCompraDialog = ({
  open,
  setOpen,
  ordenCompraId,
  onSuccess,
}: CancelarOrdenCompraDialogProps) => {
  const { mutateAsync: cancelarOrdenCompra, isPending } =
    useCancelarOrdenCompraMutation();
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!ordenCompraId) return;

    try {
      await cancelarOrdenCompra(ordenCompraId);
      toast({
        description: `Orden de compra #${ordenCompraId} cancelada exitosamente`,
        variant: "default",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        description: (error as Error)?.message || "Error al cancelar la orden de compra",
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
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Cancelar Orden de Compra
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea cancelar la orden de compra #{ordenCompraId}?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            Al cancelar esta orden de compra, su estado cambiará a &ldquo;Cancelada&rdquo; y
            no podrá descargar el PDF ni realizar ingresos de mercadería.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Aceptar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
