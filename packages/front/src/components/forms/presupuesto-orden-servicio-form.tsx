"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Presupuesto } from "@/types";
import { useVerficarServicioMutation } from "@/hooks/presupuestos";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, Save, Package } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, type Dispatch, type SetStateAction } from "react";
import { today } from "@/utils/date";
import { PROCESO_GENERAL } from "@/constants/presupuesto";

const formSchema = z.object({
  id: z.number().optional(),
  fechaVerificacionServicio: z.string({ message: "Requerido" }),
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
      fechaVerificacionServicio: data?.fechaVerificacionServicio || today(),
    },
  });

  const { mutateAsync: edit, isPending: isPendingEdit } =
    useVerficarServicioMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      await edit({ id: values.id, data: values });
      toast({
        title: "Operación exitosa",
        description: "Fecha de verificación de servicio guardada correctamente",
        variant: "default",
      });
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

  // const isDisabled = data?.procesoGeneralId !== PROCESO_GENERAL.ENVIADO_A_PRODUCCION // false
  const isDisabled = false;

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Fecha de verificación */}
          <div className="space-y-3">
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Fecha de verificación
            </FormLabel>
            <DatePicker
              label=""
              form={form}
              name="fechaVerificacionServicio"
              fromYear={2025}
              className="w-full"
              disabled={isDisabled}
            />
            <FormDescription className="text-xs">
              Seleccione la fecha en que se realizó la verificación de la orden
              de servicio
            </FormDescription>
          </div>

          <Separator />

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <FormLabel className="text-sm font-medium">
              Opciones adicionales
            </FormLabel>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 mt-4">
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
