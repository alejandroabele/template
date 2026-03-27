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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { useCreateUbicacionMutation, useEditUbicacionMutation } from "@/hooks/ubicacion";
import { useRouter } from "next/navigation";
import type { Ubicacion } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "Requerido"),
  nombre: z.string().min(1, "Requerido"),
  descripcion: z.string().optional(),
});

type UbicacionFormProps = {
  data?: Ubicacion;
};

export default function UbicacionForm({ data }: UbicacionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!data?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      codigo: data?.recurso?.codigo || "",
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } = useCreateUbicacionMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } = useEditUbicacionMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values as Ubicacion);
      }
      toast({ description: "Operación exitosa", variant: "default" });
      router.push("/activos/ubicaciones");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código *</FormLabel>
                <FormControl>
                  <Input placeholder="Código de la ubicación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la ubicación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción de la ubicación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <LoadingButton loading={isPendingCreate || isPendingEdit} type="submit">
            Guardar
          </LoadingButton>
          <Button type="button" onClick={() => router.push("/activos/ubicaciones")} variant="link">
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
