"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { CuentaContable } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  codigo: z.string({ message: "Requerido" }).min(1, "El código es requerido"),
  descripcion: z.string({ message: "Requerido" }).min(1, "La descripción es requerida"),
  tipo: z.enum(['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto'], { message: "Requerido" }),
});

import {
  useCreateCuentaContableMutation,
  useUpdateCuentaContableMutation,
} from "@/hooks/cuenta-contable";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

type CuentaContableFormProps = {
  data?: CuentaContable;
};

export default function CuentaContableForm({ data }: CuentaContableFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      codigo: data?.codigo || "",
      descripcion: data?.descripcion || "",
      tipo: data?.tipo || "activo",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateCuentaContableMutation();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdateCuentaContableMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await update({ id: values.id, data: values as CuentaContable });
      } else {
        await create(values as CuentaContable);
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
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 1.1.01.001" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción de la cuenta" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="pasivo">Pasivo</SelectItem>
                  <SelectItem value="patrimonio">Patrimonio</SelectItem>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="gasto">Gasto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
