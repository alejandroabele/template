"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
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
import { Receta } from "@/types";
import { MAX_LIMIT } from "@/constants/query";
import { Loading } from "@/components/loading";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ message: "Requerido" }).min(2),
  descripcion: z.string({ message: "Requerido" }).min(2),
  // produccionTrabajos: z.unknown({})
});
import { useCreateRecetaMutation, useEditRecetaMutation } from "@/hooks/receta";
import { useGetProduccionTrabajosQuery } from "@/hooks/produccion-trabajos";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Usage: App router
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import CargaInventarioForm from "@/components/forms/carga-inventario-form";

type MyFormProps = {
  data?: Receta;
  trabajos: any;
  duplicar?: boolean;
};

type FormWrapperProps = {
  data?: Receta;
  duplicar?: boolean;
};

export default function FormWrapper({
  data,
  duplicar = false,
}: FormWrapperProps) {
  const { data: trabajos, isLoading } = useGetProduccionTrabajosQuery({
    pagination: {
      pageIndex: 0,
      pageSize: MAX_LIMIT,
    },
    globalFilter: "menu",
  });
  if (isLoading) return <Loading />;

  return <RecetasForm data={data} trabajos={trabajos} duplicar={duplicar} />;
}
const RecetasForm = ({ data, trabajos, duplicar }: MyFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const validarCantidades = () => {
    if (!produccionTrabajos) return true;

    for (const categoria of Object.keys(produccionTrabajos)) {
      for (const trabajo of produccionTrabajos[categoria]) {
        const subcategorias = ["materiales", "suministros", "manoDeObra"];

        for (const subcategoria of subcategorias) {
          if (trabajo[subcategoria]) {
            for (const item of trabajo[subcategoria]) {
              if (
                item.cantidad === "" ||
                item.cantidad === null ||
                item.cantidad === undefined
              ) {
                return false;
              }
            }
          }
        }
      }
    }

    return true;
  };

  // Estado local para produccionTrabajos
  const [produccionTrabajos, setProduccionTrabajos] = React.useState(
    data?.produccionTrabajos || trabajos
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
      // produccionTrabajos: data?.produccionTrabajos || trabajos
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateRecetaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditRecetaMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!validarCantidades()) {
        toast({
          title: "Revisión necesaria",
          description: "Hay algunos ítems que no tienen una cantidad asignada.",
          variant: "warning",
        });
        return;
      }
      const payload = {
        ...values,
        produccionTrabajos, // Incluir el estado de produccionTrabajos
      };
      if (duplicar) {
        delete values.id;
      }

      if (values.id) {
        await edit({ id: values.id, data: payload });
      } else {
        await create(payload);
        router.back();
      }
      toast({
        description: "Éxito al realizar la operación",
        variant: "success",
      });
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
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
              <FormDescription>Este es el nombre de la receta</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pasar el estado y la función de actualización como props */}
        <CargaInventarioForm
          produccionTrabajos={produccionTrabajos}
          setProduccionTrabajos={setProduccionTrabajos}
          trabajos={trabajos}
          receta
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Podes usar este espacio para almacenar informacion adicional de
                los alquileres
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
};
