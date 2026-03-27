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
import { DatePicker } from "@/components/form-helpers/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { ALQUILER_TIPO } from "@/constants/alquiler";
import {
  useCreateAlquilerRecursoMutation,
  useEditAlquilerRecursoMutation,
} from "@/hooks/alquiler-recurso";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlquilerRecurso } from "@/types";
import { InputMoney } from "@/components/input-money";
import { useGetAlquilerRecursoByIdQuery } from "@/hooks/alquiler-recurso";
import { LoadingButton } from "@/components/ui/loading-button";
import { Wrench } from "lucide-react";
import { NuevaOtMantenimientoDialog } from "@/components/dialogs/nueva-ot-mantenimiento-dialog";
import React from "react";

export default function FormContainer({ id }: { id: number | null }) {
  const { data, isLoading, isFetching } = useGetAlquilerRecursoByIdQuery(id);
  if (isLoading || isFetching) return "Cargando...";
  return <MyForm data={data} />;
}

const formSchema = z.object({
  id: z.number().optional(),
  codigo: z
    .string({ message: "Codigo es requerido" })
    .min(1, { message: "Codigo es requerido" })
    .max(30),
  proveedor: z.string().optional(),
  tipo: z.string().min(1, { message: "Tipo es requerido" }),
  precio: z.coerce.number({ message: "Precio requerido" }),
  inicioContratoSubAlquiler: z.unknown({ message: "Requerido" }),
  vencimientoContratoSubAlquiler: z.unknown({ message: "Requerido" }),
});

type MyFormProps = {
  data?: AlquilerRecurso;
};

function MyForm({ data }: MyFormProps) {
  const [openNuevaOt, setOpenNuevaOt] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      codigo: data?.codigo || "",
      proveedor: data?.proveedor || "",
      tipo: data?.tipo || "",
      precio: data?.precio || 0,
      inicioContratoSubAlquiler: data?.inicioContratoSubAlquiler || null,
      vencimientoContratoSubAlquiler:
        data?.vencimientoContratoSubAlquiler || null,
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateAlquilerRecursoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditAlquilerRecursoMutation();

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>Codigo del recurso</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="proveedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>Nombre del proveedor</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALQUILER_TIPO.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio mensual</FormLabel>
                  <FormControl>
                    <InputMoney {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <DatePicker
              label="Inicio del subalquiler"
              form={form}
              name="inicioContratoSubAlquiler"
              fromYear={2020}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <DatePicker
              label="Vencimiento del subalquiler"
              form={form}
              name="vencimientoContratoSubAlquiler"
              fromYear={2025}
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
          {data?.id && (
            <Button type="button" variant="outline" onClick={() => setOpenNuevaOt(true)}>
              <Wrench className="h-4 w-4 mr-2" />
              Nueva OT de Mantenimiento
            </Button>
          )}
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>
        {data?.id && (
          <NuevaOtMantenimientoDialog
            open={openNuevaOt}
            setOpen={setOpenNuevaOt}
            alquilerRecursoId={data.id}
            codigoRecurso={data.codigo}
          />
        )}
      </form>
    </Form>
  );
}
