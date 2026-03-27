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
import { useCreateOrdenCompraMutation } from "@/hooks/orden-compra";
import { useGetOfertaAprobacionByOferta } from "@/hooks/oferta-aprobacion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import type { Oferta } from "@/types";
import { OrdenCompraForm } from "@/components/forms/orden-compra-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ConfirmarOrdenCompraDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  oferta: Oferta;
};

export const ConfirmarOrdenCompraDialog = ({
  open,
  setOpen,
  oferta,
}: ConfirmarOrdenCompraDialogProps) => {
  const { mutate: createOrdenCompra, isPending } =
    useCreateOrdenCompraMutation();
  const { data: aprobaciones, isLoading: isLoadingAprobaciones } =
    useGetOfertaAprobacionByOferta(oferta?.id);
  const { toast } = useToast();
  const router = useRouter();

  // Validar todas las aprobaciones
  const validarAprobaciones = (): {
    valido: boolean;
    aprobacionesProblematicas: string[];
    tieneRechazadas: boolean;
  } => {
    if (!aprobaciones || aprobaciones.length === 0) {
      return { valido: true, aprobacionesProblematicas: [], tieneRechazadas: false };
    }

    const aprobacionesProblematicas: string[] = [];
    let tieneRechazadas = false;

    aprobaciones.forEach((aprobacion) => {
      if (aprobacion.estado === "PENDIENTE") {
        aprobacionesProblematicas.push(
          `${aprobacion.ofertaAprobacionTipo?.nombre || "Aprobación sin nombre"} (Pendiente)`
        );
      } else if (aprobacion.estado === "RECHAZADO") {
        tieneRechazadas = true;
        aprobacionesProblematicas.push(
          `${aprobacion.ofertaAprobacionTipo?.nombre || "Aprobación sin nombre"} (Rechazada)`
        );
      }
    });

    return {
      valido: aprobacionesProblematicas.length === 0,
      aprobacionesProblematicas,
      tieneRechazadas,
    };
  };

  const { valido: aprobacionesValidas, aprobacionesProblematicas, tieneRechazadas } =
    validarAprobaciones();

  const handleConfirm = () => {
    if (!oferta?.id) return;

    if (!aprobacionesValidas) {
      const mensaje = tieneRechazadas
        ? "No se puede crear la orden de compra porque hay aprobaciones rechazadas"
        : "Todas las aprobaciones deben estar completas antes de crear la orden de compra";

      toast({
        description: mensaje,
        variant: "destructive",
      });
      return;
    }

    createOrdenCompra(oferta.id, {
      onSuccess: (ordenCompra) => {
        toast({
          description: `Orden de compra #${ordenCompra.id} creada exitosamente`,
          variant: "default",
        });
        setOpen(false);
        router.push(`/orden-compra/${ordenCompra.id}`);
      },
      onError: (error: any) => {
        toast({
          description: error?.message || "Error al crear la orden de compra",
          variant: "destructive",
        });
      },
    });
  };

  if (!oferta) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirmar Orden de Compra</DialogTitle>
          <DialogDescription>
            Revise los datos de la oferta antes de generar la orden de compra
          </DialogDescription>
        </DialogHeader>

        {!aprobacionesValidas && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {tieneRechazadas ? "Aprobaciones rechazadas" : "Aprobaciones pendientes"}
            </AlertTitle>
            <AlertDescription>
              {tieneRechazadas
                ? "No se puede crear la orden de compra porque hay aprobaciones rechazadas:"
                : "Las siguientes aprobaciones deben ser completadas antes de crear la orden de compra:"}
              <ul className="list-disc list-inside mt-2">
                {aprobacionesProblematicas.map((aprobacion, index) => (
                  <li key={index}>{aprobacion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <OrdenCompraForm data={oferta} mode="oferta" />

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
            disabled={isPending || !aprobacionesValidas || isLoadingAprobaciones}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Confirmar Orden de Compra"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
