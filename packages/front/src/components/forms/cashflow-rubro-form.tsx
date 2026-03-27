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
import { Textarea } from "@/components/ui/textarea";
import { CashflowRubro } from "@/types";
import { CashflowAgrupacionSelector } from "@/components/selectors/cashflow-agrupacion-selector";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z
    .string({ message: "Requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  descripcion: z.string().optional(),
  agrupacionId: z.number().nullable().optional(),
});

import {
  useCreateCashflowRubroMutation,
  useEditCashflowRubroMutation,
} from "@/hooks/cashflow-rubro";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

type CashflowRubroFormProps = {
  data?: CashflowRubro;
};

export default function CashflowRubroForm({ data }: CashflowRubroFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
      agrupacionId: data?.agrupacionId || null,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateCashflowRubroMutation();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useEditCashflowRubroMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (data?.id) {
        await update({ id: data.id, data: values as CashflowRubro });
        toast({
          title: "Rubro actualizado",
          description: "El rubro de cashflow se ha actualizado correctamente.",
        });
      } else {
        await create(values as CashflowRubro);
        toast({
          title: "Rubro creado",
          description: "El rubro de cashflow se ha creado correctamente.",
        });
      }
      router.push("/cashflow-rubro");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al procesar la solicitud.",
      });
      console.error("Error:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre del rubro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="agrupacionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agrupación</FormLabel>
                  <FormControl>
                    <CashflowAgrupacionSelector
                      value={field.value}
                      onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción opcional del rubro"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción opcional del rubro para mayor claridad
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <LoadingButton
            loading={isPendingCreate || isPendingUpdate}
            type="submit"
          >
            Guardar
          </LoadingButton>
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
