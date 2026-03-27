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
import { ContactoCaso } from "@/types";
import {
  useCreateContactoCasoMutation,
  useEditContactoCasoMutation,
} from "@/hooks/contacto-caso";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { useStore as useGlobalStore } from "@/lib/store";

const formSchema = z.object({
  id: z.number().optional(),
  titulo: z.string({ message: "Requerido" }).min(2, "El título debe tener al menos 2 caracteres"),
  clienteId: z.unknown().optional(),
  cliente: z.unknown().optional(),
  nombreContacto: z.string().optional(),
  emailContacto: z.string().email("Email inválido").optional().or(z.literal("")),
  telefonoContacto: z.string().optional(),
  vendedorId: z.number().optional(),
  notas: z.string().optional(),
});

type ContactoCasoFormProps = {
  data?: ContactoCaso;
  onSuccess?: () => void;
};

export default function ContactoCasoForm({ data, onSuccess }: ContactoCasoFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const user = useGlobalStore((state) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      titulo: data?.titulo || "",
      clienteId: data?.clienteId || null,
      cliente: data?.cliente || null,
      nombreContacto: data?.nombreContacto || "",
      emailContacto: data?.emailContacto || "",
      telefonoContacto: data?.telefonoContacto || "",
      vendedorId: data?.vendedorId,
      notas: data?.notas || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContactoCasoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContactoCasoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = { ...values };

      if (values.id) {
        await edit({ id: values.id, data: payload });
      } else {
        // Asignar el vendedorId del usuario logueado al crear
        payload.vendedorId = user?.userId;
        await create(payload);
      }
      toast({
        description: "Caso de contacto guardado exitosamente",
        variant: "default",
      });

      // Si hay callback onSuccess, ejecutarlo (para cerrar modal)
      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al guardar el caso de contacto",
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
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título del caso" type="text" {...field} />
              </FormControl>
              <FormDescription>
                Título descriptivo del caso de contacto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <ClienteSelector
                    value={field.value}
                    onChange={(cliente) => {
                      form.setValue("clienteId", cliente.id);
                      form.setValue("cliente", cliente);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Cliente asociado al caso (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombreContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre completo" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Nombre de la persona de contacto (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="emailContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="email@ejemplo.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  Email de la persona de contacto (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefonoContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono del Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="+54 9 11 1234-5678" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Teléfono de la persona de contacto (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales sobre el caso"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Información adicional sobre el caso (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            type="submit"
          >
            Guardar
          </LoadingButton>
          {!onSuccess && (
            <Button type="button" onClick={() => router.back()} variant={"link"}>
              Volver
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
