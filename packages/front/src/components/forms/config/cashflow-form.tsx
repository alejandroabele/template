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
import { Checkbox } from "@/components/ui/checkbox";
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
  cashflow_dias_habiles_edicion: z.string().optional(),
  cashflow_permitir_edicion_sin_limite: z.boolean().optional(),
});

const MODULE = "cashflow";

export default function CashflowForm() {
  const { toast } = useToast();

  const { data: configs, isLoading } = useGetConfigsByModuleQuery(MODULE);

  const hasAccess = hasPermission(PERMISOS.CASHFLOW_CONFIG);
  const router = useRouter();

  // Buscar las configuraciones específicas
  const diasHabilesConfig = configs?.find(
    (c) => c.clave === CONFIGURACIONES.CASHFLOW_DIAS_HABILES_EDICION
  );

  const permitirEdicionSinLimiteConfig = configs?.find(
    (c) => c.clave === CONFIGURACIONES.CASHFLOW_PERMITIR_EDICION_SIN_LIMITE
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      cashflow_dias_habiles_edicion: diasHabilesConfig?.valor || "",
      cashflow_permitir_edicion_sin_limite:
        permitirEdicionSinLimiteConfig?.valor === "true",
    },
  });

  const { mutateAsync: edit, isPending } = useEditConfigMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!diasHabilesConfig?.id || !permitirEdicionSinLimiteConfig?.id) {
      toast({
        description: "Error: configuración no encontrada",
        variant: "destructive",
      });
      return;
    }

    try {
      // Actualizar días hábiles
      await edit({
        id: diasHabilesConfig.id,
        data: { valor: values.cashflow_dias_habiles_edicion || null },
      });

      // Actualizar permitir edición sin límite
      await edit({
        id: permitirEdicionSinLimiteConfig.id,
        data: {
          valor: values.cashflow_permitir_edicion_sin_limite ? "true" : "false",
        },
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
          No tienes permisos para ver la configuración de cashflow.
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
            Administra las configuraciones del módulo de cashflow
          </p>
        </div>

        <FormField
          control={form.control}
          name="cashflow_permitir_edicion_sin_limite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Permitir Edición Sin Límite de Tiempo
                </FormLabel>
                <FormDescription>
                  {permitirEdicionSinLimiteConfig?.descripcion ||
                    "Si está activado, se podrá editar registros de cashflow sin restricción de días hábiles"}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cashflow_dias_habiles_edicion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Días Hábiles Permitidos para Edición</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  {...field}
                  disabled={form.watch("cashflow_permitir_edicion_sin_limite")}
                />
              </FormControl>
              <FormDescription>
                {diasHabilesConfig?.descripcion ||
                  "Cantidad de días hábiles hacia atrás que se permite modificar registros de cashflow. Solo aplica si la opción superior está desactivada."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* AQUÍ SE PUEDEN AGREGAR MÁS CAMPOS DE CONFIGURACIÓN DEL MÓDULO CASHFLOW */}

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
