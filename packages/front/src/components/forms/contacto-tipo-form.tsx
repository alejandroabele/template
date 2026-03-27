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
import { ContactoTipo } from "@/types";
import {
  useCreateContactoTipoMutation,
  useEditContactoTipoMutation,
} from "@/hooks/contacto-tipo";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { ColorPicker } from "@/components/form-helpers/color-picker";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ message: "Requerido" }).min(2, "El nombre debe tener al menos 2 caracteres"),
  icono: z.string().optional(),
  color: z.string().optional(),
});

type ContactoTipoFormProps = {
  data?: ContactoTipo;
};

export default function ContactoTipoForm({ data }: ContactoTipoFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      icono: data?.icono || "",
      color: data?.color || "#2563eb",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContactoTipoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContactoTipoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values);
      }
      toast({
        description: "Tipo de contacto guardado exitosamente",
        variant: "default",
      });
      router.back();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al guardar el tipo de contacto",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Teléfono, Email, etc." type="text" {...field} />
              </FormControl>
              <FormDescription>
                Nombre del tipo de contacto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícono</FormLabel>
              <FormControl>
                <Input placeholder="Ej: phone, mail, etc." type="text" {...field} />
              </FormControl>
              <FormDescription>
                Nombre del ícono (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ColorPicker
          form={form}
          name="color"
          label="Color"
          defaultColor="#2563eb"
        />

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
