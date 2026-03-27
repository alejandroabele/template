"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Presupuesto } from "@/types";
import { useRegistrarFecha } from "@/hooks/presupuestos";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";

import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, Dispatch, SetStateAction } from "react";
import { today } from "@/utils/date";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  id: z.number().optional(),
  fechaEntregaEstimada: z.string({ message: "Requerido" }),
  vendedorId: z.unknown({ message: "Requerido" }),
  observaciones: z.string({ message: "Motivo es requerido" }).min(2, {
    message: "Motivo es requerido",
  }),
});

type PresupuestoAlmacenFormProps = {
  data?: Presupuesto;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PresupuestoAlmacenForm({
  data,
  setOpen,
}: PresupuestoAlmacenFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      fechaEntregaEstimada: data?.fechaEntregaEstimada || today(),
      observaciones: "",
      vendedorId: data?.vendedorId,
    },
  });

  const { mutateAsync: edit, isPending: isPendingEdit } = useRegistrarFecha();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      await edit({ id: values.id, data: values });
      toast({
        title: "Operación exitosa",
        description: "Fecha de verificación guardada correctamente",
        variant: "default",
      });

      // Close the dialog after successful submission
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      setError(
        "Ha ocurrido un error al guardar los datos. Por favor, inténtelo de nuevo."
      );
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <DatePicker
              label="Fecha de Entrega comprometida"
              form={form}
              name="fechaEntregaEstimada"
              fromYear={2025}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Seleccione la fecha en que se acordo con el equipo para
              comprometerse a entregar el trabajo
            </p>
          </div>
          <div className="p-4 ">
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este espacio es para ingresar el motivo por el cual se
                    modifico la fecha de entrega
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <LoadingButton loading={isPendingEdit} type="submit">
              Guardar
            </LoadingButton>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant={"link"}
            >
              Volver
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
