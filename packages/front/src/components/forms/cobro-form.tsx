"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputMoney } from "@/components/input-money";
import type { Cobro } from "@/types";
import { format } from "date-fns";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { useCreateCobroMutation, useEditCobroMutation } from "@/hooks/cobro";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/form-helpers/date-picker";
import React from "react";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { LoadingButton } from "@/components/ui/loading-button";
import type { Dispatch, SetStateAction } from "react";
import { PresupuestosFacturaSelector } from "@/components/selectors/presupuesto-factura-selector";
import { MetodoPagoSelector } from "@/components/selectors/metodo-pago-selector";
import { BancoSelector } from "@/components/selectors/banco-selector";
import { DollarSign, Receipt } from "lucide-react";

const formSchema = z.object({
  id: z.number().optional(),
  modelo: z.string(),
  modeloId: z.number(),
  monto: z
    .string({ message: "Monto requerido" })
    .min(1, { message: "Monto requerido" }),
  fecha: z.string().optional(),
  facturaId: z.number().optional(),
  metodoPagoId: z.number().optional(),
  bancoId: z.number().optional(),
  retenciones: z.string().optional(),
});

type CobroFormProps = {
  data?: Cobro;
  setOpen: Dispatch<SetStateAction<boolean>>;
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
  defaultMonto?: string;
};

export default function CobroForm({
  data,
  setOpen,
  modelo,
  modeloId,
  defaultMonto,
}: CobroFormProps) {
  const { toast } = useToast();
  const [archivos, setArchivos] = React.useState<File[]>([]);
  const [banco, setBanco] = React.useState(data?.banco);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      modelo: modelo,
      modeloId: modeloId,
      monto: data?.monto
        ? String(data.monto)
        : defaultMonto
          ? String(defaultMonto)
          : "",
      fecha: data?.fecha || format(new Date(), "yyyy-MM-dd"),
      facturaId: data?.facturaId || undefined,
      metodoPagoId: data?.metodoPagoId || undefined,
      bancoId: data?.bancoId || undefined,
      retenciones: data?.retenciones || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateCobroMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditCobroMutation();
  const { handleFileUpload } = useFileUploadHandler();

  const uploadFiles = async (id: number) => {
    if (archivos.length > 0) {
      await handleFileUpload({
        fileArray: archivos,
        modelo: "cobro",
        modeloId: id,
        tipo: "comprobante",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data?.id) {
        const result = await edit({
          id: data.id,
          data: values as Cobro,
        });
        await uploadFiles(result.id);
        toast({
          title: "Cobro actualizado",
          description: "El cobro se ha actualizado correctamente",
        });
      } else {
        const result = await create(values as Cobro);
        await uploadFiles(result.id);
        toast({
          title: "Cobro creado",
          description: "El cobro se ha creado correctamente",
        });
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el cobro",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-1">
          {/* Información del Cobro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información del Cobro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="monto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto *</FormLabel>
                    <FormControl>
                      <InputMoney {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <>
                <DatePicker
                  label="Fecha *"
                  form={form}
                  name="fecha"
                  fromYear={2020}
                />

                <FormField
                  control={form.control}
                  name="facturaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factura</FormLabel>
                      <FormControl>
                        <PresupuestosFacturaSelector
                          modeloId={modeloId}
                          modelo={modelo}
                          value={field.value}
                          onChange={(val) => field.onChange(Number(val))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metodoPagoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pago</FormLabel>
                      <FormControl>
                        <MetodoPagoSelector
                          value={field.value}
                          onChange={(val) => field.onChange(Number(val))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bancoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <BancoSelector
                          value={banco}
                          onChange={(val) => {
                            setBanco(val);
                            field.onChange(val?.id);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="retenciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retenciones</FormLabel>
                      <FormControl>
                        <InputMoney {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </>
              <ArchivosInput
                value={archivos}
                setValue={(files) => setArchivos(files || [])}
                label="Comprobante"
                defaultValue={data?.comprobante}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPendingCreate || isPendingEdit}
          >
            Cancelar
          </Button>
          <LoadingButton
            onClick={() => form.handleSubmit(onSubmit)()}
            type="button"
            loading={isPendingCreate || isPendingEdit}
          >
            {data?.id ? "Actualizar" : "Crear"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
