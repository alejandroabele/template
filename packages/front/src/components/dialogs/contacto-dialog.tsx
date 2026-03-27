"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactoForm from "@/components/forms/contacto-form";
import ContactoProximoForm from "@/components/forms/contacto-proximo-form";
import { Contacto, ContactoProximo } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateContactoProximoMutation } from "@/hooks/contacto-proximo";
import { useStore as useGlobalStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ContactoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  casoId: number;
  data?: Contacto | null;
}

export function ContactoDialog({
  open,
  setOpen,
  casoId,
  data,
}: ContactoDialogProps) {
  const dialogTitle = data ? "Editar Contacto" : "Registrar Contacto";
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const { toast } = useToast();
  const user = useGlobalStore((state) => state.user);

  // Sincronizar step con URL
  useEffect(() => {
    const urlStep = searchParams.get("contactoStep");
    if (urlStep === "2" && open) {
      setStep(2);
    } else if (!urlStep && open) {
      setStep(1);
    }
  }, [searchParams, open]);

  const {
    mutateAsync: createProximoContacto,
    isPending: isPendingCreateProximo,
  } = useCreateContactoProximoMutation();

  const handleContactoSuccess = () => {
    toast({
      description: "Contacto registrado exitosamente",
      variant: "default",
    });
    // Ir al paso 2
    const url = new URL(window.location.href);
    url.searchParams.set("contactoStep", "2");
    window.history.pushState({}, "", url);
    setStep(2);
  };

  const handleSaltearContacto = () => {
    // Ir directamente al paso 2
    const url = new URL(window.location.href);
    url.searchParams.set("contactoStep", "2");
    window.history.pushState({}, "", url);
    setStep(2);
  };

  const handleGuardarProximo = async (values: {
    proximoTipoId: number;
    proximaFecha: string;
    proximaNota?: string;
  }) => {
    try {
      if (!user?.userId) {
        toast({
          description: "Error: usuario no identificado",
          variant: "destructive",
        });
        return;
      }

      const payload: Partial<ContactoProximo> = {
        casoId,
        tipoId: values.proximoTipoId,
        fecha: values.proximaFecha,
        nota: values.proximaNota || "",
        vendedorId: user.userId,
      };

      await createProximoContacto(payload as ContactoProximo);

      toast({
        description: "Próximo contacto programado exitosamente",
        variant: "default",
      });
      resetAndClose();
    } catch (error) {
      console.error("Error al registrar próximo contacto", error);
      toast({
        description: "Error al registrar el próximo contacto",
        variant: "destructive",
      });
    }
  };

  const handleSaltearProximo = () => {
    resetAndClose();
  };

  const resetAndClose = () => {
    setOpen(false);
    setStep(1);
    // Limpiar el query param de la URL
    const url = new URL(window.location.href);
    url.searchParams.delete("contactoStep");
    window.history.pushState({}, "", url);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose} modal={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
        </DialogHeader>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-2 my-4">
          <div
            className={`h-2 w-20 rounded-full transition-colors ${
              step === 1 ? "bg-primary" : "bg-green-500"
            }`}
          />
          <div
            className={`h-2 w-20 rounded-full transition-colors ${
              step === 2 ? "bg-primary" : "bg-gray-200"
            }`}
          />
        </div>

        <div className="my-4 px-2">
          {step === 1 && (
            <div className="space-y-6">
              <ContactoForm
                data={data ?? undefined}
                casoId={casoId}
                showActions={false}
                onSuccess={handleContactoSuccess}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaltearContacto}
                  className="flex-1 text-lg py-6"
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Saltear
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    const form = document.querySelector('#contacto-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }}
                  className="flex-1 text-lg py-6"
                >
                  Guardar
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Programar Próximo Contacto (Opcional)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Si querés programar cuándo volver a contactar a este cliente,
                  completá los datos. Si no, hacé click en &quot;Saltear&quot;.
                </p>
              </div>

              <ContactoProximoForm
                showActions={false}
                isLoading={isPendingCreateProximo}
                onSubmit={handleGuardarProximo}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaltearProximo}
                  disabled={isPendingCreateProximo}
                  className="flex-1 text-lg py-6"
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Saltear
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    const form = document.querySelector('#contacto-proximo-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }}
                  disabled={isPendingCreateProximo}
                  className="flex-1 text-lg py-6"
                >
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
