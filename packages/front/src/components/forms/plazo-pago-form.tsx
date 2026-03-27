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
import { PlazoPago } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  descripcion: z.string({ message: "Requerido" }).min(2),
});

import {
  useCreatePlazoPagoMutation,
  useEditPlazoPagoMutation,
} from "@/hooks/plazo-pago";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

type PlazoPagoFormProps = {
  data?: PlazoPago;
};

export default function PlazoPagoForm({ data }: PlazoPagoFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      descripcion: data?.descripcion || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreatePlazoPagoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditPlazoPagoMutation();

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
        className="space-y-8  mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 30 días" type="text" {...field} />
              </FormControl>
              <FormDescription>
                Descripción del plazo de pago
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
