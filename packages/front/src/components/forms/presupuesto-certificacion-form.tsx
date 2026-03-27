"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Presupuesto } from "@/types";
import { useCertificar } from "@/hooks/presupuestos";
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
  observaciones: z.string({ message: "Motivo es requerido" }).optional(),
});

type PresupuestoCertificacionFormProps = {
  data?: Presupuesto;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PresupuestoCertificacionForm({
  data,
  setOpen,
}: PresupuestoCertificacionFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [certificacion, setCertificacion] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      observaciones: "",
    },
  });

  const { mutateAsync: edit, isPending: isPendingEdit } = useCertificar();
  const { mutateAsync: create, isPending: isSending } =
    useCreateMensajeMutation();
  const { handleFileUpload } = useFileUploadHandler();
  const { user } = useStore();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      if (certificacion.length > 0) {
        const mensaje = await create({
          tipoId: data?.id || 0,
          tipo: "presupuesto",
          mensaje: values.observaciones || "Remito Cargado Automaticamente",
          usuarioOrigenId: user?.userId || 0,
          usuarioOrigenNombre: user?.nombre,
        });
        if (mensaje.id && certificacion.length > 0) {
          await handleFileUpload({
            modelo: "mensaje",
            modeloId: mensaje.id,
            tipo: "adjunto",
            fileArray: certificacion,
          });
        }
      }

      await edit({
        id: values.id,
        data: {},
      });
      toast({
        title: "Operación exitosa",
        description: "Certificación guardada correctamente",
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
          <div className="col-span-12 md:col-span-6">
            <ArchivosInput
              label="Certificacion"
              value={certificacion}
              setValue={setCertificacion}
            />
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
                    a la certificacion
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
