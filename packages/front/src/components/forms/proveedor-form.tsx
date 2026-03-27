"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
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
import { Proveedor } from "@/types"; // Asegúrate de tener este tipo o definirlo como corresponde
import {
  useCreateProveedorMutation,
  useEditProveedorMutation,
} from "@/hooks/proveedor"; // Hooks necesarios para tu aplicación
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { CondicionIVASelector } from "../selectors/condicion-iva-selector";
import { ProveedorRubroSelector } from "../selectors/proveedor-rubro-selector";
import { InputCuitValidate } from "@/components/ui/input-cuit-validate";
import { PadronData } from "@/types";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { useFileUploadHandler } from "@/hooks/file-upload";
import React from "react";

// Definición del esquema de validación usando Zod
const formSchema = z.object({
  id: z.number().optional(),
  // codigo: z.string().min(2, { message: "El código es requerido" }),
  cuit: z
    .string()
    .min(11, { message: "El CUIT es requerido y debe ser de 11 caracteres" }),
  razonSocial: z.string().min(2, { message: "La razón social es requerida" }),
  nombreFantasia: z.string().optional(),
  domicilio: z.string().min(2, { message: "El domicilio es requerido" }),
  localidad: z.string().min(2, { message: "La localidad es requerida" }),
  telefonoContacto1: z
    .string()
    .min(2, { message: "El teléfono de contacto es requerido" }),
  telefonoContacto2: z.string().optional(),
  email: z.string().email({ message: "El email no es válido" }),
  numeroIngresosBrutos: z.string().optional(),
  notas: z.string().optional(),
  condicionFrenteIva: z
    .string()
    .min(1, { message: "La condición frente al IVA es requerida" }),
  proveedorRubroId: z.unknown({
    message: "El rubro del proveedor es requerido",
  }),
  web: z
    .string()
    .url({ message: "La URL no es válida" })
    .optional()
    .or(z.literal("")),
  contactoCobranzasNombre: z.string().optional(),
  contactoCobranzasEmail: z
    .string()
    .email({ message: "El email no es válido" })
    .optional()
    .or(z.literal("")),
  contactoCobranzasTelefono: z.string().optional(),
});

type MyFormProps = {
  data?: Proveedor; // Datos para editar si se proporciona
};

export default function ProveedorForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [legajo, setLegajo] = React.useState<File[]>([]);
  const { handleFileUpload } = useFileUploadHandler();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      //   codigo: data?.codigo || "",
      cuit: data?.cuit || "",
      razonSocial: data?.razonSocial || "",
      nombreFantasia: data?.nombreFantasia || "",
      domicilio: data?.domicilio || "",
      localidad: data?.localidad || "",
      telefonoContacto1: data?.telefonoContacto1 || "",
      telefonoContacto2: data?.telefonoContacto2 || "",
      email: data?.email || "",
      numeroIngresosBrutos: data?.numeroIngresosBrutos || "",
      notas: data?.notas || "",
      condicionFrenteIva: data?.condicionFrenteIva || "",
      proveedorRubroId: data?.proveedorRubroId || null,
      web: data?.web || "",
      contactoCobranzasNombre: data?.contactoCobranzasNombre || "",
      contactoCobranzasEmail: data?.contactoCobranzasEmail || "",
      contactoCobranzasTelefono: data?.contactoCobranzasTelefono || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateProveedorMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditProveedorMutation();

  // Función para manejar los datos validados de AFIP
  const handleCuitValidation = (data: PadronData) => {
    // Autocompletar campos con los datos de AFIP
    if (data.razonSocial) {
      form.setValue("razonSocial", data.razonSocial);
    }
    if (data.domicilio) {
      form.setValue("domicilio", data.domicilio);
    }
    if (data.localidad) {
      form.setValue("localidad", data.localidad);
    }
    if (data.condicionFrenteIva) {
      form.setValue("condicionFrenteIva", data.condicionFrenteIva);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let id: number | undefined;
      if (values.id) {
        await edit({ id: values.id, data: values as Proveedor });
        id = values.id;
      } else {
        const response = await create(values as Proveedor);
        id = response?.id;
      }

      // Subir archivo de legajo si existe
      if (id && legajo.length > 0) {
        await handleFileUpload({
          fileId: data?.legajo?.id,
          fileArray: legajo,
          modelo: "proveedor",
          modeloId: id,
          tipo: "legajo",
        });
      }

      toast({
        description: "Éxito al realizar la operación",
        variant: "default",
      });
      router.back();
    } catch (error) {
      console.error("Error al enviar el formulario", error);
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
        className="space-y-8 mx-auto py-10"
      >
        {/* Contenedor de las dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          {/* <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* CUIT */}
          <FormField
            control={form.control}
            name="cuit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT</FormLabel>
                <FormControl>
                  <InputCuitValidate
                    value={field.value}
                    onChange={field.onChange}
                    onInputValidate={handleCuitValidation}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Razón Social */}
          <FormField
            control={form.control}
            name="razonSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input placeholder="Razón social del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre Fantasía */}
          <FormField
            control={form.control}
            name="nombreFantasia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Fantasía</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre fantasía del proveedor (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Domicilio */}
          <FormField
            control={form.control}
            name="domicilio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domicilio</FormLabel>
                <FormControl>
                  <Input placeholder="Domicilio del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Localidad */}
          <FormField
            control={form.control}
            name="localidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <Input placeholder="Localidad del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfonos */}
          <FormField
            control={form.control}
            name="telefonoContacto1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Teléfono de contacto principal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono 2 */}
          <FormField
            control={form.control}
            name="telefonoContacto2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Teléfono de contacto secundario (opcional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email del proveedor"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ingresos Brutos */}
          <FormField
            control={form.control}
            name="numeroIngresosBrutos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Ingresos Brutos</FormLabel>
                <FormControl>
                  <Input placeholder="Número de Ingresos Brutos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Condición frente al IVA */}
          <FormField
            control={form.control}
            name="condicionFrenteIva"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Condición frente al IVA</FormLabel>
                  <CondicionIVASelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="proveedorRubroId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rubro del Proveedor</FormLabel>
                <ProveedorRubroSelector
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Página Web */}
          <FormField
            control={form.control}
            name="web"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Página Web</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contacto de Cobranzas - Nombre */}
          <FormField
            control={form.control}
            name="contactoCobranzasNombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Contacto de Cobranzas</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del contacto de cobranzas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contacto de Cobranzas - Email */}
          <FormField
            control={form.control}
            name="contactoCobranzasEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Contacto de Cobranzas</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contacto de Cobranzas - Teléfono */}
          <FormField
            control={form.control}
            name="contactoCobranzasTelefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Contacto de Cobranzas</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Teléfono del contacto de cobranzas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  Podes usar este espacio para almacenar informacion adicional
                  de los alquileres
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Legajo del Proveedor */}
          <div>
            <ArchivosInput
              label="Legajo del Proveedor"
              variant="compact"
              value={legajo}
              setValue={(files) => setLegajo(files || [])}
              defaultValue={data?.legajo}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            type="submit"
          >
            Guardar
          </LoadingButton>
          <Button type="button" onClick={() => router.back()} variant="link">
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
