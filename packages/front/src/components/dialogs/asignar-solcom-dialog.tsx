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
import { useAsignarSolcomMutation } from "@/hooks/solcom";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import type { Solcom } from "@/types";
import { useStore as useGlobalStore } from "@/lib/store";

type AsignarSolcomDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  solcom: Solcom;
};

export const AsignarSolcomDialog = ({
  open,
  setOpen,
  solcom,
}: AsignarSolcomDialogProps) => {
  const { mutate: asignarSolcom, isPending } = useAsignarSolcomMutation();
  const { toast } = useToast();
  const router = useRouter();
  const user = useGlobalStore((state) => state.user);

  const handleConfirm = () => {
    if (!solcom?.id) return;

    asignarSolcom(solcom.id, {
      onSuccess: () => {
        toast({
          description: `SOLCOM #${solcom.id} asignada exitosamente`,
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          description: error?.message || "Error al asignar la SOLCOM",
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
            <UserPlus className="h-5 w-5 text-blue-600" />
            Tomar SOLCOM
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea asignarse esta SOLCOM?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            Al tomar esta solicitud de compra, usted ({user?.nombre}) quedará
            asignado como comprador responsable de gestionar esta SOLCOM.
          </p>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              SOLCOM #{solcom.id}
            </p>
            {solcom.descripcion && (
              <p className="text-sm text-gray-600 mt-1">{solcom.descripcion}</p>
            )}
          </div>

          {solcom.presupuesto && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Presupuesto: {solcom.presupuesto.nombre}
              </p>
            </div>
          )}

          {solcom.centro && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
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
                Asignando...
              </>
            ) : (
              "Confirmar Asignación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
