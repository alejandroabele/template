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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from "@/types";
import { useFileUploadHandler } from "@/hooks/file-upload";
import React from "react";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import {
  useCreateClientMutation,
  useEditClientMutation,
} from "@/hooks/clientes";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ message: "Requerido" }),
  razonSocial: z.string({ message: "Requerido" }),
  cuit: z.string({ message: "Requerido" }),
  email: z.string({ message: "Requerido" }),
  direccion: z.string({ message: "Requerido" }),
  direccionFiscal: z.string({ message: "Requerido" }),
  ciudad: z.string({ message: "Requerido" }),
  codigoPostal: z
    .string({ message: "El código postal es requerido" })
    .min(2, { message: "El código postal debe tener al menos 2 caracteres" })
    .max(6, { message: "El código postal no puede tener más de 6 caracteres" }),
  contacto: z.string({ message: "Requerido" }),
  formaDePago: z.string({ message: "Requerido" }),
  telefono: z
    .string()
    .regex(
      /^\+?[0-9\s-]+$/,
      "El teléfono solo puede contener un '+' al inicio, números, espacios y guiones"
    ),
  telefonoContacto: z
    .string()
    .regex(
      /^\+?[0-9\s-]+$/,
      "El teléfono de contacto solo puede contener un '+' al inicio, números, espacios y guiones"
    ),
  detalles: z.string().optional(),
  emailPagoProveedores: z.string().optional(),
  nombreContactoPagoProveedores: z.string().optional(),
  telefonoPagoProveedores: z.string().optional(),
});

type MyFormProps = {
  data?: Cliente;
};

export default function MyForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [logo, setLogo] = React.useState<File[]>([]);
  const { handleFileUpload } = useFileUploadHandler();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || 0,
      nombre: data?.nombre || "",
      email: data?.email || "",
      direccion: data?.direccion || "",
      ciudad: data?.ciudad || "",
      codigoPostal: data?.codigoPostal || "",
      telefono: data?.telefono || "",
      contacto: data?.contacto || "",
      razonSocial: data?.razonSocial || "",
      cuit: data?.cuit || "",
      direccionFiscal: data?.direccionFiscal || "",
      telefonoContacto: data?.telefonoContacto || "",
      formaDePago: data?.formaDePago || "",
      detalles: data?.detalles || "",
      emailPagoProveedores: data?.emailPagoProveedores || "",
      nombreContactoPagoProveedores: data?.nombreContactoPagoProveedores || "",
      telefonoPagoProveedores: data?.telefonoPagoProveedores || "",
    },
  });

  const { mutateAsync: create, isPending: createLoading } =
    useCreateClientMutation();
  const { mutateAsync: edit, isPending: editLoading } = useEditClientMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let id;
      if (values.id) {
        await edit({ id: values.id, data: values });
        id = values.id;
      } else {
        const response = await create(values);
        id = response.id;
      }

      if (id && logo.length > 0) {
        await handleFileUpload({
          fileId: data?.logo?.id,
          fileArray: logo,
          modelo: "cliente",
          modeloId: id,
          tipo: "logo",
        });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto py-10"
      >
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contacto">Contacto</TabsTrigger>
          </TabsList>

          {/* ── Tab: General ── */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información general</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>
                      <FormDescription>Nombre del cliente</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razon Social</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="" {...field} />
                      </FormControl>
                      <FormDescription>Nombre de la razon Social</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="cuit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nro CUIT</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>
                      <FormDescription>Este el numero de CUIT</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electronico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="correo@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direccion</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calle falsa 1234"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Dirección de la razon social / empresa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="direccionFiscal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección Fiscal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calle falsa 1234"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Direccion Inscripta en AFIP</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Neuquén" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="codigoPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codigo Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="8300" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="contacto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Perez" type="text" {...field} />
                      </FormControl>
                      <FormDescription>Contacto para comunicarse</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="formaDePago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pago</FormLabel>
                      <FormControl>
                        <Input placeholder="FF 30" type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        Transferencia, Cheque, Fecha de factura
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Telefono</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder="299-4 444-44"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Telefono de la empresa</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="telefonoContacto"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Telefono de contacto</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder="299-4 444-44"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Teléfono de la persona de contacto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="detalles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ArchivosInput
              label="Logo del Cliente"
              value={logo}
              setValue={(files) => setLogo(files || [])}
              defaultValue={data?.logo}
            />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab: Contacto ── */}
          <TabsContent value="contacto">
            <Card>
              <CardHeader>
                <CardTitle>Contacto pago proveedores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name="nombreContactoPagoProveedores"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre contacto pago proveedores</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Perez" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Persona de contacto para gestionar pagos a proveedores
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name="emailPagoProveedores"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo pago proveedores</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="pagos@empresa.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Correo al que se envían los documentos de cobro
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name="telefonoPagoProveedores"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono pago proveedores</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+54 9 11 1234-5678"
                              type="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            WhatsApp para gestiones de cobro a proveedores
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <LoadingButton type="submit" loading={createLoading || editLoading}>
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
