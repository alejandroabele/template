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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CashflowCategoria } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z
    .string({ message: "Requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  tipo: z.enum(["ingreso", "egreso"], {
    message: "El tipo debe ser 'ingreso' o 'egreso'",
  }),
  metodoPagoId: z.number().optional().nullable(),
  rubroId: z.number().optional().nullable(),
});

import {
  useCreateCashflowCategoriaMutation,
  useEditCashflowCategoriaMutation,
} from "@/hooks/cashflow-categoria";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Usage: App router
import { LoadingButton } from "@/components/ui/loading-button";
import { MetodoPagoSelector } from "@/components/selectors/metodo-pago-selector";
import { CashflowRubroSelector } from "@/components/selectors/cashflow-rubro-selector";

type CashflowCategoriaFormProps = {
  data?: CashflowCategoria;
};

export default function CashflowCategoriaForm({
  data,
}: CashflowCategoriaFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      tipo: data?.tipo || "ingreso",
      metodoPagoId: data?.metodoPagoId || undefined,
      rubroId: data?.rubroId || undefined,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateCashflowCategoriaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditCashflowCategoriaMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (data?.id) {
        await edit({ id: data.id, data: values as CashflowCategoria });
        toast({
          title: "Categoría actualizada",
          description:
            "La categoría de cashflow se ha actualizado correctamente.",
        });
      } else {
        await create(values as CashflowCategoria);
        toast({
          title: "Categoría creada",
          description: "La categoría de cashflow se ha creado correctamente.",
        });
      }
      router.push("/cashflow-categoria");
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
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre de la categoría"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={data?.protegida}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="egreso">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="rubroId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rubro</FormLabel>
                  <FormControl>
                    <CashflowRubroSelector
                      value={field.value}
                      onChange={(val) => field.onChange(val ? Number(val) : null)}
                      placeholder="Seleccione un rubro (opcional)"
                    />
                  </FormControl>
                  <FormDescription>
                    Agrupa esta categoría dentro de un rubro.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="metodoPagoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <MetodoPagoSelector
                    placeholder="Seleccione un método de pago (opcional)"
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val))}
                  />
                  <FormDescription>
                    Este campo se utiliza para asociar los ingresos de los
                    cobros por este método de pago a la categoría.
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
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
