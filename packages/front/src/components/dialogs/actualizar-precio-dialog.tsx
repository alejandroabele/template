"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { InputMoney } from "@/components/input-money";
import { useActualizarPrecioManual } from "@/hooks/inventario";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  precio: z.coerce
    .number({ message: "Requerido" })
    .positive({ message: "El precio debe ser mayor a 0" })
    .transform((val) => val.toString()),
  motivo: z
    .string({ message: "Requerido" })
    .min(5, { message: "El motivo debe tener al menos 5 caracteres" }),
});

type ActualizarPrecioDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  inventarioId: number;
  precioActual: number;
};

export const ActualizarPrecioDialog = ({
  open,
  setOpen,
  inventarioId,
  precioActual,
}: ActualizarPrecioDialogProps) => {
  const { toast } = useToast();
  const { mutateAsync: actualizar, isPending } = useActualizarPrecioManual();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      precio: precioActual as unknown as string,
      motivo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await actualizar({ id: inventarioId, data: values });
      toast({
        title: "Precio actualizado",
        description: "El precio unitario se ha actualizado correctamente",
      });
      setOpen(false);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-md pointer-events-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Actualizar precio unitario</DialogTitle>
          <DialogDescription>
            El cambio quedará registrado en el historial de precios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nuevo precio unitario *</FormLabel>
                  <FormControl>
                    <InputMoney {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del cambio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Actualización por nuevo precio de lista del proveedor..."
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
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
              <LoadingButton type="submit" loading={isPending}>
                Confirmar
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
