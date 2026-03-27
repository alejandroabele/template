"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { CashflowCategoriaSelector } from "@/components/selectors/cashflow-categoria-selector";

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  categoriaId: z.string().optional(),
});

interface CambiarFechaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cantidadTransacciones: number;
  onConfirm: (nuevaFecha: string, categoriaId?: string) => Promise<void>;
}

export function CambiarFechaDialog({
  open,
  setOpen,
  cantidadTransacciones,
  onConfirm,
}: CambiarFechaDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: "",
      categoriaId: "",
    },
  });

  const handleConfirm = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await onConfirm(values.fecha, values.categoriaId);
      setOpen(false);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar fecha de transacciones</DialogTitle>
          <DialogDescription>
            Se actualizarán {cantidadTransacciones} transacción
            {cantidadTransacciones > 1 ? "es" : ""} con los datos seleccionados.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <DatePicker form={form} name="fecha" label="Nueva fecha" />

            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría (opcional)</FormLabel>
                  <CashflowCategoriaSelector
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <LoadingButton type="submit" loading={isLoading}>
                Confirmar cambio
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
