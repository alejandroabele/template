"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Palette, X } from "lucide-react";
import { useEditOfertaMutation } from "@/hooks/oferta";
import { useToast } from "@/hooks/use-toast";
import { ColorPicker } from "@/components/form-helpers/color-picker";
import type { Oferta } from "@/types";

type CambiarColorOfertasDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ofertas: Oferta[];
  onSuccess?: () => void;
};

type FormValues = {
  color: string | null;
};

export function CambiarColorOfertasDialog({
  open,
  onOpenChange,
  ofertas,
  onSuccess,
}: CambiarColorOfertasDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      color: null,
    },
  });

  const { mutateAsync: editOferta } = useEditOfertaMutation();

  const handleAplicarColor = async (values: FormValues) => {
    if (ofertas.length === 0) {
      toast({
        description: "No hay ofertas seleccionadas",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    let actualizadas = 0;
    let errores = 0;

    try {
      for (const oferta of ofertas) {
        try {
          await editOferta({
            id: oferta.id!,
            data: { color: values.color } as Oferta,
          });
          actualizadas++;
        } catch (error) {
          console.error(`Error actualizando oferta ${oferta.id}:`, error);
          errores++;
        }
      }

      toast({
        description: `${actualizadas} oferta(s) actualizada(s)${errores > 0 ? `. ${errores} error(es).` : ""}`,
        variant: errores > 0 ? "destructive" : "default",
      });

      if (actualizadas > 0) {
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error aplicando color:", error);
      toast({
        description: "Error al aplicar el color",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuitarColor = async () => {
    if (ofertas.length === 0) {
      toast({
        description: "No hay ofertas seleccionadas",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    let actualizadas = 0;
    let errores = 0;

    try {
      for (const oferta of ofertas) {
        try {
          await editOferta({
            id: oferta.id!,
            data: { color: null } as Oferta,
          });
          actualizadas++;
        } catch (error) {
          console.error(`Error actualizando oferta ${oferta.id}:`, error);
          errores++;
        }
      }

      toast({
        description: `${actualizadas} oferta(s) actualizada(s)${errores > 0 ? `. ${errores} error(es).` : ""}`,
        variant: errores > 0 ? "destructive" : "default",
      });

      if (actualizadas > 0) {
        onOpenChange(false);
        form.reset({ color: null });
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error quitando color:", error);
      toast({
        description: "Error al quitar el color",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  const colorValue = form.watch("color");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Cambiar Color
          </DialogTitle>
          <DialogDescription>
            Selecciona un color para {ofertas.length} oferta(s) seleccionada(s).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAplicarColor)}>
            <div className="py-4">
              <ColorPicker
                form={form}
                name="color"
                label="Color"
                disabled={isProcessing}
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuitarColor}
                  disabled={isProcessing || !ofertas.length}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Quitar Color
                </Button>

                <Button
                  type="submit"
                  disabled={isProcessing || !colorValue}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    "Aplicar Color"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
