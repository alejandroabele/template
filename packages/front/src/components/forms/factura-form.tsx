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
} from "@/components/ui/form";
import { InputMoney } from "@/components/input-money";
import type { Factura } from "@/types";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import {
  useCreateFacturaMutation,
  useEditFacturaMutation,
} from "@/hooks/factura";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/form-helpers/date-picker";
import React from "react";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { LoadingButton } from "@/components/ui/loading-button";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { today } from "@/utils/date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FACTURA_ESTADO } from "@/constants/factura";

const formSchema = z.object({
  id: z.number().optional(),
  modelo: z.string(),
  modeloId: z.number(),
  monto: z
    .string({ message: "Monto requerido" })
    .min(1, { message: "Monto requerido" }),
  importeBruto: z.string().optional(),
  alicuota: z
    .string({ message: "Alícuota requerida" })
    .min(1, { message: "Alícuota requerida" }),
  estado: z.enum(["pendiente", "pagado", "parcial"]).optional(),
  folio: z.string().optional(),
  fecha: z.string({ message: "Fecha requerida" }),
  fechaVencimiento: z.string({ message: "Fecha de vencimiento requerida" }),
  inicioPeriodo: z.string().optional(),
  finPeriodo: z.string().optional(),
  clienteId: z.number().optional(),
});

type FacturaFormProps = {
  data?: Factura;
  setOpen: Dispatch<SetStateAction<boolean>>;
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
  defaultMonto?: string;
  defaultClienteId?: number;
  defaultCliente?: { id: number; nombre: string };
};

export default function FacturaForm({
  data,
  setOpen,
  modelo,
  modeloId,
  defaultMonto,
  defaultClienteId,
  defaultCliente,
}: FacturaFormProps) {
  const { toast } = useToast();
  const [factura, setFactura] = React.useState<File[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      modelo: modelo,
      modeloId: modeloId,
      fecha: data?.fecha || today(),
      monto: data?.monto ? String(data.monto) : defaultMonto || "",
      importeBruto: data?.importeBruto ? String(data.importeBruto) : "",
      alicuota: data?.alicuota ? String(data.alicuota) : "21",
      estado:
        (data?.estado as "pendiente" | "pagado" | "parcial") || "pendiente",
      folio: data?.folio || "",
      fechaVencimiento: data?.fechaVencimiento || undefined,
      inicioPeriodo: data?.inicioPeriodo || undefined,
      finPeriodo: data?.finPeriodo || undefined,
      clienteId: data?.clienteId || defaultClienteId || null,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateFacturaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditFacturaMutation();
  const { handleFileUpload } = useFileUploadHandler();

  // Estado para rastrear qué campo fue modificado por el usuario
  const [ultimoCambio, setUltimoCambio] = React.useState<
    "monto" | "importeBruto" | null
  >(null);

  // Calcular importeBruto cuando cambian monto o alícuota (monto neto → bruto)
  React.useEffect(() => {
    if (ultimoCambio !== "monto") return;

    const monto = form.watch("monto");
    const alicuota = form.watch("alicuota");

    if (monto && alicuota) {
      const montoStr = typeof monto === "string" ? monto : String(monto);
      const montoNumerico = parseFloat(montoStr);
      const alicuotaNumerica = parseFloat(alicuota);

      if (
        !isNaN(montoNumerico) &&
        !isNaN(alicuotaNumerica) &&
        alicuotaNumerica >= 0
      ) {
        // Calcular importe bruto (monto neto + IVA)
        const importeBruto = montoNumerico * (1 + alicuotaNumerica / 100);
        form.setValue("importeBruto", importeBruto.toFixed(2));
      }
    }
  }, [form.watch("monto"), form.watch("alicuota"), ultimoCambio]);

  // Calcular monto neto cuando cambian importeBruto o alícuota (bruto → monto neto)
  React.useEffect(() => {
    if (ultimoCambio !== "importeBruto") return;

    const importeBruto = form.watch("importeBruto");
    const alicuota = form.watch("alicuota");

    if (importeBruto && alicuota) {
      const importeBrutoStr =
        typeof importeBruto === "string" ? importeBruto : String(importeBruto);
      const importeBrutoNumerico = parseFloat(importeBrutoStr);
      const alicuotaNumerica = parseFloat(alicuota);

      if (
        !isNaN(importeBrutoNumerico) &&
        !isNaN(alicuotaNumerica) &&
        alicuotaNumerica >= 0
      ) {
        // Calcular monto neto (importe bruto / (1 + IVA))
        const montoNeto = importeBrutoNumerico / (1 + alicuotaNumerica / 100);
        form.setValue("monto", montoNeto.toFixed(2));
      }
    }
  }, [form.watch("importeBruto"), form.watch("alicuota"), ultimoCambio]);

  const uploadFiles = async (id: number) => {
    await handleFileUpload({
      fileId: data?.facturaArchivo?.id,
      fileArray: factura,
      modelo: "factura",
      modeloId: id,
      tipo: "factura",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let response;
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
        await uploadFiles(values.id);
      } else {
        response = await create(values);
        if (response.id) {
          form.setValue("id", response.id);
          await uploadFiles(response.id);
        }
      }
      toast({
        description: "Factura guardada exitosamente",
        variant: "default",
      });
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al guardar la factura",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-8"
      >
        <div className="space-y-6">
          {/* Primary Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField
              control={form.control}
              name="folio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folio</FormLabel>
                  <FormControl>
                    <Input placeholder="0001-00001234" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={() => (
                <FormItem className="flex flex-col">
                  <DatePicker
                    label="Fecha"
                    form={form}
                    name="fecha"
                    fromYear={2020}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Neto (Sin IVA)</FormLabel>
                  <FormControl>
                    <InputMoney
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        setUltimoCambio("monto");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alicuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alícuota (%)</FormLabel>
                  <FormControl>
                    <InputNumber placeholder="21" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="importeBruto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe Bruto (Con IVA)</FormLabel>
                  <FormControl>
                    <InputMoney
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        setUltimoCambio("importeBruto");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {data?.id && (
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={FACTURA_ESTADO.PENDIENTE}>
                          Pendiente
                        </SelectItem>
                        <SelectItem value={FACTURA_ESTADO.PARCIAL}>
                          Parcial
                        </SelectItem>
                        <SelectItem value={FACTURA_ESTADO.PAGADO}>
                          Pagado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Divider */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-5">
              Datos adicionales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormField
                  control={form.control}
                  name="fechaVencimiento"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <DatePicker
                        label="Vencimiento"
                        form={form}
                        name="fechaVencimiento"
                        fromYear={2020}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Cliente</FormLabel>
                      <ClienteSelector
                        value={data?.cliente || defaultCliente}
                        onChange={(v) => form.setValue("clienteId", v.id)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormField
                  control={form.control}
                  name="inicioPeriodo"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <DatePicker
                        label="Inicio período"
                        form={form}
                        name="inicioPeriodo"
                        fromYear={2020}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finPeriodo"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <DatePicker
                        label="Fin período"
                        form={form}
                        name="finPeriodo"
                        fromYear={2020}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Client and File */}
          <div className="border-t pt-6 space-y-5">
            <div>
              <ArchivosInput
                label="Archivo"
                value={factura}
                setValue={setFactura}
                defaultValue={data?.facturaArchivo}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button type="button" onClick={() => setOpen(false)} variant="ghost">
            Cancelar
          </Button>
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            onClick={() => form.handleSubmit(onSubmit)()}
            type="button"
          >
            {data?.id ? "Actualizar" : "Crear"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
