"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Persona } from "@/types";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { WebcamCapture } from "@/components/form-helpers/webcam-capture";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { useState, useEffect } from "react";
import { useDownloadArchivoByIdMutation } from "@/hooks/archivo";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z
    .string({ message: "Requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z
    .string({ message: "Requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z
    .string({ message: "Requerido" })
    .min(7, "El DNI debe tener al menos 7 caracteres"),
  fechaNacimiento: z.unknown().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .optional()
    .or(z.literal("")),
});

import {
  useCreatePersonaMutation,
  useEditPersonaMutation,
} from "@/hooks/persona";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

type MyFormProps = {
  data?: Persona;
};

export default function PersonasForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const { handleFileUpload } = useFileUploadHandler();
  const { mutateAsync: downloadArchivo } = useDownloadArchivoByIdMutation();

  // Cargar foto existente si hay una
  useEffect(() => {
    const loadFoto = async () => {
      if (data?.fotoArchivo?.id) {
        try {
          const blob = await downloadArchivo({ id: data.fotoArchivo.id });
          const imageUrl = URL.createObjectURL(blob);
          setFotoCapturada(imageUrl);
        } catch (error) {
          console.error("Error al cargar la foto:", error);
        }
      }
    };
    loadFoto();
  }, [data?.fotoArchivo?.id, downloadArchivo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      apellido: data?.apellido || "",
      dni: data?.dni || "",
      fechaNacimiento: data?.fechaNacimiento || "",
      telefono: data?.telefono || "",
      direccion: data?.direccion || "",
      email: data?.email || "",
    },
  });

  // Calcular edad a partir de la fecha de nacimiento
  const calcularEdad = (
    fechaNacimiento: string | null | undefined
  ): number | null => {
    if (!fechaNacimiento) return null;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const fechaNacimiento = form.watch("fechaNacimiento") as string | undefined;
  const edad = calcularEdad(fechaNacimiento);

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreatePersonaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditPersonaMutation();

  // Función para convertir dataURL a File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    // Verificar si es un dataURL (base64) o una URL normal
    if (!dataurl.startsWith("data:")) {
      throw new Error("Solo se pueden convertir dataURLs base64");
    }

    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const uploadFoto = async (personaId: number) => {
    // Verificar si es una nueva foto capturada (base64) o un blob URL existente
    const esNuevaFoto = fotoCapturada?.startsWith("data:");

    if (fotoCapturada && esNuevaFoto) {
      // Es una nueva foto capturada (base64)
      const fotoFile = dataURLtoFile(
        fotoCapturada,
        `persona_${personaId}_foto.png`
      );
      await handleFileUpload({
        fileId: data?.fotoArchivo?.id,
        fileArray: [fotoFile],
        modelo: "persona",
        modeloId: personaId,
        tipo: "foto",
      });
    } else if (!fotoCapturada && data?.fotoArchivo?.id) {
      // Si no hay foto capturada pero había una foto anterior, eliminarla
      await handleFileUpload({
        fileId: data.fotoArchivo.id,
        fileArray: [],
        modelo: "persona",
        modeloId: personaId,
        tipo: "foto",
      });
    }
    // Si fotoCapturada es un blob URL (empieza con 'blob:'), no hacemos nada porque es la foto existente
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let personaId: number;
      if (values.id) {
        await edit({ id: values.id, data: values });
        personaId = values.id;
      } else {
        const result = await create(values);
        personaId = result.id;
      }

      // Subir la foto si existe
      await uploadFoto(personaId);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-2">
        <div className="grid gap-6">
          {/* Sección: Foto de Perfil y Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
                {/* Foto a la izquierda */}
                <div>
                  <WebcamCapture
                    value={fotoCapturada}
                    onChange={setFotoCapturada}
                  />
                </div>

                {/* Información Personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345678"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <DatePicker
                        label="Fecha de Nacimiento"
                        form={form}
                        name="fechaNacimiento"
                        fromYear={1920}
                      />
                    </div>

                    {edad !== null && (
                      <div className="space-y-2">
                        <FormLabel>Edad</FormLabel>
                        <div className="text-sm font-medium p-2 bg-muted rounded-md h-10 flex items-center justify-center">
                          {edad} años
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+54 9 11 1234-5678"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@ejemplo.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calle 123, Ciudad"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-3">
            <LoadingButton
              loading={isPendingCreate || isPendingEdit}
              type="submit"
            >
              Guardar
            </LoadingButton>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
