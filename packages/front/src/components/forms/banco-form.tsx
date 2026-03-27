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
import { Checkbox } from "@/components/ui/checkbox";
import { Banco } from "@/types";
import { useCreateBancoMutation, useEditBancoMutation } from "@/hooks/banco";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { BancoSaldoTable } from "@/components/tables/banco-saldo-table";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z
    .string({ message: "Nombre requerido" })
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .max(100, {
      message: "El nombre no puede tener más de 100 caracteres",
    }),
  alias: z
    .string()
    .max(50, {
      message: "El alias no puede tener más de 50 caracteres",
    })
    .optional(),
  nroCuenta: z
    .string()
    .max(50, {
      message: "El número de cuenta no puede tener más de 50 caracteres",
    })
    .optional(),
  cbu: z
    .string()
    .max(22, {
      message: "El CBU no puede tener más de 22 caracteres",
    })
    .optional(),
  tna: z
    .string()
    .max(100, {
      message: "La TNA no puede tener más de 100 caracteres",
    })
    .optional(),
  incluirEnTotal: z.boolean().optional(),
});

type BancoFormProps = {
  data?: Banco;
  onSuccess?: () => void;
};

export default function BancoForm({ data, onSuccess }: BancoFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [logo, setLogo] = React.useState<File[]>([]);
  const { handleFileUpload } = useFileUploadHandler();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      alias: data?.alias || "",
      nroCuenta: data?.nroCuenta || "",
      cbu: data?.cbu || "",
      tna: data?.tna || "",
      incluirEnTotal: data?.incluirEnTotal ?? true,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateBancoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditBancoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let id;
      if (data?.id) {
        await edit({ id: data.id, data: values });
        id = data.id;
        toast({
          title: "Banco actualizado",
          description: "El banco se ha actualizado correctamente.",
        });
      } else {
        const response = await create(values);
        id = response.id;
        toast({
          title: "Banco creado",
          description: "El banco se ha creado correctamente.",
        });
      }

      // Subir archivo si existe
      if (id) {
        await handleFileUpload({
          fileId: data?.logo?.id,
          fileArray: logo,
          modelo: "banco",
          modeloId: id,
          tipo: "logo",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Ha ocurrido un error inesperado.",
        variant: "destructive",
      });
    }
  }

  const isPending = isPendingCreate || isPendingEdit;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto py-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Banco</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre del banco"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Nombre identificador del banco (máximo 100 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alias</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el alias"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Alias de la cuenta bancaria (máximo 50 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nroCuenta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Cuenta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el número de cuenta"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Número de cuenta bancaria (máximo 50 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cbu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CBU</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese el CBU" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Clave Bancaria Uniforme (máximo 22 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tna"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TNA (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese la TNA"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tasa Nominal Anual (ejemplo: 45.5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="incluirEnTotal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Incluir en total</FormLabel>
                <FormDescription>
                  Si está marcado, este banco será incluido en el cálculo del
                  total de bancos
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <ArchivosInput
          label="Logo del Banco"
          value={logo}
          setValue={(files) => setLogo(files || [])}
          defaultValue={data?.logo}
        />

        <div className="flex gap-2">
          <LoadingButton loading={isPending} type="submit">
            Guardar
          </LoadingButton>
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>

        {data?.id && (
          <>
            <div className="text-xl tracking-tight">Saldos del Banco</div>
            <BancoSaldoTable bancoId={data.id} />
          </>
        )}
      </form>
    </Form>
  );
}
