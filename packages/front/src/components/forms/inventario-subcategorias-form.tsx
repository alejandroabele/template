"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { InventarioSubcategoria } from "@/types";
import {
  useCreateInventarioSubcategoriaMutation,
  useEditInventarioSubcategoriaMutation,
} from "@/hooks/inventario-subcategoria";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ message: "Requerido" }).min(2),
  inventarioCategoriaId: z.number(),
});

type MyFormProps = {
  data?: InventarioSubcategoria;
};

export default function MyForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      inventarioCategoriaId: data?.inventarioCategoriaId,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateInventarioSubcategoriaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditInventarioSubcategoriaMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values);
      }
      toast({
        description: "Éxito al realizar la operación",
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
  const onerror = (errors: any) => {
    console.error("Form validation errors", errors);
    toast({
      description: "Error en la validación del formulario",
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onerror)}
        className="space-y-8 mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
              <FormDescription>
                Este es el nombre de la subcategoría
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
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
