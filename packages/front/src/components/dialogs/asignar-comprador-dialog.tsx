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
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import { useStore as useGlobalStore } from "@/lib/store";
import { solcomService } from "@/services/solcom";
import { useState } from "react";

type AsignarCompradorDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: "items" | "solcoms";
  itemIds?: number[];
  solcomIds?: number[];
  onSuccess?: () => void;
};

export const AsignarCompradorDialog = ({
  open,
  setOpen,
  mode,
  itemIds = [],
  solcomIds = [],
  onSuccess,
}: AsignarCompradorDialogProps) => {
  const { toast } = useToast();
  const user = useGlobalStore((state) => state.user);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsAssigning(true);

      if (mode === "items" && itemIds.length > 0) {
        // Asignar items específicos
        await solcomService.asignarItems(itemIds);
        toast({
          description: `Se asignaron ${itemIds.length} item(s) correctamente`,
          variant: "default",
        });
      } else if (mode === "solcoms" && solcomIds.length > 0) {
        // Asignar todas las SOLCOMs (y sus items)
        await Promise.all(solcomIds.map((id) => solcomService.asignar(id)));
        toast({
          description: `Se asignaron ${solcomIds.length} SOLCOM(s) correctamente`,
          variant: "default",
        });
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        description: error?.message || "Error al asignar",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const count = mode === "items" ? itemIds.length : solcomIds.length;
  const entityName = mode === "items" ? "item(s)" : "SOLCOM(s)";

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
            Asignarme como Comprador
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea asignarse {count} {entityName}?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            Al tomar {mode === "items" ? "estos items" : "estas solicitudes"},{" "}
            usted ({user?.nombre}) quedará asignado como comprador responsable
            {mode === "solcoms" &&
              " de todos los items de las SOLCOMs seleccionadas"}
            .
          </p>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              Total a asignar: {count} {entityName}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isAssigning}>
            {isAssigning ? (
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
