"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Cliente, ContratoMarco } from "@/types";
const formSchema = z.object({
  id: z.number().optional(),
  fechaInicio: z.unknown({ message: "Requerido" }),
  fechaFin: z.unknown({ message: "Requerido" }),
  nroContrato: z.string({ message: "Requerido" }),
  observaciones: z.string({ message: "Requerido" }).optional(),
  termDePago: z.string({ message: "Requerido" }).optional(),
  monto: z.string({ message: "Requerido" }).optional(),
  periodicidadActualizacion: z.string({ message: "Requerido" }),
  clienteId: z.unknown({ message: "Precio requerido" }),
});
import {
  useCreateContratoMarcoMutation,
  useEditContratoMarcoMutation,
} from "@/hooks/contrato-marco";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Usage: App router
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { today } from "@/utils/date";
import { PeriodicidadActualizacion } from "@/components/selectors/periodicidad-actualizacion-selector";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { TalonarioDialog } from "../dialogs/talonario-dialog";
import { ContratoMarcoPresupuestoDialog } from "../dialogs/contrato-marco-presupuesto-dialog";
import { InputMoney } from "../input-money";
type MyFormProps = {
  data?: ContratoMarco;
};
export default function MyForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [openDialogTalonario, setOpenDialogTalonario] = React.useState(false);
  const [openDialogPresupuesto, setOpenDialogPresupuesto] =
    React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      fechaInicio: data?.fechaInicio || today(),
      fechaFin: data?.fechaFin,
      nroContrato: data?.nroContrato || "",
      periodicidadActualizacion: data?.periodicidadActualizacion,
      clienteId: data?.clienteId || null,
      observaciones: data?.observaciones || "",
      termDePago: data?.termDePago || "",
      monto: data?.monto || "",
    },
  });
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContratoMarcoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContratoMarcoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values);
      }
      toast({
        description: "Exito al realizar la operación",
        variant: "default",
      });
      router.back();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      {data && (
        <TalonarioDialog
          open={openDialogTalonario}
          setOpen={setOpenDialogTalonario}
          data={data}
        />
      )}
      {data && (
        <ContratoMarcoPresupuestoDialog
          open={openDialogPresupuesto}
          setOpen={setOpenDialogPresupuesto}
          data={data}
        />
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-2">
              <FormField
                control={form.control}
                name="nroContrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nro Contrato</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este es el nro del contrato
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <DatePicker
                label="Inicio de contrato"
                form={form}
                name="fechaInicio"
                fromYear={2020}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <DatePicker
                label="Vencimiento de contrato"
                form={form}
                name="fechaFin"
                fromYear={2025}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pb-2">Cliente</FormLabel>
                    <ClienteSelector
                      value={data?.cliente}
                      onChange={(v: Cliente) => {
                        form.setValue("clienteId", v.id);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <FormField
                control={form.control}
                name="periodicidadActualizacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidad Actualización</FormLabel>
                    <PeriodicidadActualizacion
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="monto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <InputMoney placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>Monto total del contrato</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-5">
              <FormField
                control={form.control}
                name="termDePago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminos de pago</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Terminos de pagos en este contrato. Ejemplo: "30 dias",
                      "60 dias", etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
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
                      Podes usar este espacio para almacenar informacion
                      adicional de este contrato.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <LoadingButton
              loading={isPendingCreate || isPendingEdit}
              type="submit"
            >
              Guardar
            </LoadingButton>
            <Button
              type="button"
              onClick={() => router.back()}
              variant={"link"}
            >
              Volver
            </Button>
            <Button
              onClick={() => setOpenDialogTalonario(true)}
              type="button"
              variant={"secondary"}
              disabled={!data?.id}
            >
              Crear Talonario
            </Button>

            <Button
              onClick={() => setOpenDialogPresupuesto(true)}
              type="button"
              variant={"secondary"}
              disabled={!data?.id}
            >
              Crear Orden
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
