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
import { InputMoney } from "@/components/input-money";
import {
  useEditConfigMutation,
  useGetConfigsByModuleQuery,
} from "@/hooks/config";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CONFIGURACIONES } from "@/constants/config";
const formSchema = z.object({
  orden_compra_limite_monto: z.string().optional(),
});

const MODULE = "compras";

export default function ComprasForm() {
  const { toast } = useToast();

  const { data: configs, isLoading } = useGetConfigsByModuleQuery(MODULE);

  const hasAccess = hasPermission(PERMISOS.COMPRAS_CONFIG);
  const router = useRouter();

  // Buscar la configuración específica
  const limiteMontoConfig = configs?.find(
    (c) => c.clave === CONFIGURACIONES.ORDEN_COMPRA_LIMITE_MONTO
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      orden_compra_limite_monto: limiteMontoConfig?.valor || "",
    },
  });

  const { mutateAsync: edit, isPending } = useEditConfigMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!limiteMontoConfig?.id) {
      toast({
        description: "Error: configuración no encontrada",
        variant: "destructive",
      });
      return;
    }

    try {
      await edit({
        id: limiteMontoConfig.id,
        data: { valor: values.orden_compra_limite_monto || null },
      });
      toast({
        description: "Configuración actualizada exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al actualizar la configuración",
        variant: "destructive",
      });
    }
  }

  if (!hasAccess) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">
          No tienes permisos para ver la configuración de compras.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Cargando configuración...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div>
          <p className="text-muted-foreground">
            Administra las configuraciones del módulo de compras
          </p>
        </div>

        <FormField
          control={form.control}
          name="orden_compra_limite_monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Límite de Monto - Orden de Compra</FormLabel>
              <FormControl>
                <InputMoney placeholder="1000000" {...field} />
              </FormControl>
              <FormDescription>
                {limiteMontoConfig?.descripcion ||
                  "Monto límite para órdenes de compra que requieren autorización adicional"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* AQUÍ SE PUEDEN AGREGAR MÁS CAMPOS DE CONFIGURACIÓN DEL MÓDULO COMPRAS */}

        <div className="flex gap-2">
          <LoadingButton loading={isPending} type="submit">
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
