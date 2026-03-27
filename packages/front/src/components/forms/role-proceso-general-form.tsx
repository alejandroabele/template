"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import {
  useCreateRoleProcesoGeneralMutation,
  useDeleteRoleProcesoByRoleAndProcesoMutation,
  useGetProcesosByRoleIdQuery,
} from "@/hooks/role-proceso-general";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { useGetRoleByIdQuery } from "@/hooks/role";
import { useGetProcesoGeneralQuery } from "@/hooks/proceso-general";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  roleId: z
    .number({ message: "Rol requerido" })
    .min(1, { message: "Selecciona un rol" }),
  procesoGeneralIds: z.array(z.number()),
});

type RoleProcesoGeneralFormProps = {
  roleId: number;
  onSuccess?: () => void;
};

export default function RoleProcesoGeneralForm({
  roleId,
  onSuccess,
}: RoleProcesoGeneralFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: roleId,
      procesoGeneralIds: [],
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateRoleProcesoGeneralMutation();
  const { mutateAsync: deleteRelacion, isPending: isPendingDelete } =
    useDeleteRoleProcesoByRoleAndProcesoMutation();

  const { data: role, isLoading: roleLoading } = useGetRoleByIdQuery(roleId);
  const { data: procesosGenerales = [], isLoading: procesosLoading } =
    useGetProcesoGeneralQuery({
      pagination: { pageIndex: 0, pageSize: 100 },
    });

  const { data: existingProcesos = [], isLoading: existingProcesosLoading } =
    useGetProcesosByRoleIdQuery(roleId);

  useEffect(() => {
    if (existingProcesos && existingProcesos.length >= 0) {
      form.setValue("procesoGeneralIds", existingProcesos);
    }
  }, [existingProcesos]);

  const selectedProcesoIds = form.watch("procesoGeneralIds");

  const handleProcesoToggle = (procesoId: number) => {
    const current = form.getValues("procesoGeneralIds") || [];
    const updated = current.includes(procesoId)
      ? current.filter((id) => id !== procesoId)
      : [...current, procesoId];
    form.setValue("procesoGeneralIds", updated, { shouldDirty: true });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Determinar qué procesos agregar y cuáles eliminar
      const nuevosProcesoIds = values.procesoGeneralIds;
      const procesosACrear = nuevosProcesoIds.filter(
        (id) => !existingProcesos.includes(id)
      );
      const procesosAEliminar = existingProcesos.filter(
        (id) => !nuevosProcesoIds.includes(id)
      );

      // Crear nuevas relaciones
      const createPromises = procesosACrear.map((procesoGeneralId) =>
        create({ roleId: values.roleId, procesoGeneralId })
      );

      // Eliminar relaciones desmarcadas
      const deletePromises = procesosAEliminar.map((procesoGeneralId) =>
        deleteRelacion({ roleId: values.roleId, procesoGeneralId })
      );

      await Promise.all([...createPromises, ...deletePromises]);

      toast({
        title: "Permisos guardados",
        description: "Los procesos generales se han actualizado correctamente.",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Error al guardar los permisos.",
        variant: "destructive",
      });
    }
  }

  if (roleLoading || procesosLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto py-10"
      >
        <Card>
          <CardHeader>
            <CardTitle>Configurar Procesos Generales: {role?.nombre}</CardTitle>
            <CardDescription>
              Selecciona los procesos generales que puede ver este rol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existingProcesosLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {procesosGenerales.map((proceso) => (
                    <div
                      key={proceso.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`proceso-${proceso.id}`}
                        checked={selectedProcesoIds.includes(proceso.id)}
                        onCheckedChange={() => handleProcesoToggle(proceso.id)}
                      />
                      <Label
                        htmlFor={`proceso-${proceso.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {proceso.nombre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <FormMessage />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <LoadingButton
            loading={isPendingCreate || isPendingDelete}
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
