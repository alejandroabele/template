import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText } from "lucide-react";
import type { Solcom } from "@/types";
import { useGenerarPdfSolcomMutation } from "@/hooks/solcom";

type GenerarPdfSolcomDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  solcom: Solcom;
};

export const GenerarPdfSolcomDialog = ({
  open,
  setOpen,
  solcom,
}: GenerarPdfSolcomDialogProps) => {
  const [descripcionPdf, setDescripcionPdf] = useState("");
  const { mutate: generarPdf, isPending } = useGenerarPdfSolcomMutation();
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!solcom?.id) return;

    generarPdf(
      { id: solcom.id, descripcionPdf },
      {
        onSuccess: () => {
          toast({
            description: `PDF de SOLCOM #${solcom.id} generado exitosamente`,
            variant: "default",
          });
          setOpen(false);
          setDescripcionPdf("");
        },
        onError: (error: any) => {
          toast({
            description: error?.message || "Error al generar el PDF",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!solcom) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-2xl pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Generar PDF de SOLCOM
          </DialogTitle>
          <DialogDescription>
            Ingrese la descripción que se mostrará en el cuerpo del PDF de la
            SOLCOM #{solcom.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Descripción para el PDF
            </label>
            <Textarea
              placeholder="Ingrese el texto que aparecerá en el cuerpo del documento PDF..."
              className="resize-none min-h-[200px]"
              value={descripcionPdf}
              onChange={(e) => setDescripcionPdf(e.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-2">
              Este texto aparecerá en el cuerpo del documento junto con los
              items de la solicitud de compra.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setDescripcionPdf("");
            }}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            Generar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
