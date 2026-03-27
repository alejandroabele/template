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
import { useModificarEstadoSolcomMutation } from "@/hooks/solcom";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Edit3 } from "lucide-react";
import type { Solcom } from "@/types";
import { useGetEstadoComprasQuery } from "@/hooks/estado-compras";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type ModificarEstadoSolcomDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  solcom: Solcom;
};

export const ModificarEstadoSolcomDialog = ({
  open,
  setOpen,
  solcom,
}: ModificarEstadoSolcomDialogProps) => {
  const { mutate: modificarEstado, isPending } =
    useModificarEstadoSolcomMutation();
  const { toast } = useToast();
  const router = useRouter();

  const [nuevoEstadoId, setNuevoEstadoId] = useState<number | undefined>(
    solcom.estadoId
  );

  // Obtener estados de tipo SOLCOM
  const { data: estados } = useGetEstadoComprasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [{ id: "tipo", value: "SOLCOM" }],
    globalFilter: "",
    sorting: [],
  });

  const handleConfirm = () => {
    if (!solcom?.id || !nuevoEstadoId) return;

    modificarEstado(
      { id: solcom.id, estadoId: nuevoEstadoId },
      {
        onSuccess: () => {
          toast({
            description: `Estado de SOLCOM #${solcom.id} modificado exitosamente`,
            variant: "default",
          });
          setOpen(false);
          router.refresh();
        },
        onError: (error: any) => {
          toast({
            description: error?.message || "Error al modificar el estado",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!solcom) return null;

  const estadoActual = estados?.find((e) => e.id === solcom.estadoId);
  const nuevoEstado = estados?.find((e) => e.id === nuevoEstadoId);

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
            <Edit3 className="h-5 w-5 text-blue-600" />
            Modificar Estado de SOLCOM
          </DialogTitle>
          <DialogDescription>
            Cambia el estado de la SOLCOM #{solcom.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">
              SOLCOM #{solcom.id}
            </p>
            {solcom.descripcion && (
              <p className="text-sm text-gray-600">{solcom.descripcion}</p>
            )}
          </div>

          {estadoActual && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Estado Actual
              </label>
              <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
                <Badge variant="outline" className="text-xs">
                  {estadoActual.codigo}
                </Badge>
                <span className="text-sm">{estadoActual.nombre}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nuevo Estado <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value) => setNuevoEstadoId(parseInt(value))}
              value={nuevoEstadoId?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {estados?.map((estado) => (
                  <SelectItem key={estado.id} value={estado.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {estado.codigo}
                      </Badge>
                      <span>{estado.nombre}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {nuevoEstado && nuevoEstado.id !== estadoActual?.id && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                El estado cambiará de{" "}
                <span className="font-semibold">{estadoActual?.nombre}</span> a{" "}
                <span className="font-semibold">{nuevoEstado.nombre}</span>
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
          <Button
            onClick={handleConfirm}
            disabled={isPending || !nuevoEstadoId || nuevoEstadoId === solcom.estadoId}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Modificando...
              </>
            ) : (
              "Confirmar Cambio"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
