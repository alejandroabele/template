"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Presupuesto } from "@/types";
import { useConfirmarEntrega } from "@/hooks/presupuestos";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";

import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, Dispatch, SetStateAction } from "react";
import { today } from "@/utils/date";
import { Textarea } from "@/components/ui/textarea";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { useCreateMensajeMutation } from "@/hooks/mensaje";
import { useStore } from "@/lib/store";
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
  fechaEntregado: z.string({ message: "Requerido" }),
  observaciones: z.string({ message: "Motivo es requerido" }).optional(),
});

type PresupuestoConfirmarEntregaFormProps = {
  data?: Presupuesto;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PresupuestoConfirmarEntregaForm({
  data,
  setOpen,
}: PresupuestoConfirmarEntregaFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [remito, setRemito] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      fechaEntregado: data?.fechaEntregado || today(),
      observaciones: "",
    },
  });

  const { mutateAsync: edit, isPending: isPendingEdit } = useConfirmarEntrega();
  const { mutateAsync: create, isPending: isSending } =
    useCreateMensajeMutation();
  const { handleFileUpload } = useFileUploadHandler();
  const { user } = useStore();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      if (remito.length > 0) {
        const mensaje = await create({
          tipoId: data?.id || 0,
          tipo: "presupuesto",
          mensaje: values.observaciones || "Remito Cargado Automaticamente",
          usuarioOrigenId: user?.userId || 0,
          usuarioOrigenNombre: user?.nombre,
        });
        if (mensaje.id && remito.length > 0) {
          await handleFileUpload({
            modelo: "mensaje",
            modeloId: mensaje.id,
            tipo: "adjunto",
            fileArray: remito,
          });
        }
      }

      await edit({
        id: values.id,
        data: {
          fechaEntregado: values.fechaEntregado,
        },
      });
      toast({
        title: "Operación exitosa",
        description: "Fecha de entrega guardada correctamente",
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
              label="Fecha de entrega del trabajo"
              form={form}
              name="fechaEntregado"
              fromYear={2025}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Seleccione la fecha que se entrego el trabajo/servicio.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <ArchivosInput label="Remito" value={remito} setValue={setRemito} />
          </div>
          <div className="p-4 ">
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este espacio es para ingresar alguna observaciones asociada
                    a la entrega
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
