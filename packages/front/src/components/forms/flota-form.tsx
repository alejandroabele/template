"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { useCreateFlotaMutation, useEditFlotaMutation } from "@/hooks/flota";
import { useRouter } from "next/navigation";
import type { Flota } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "Requerido"),
  tipo: z.enum(["pickup", "camion", "auto"], { required_error: "Requerido" }),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anio: z.string().optional(),
  patente: z.string().optional(),
  vin: z.string().optional(),
  kilometraje: z.string().optional(),
  capacidadKg: z.string().optional(),
  cantidadEjes: z.string().optional(),
  cantidadAuxilio: z.string().optional(),
  descripcion: z.string().optional(),
});

type FlotaFormProps = {
  data?: Flota;
};

export default function FlotaForm({ data }: FlotaFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!data?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      codigo: data?.recurso?.codigo || "",
      tipo: data?.tipo || undefined,
      marca: data?.marca || "",
      modelo: data?.modelo || "",
      anio: data?.anio || "",
      patente: data?.patente || "",
      vin: data?.vin || "",
      kilometraje: data?.kilometraje || "",
      capacidadKg: data?.capacidadKg || "",
      cantidadEjes: data?.cantidadEjes || "",
      cantidadAuxilio: data?.cantidadAuxilio || "",
      descripcion: data?.descripcion || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateFlotaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditFlotaMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values as Flota);
      }
      toast({ description: "Operación exitosa", variant: "default" });
      router.push("/flota");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código *</FormLabel>
                <FormControl>
                  <Input placeholder="Código del vehículo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pickup">Pick-up</SelectItem>
                    <SelectItem value="camion">Camión</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Marca" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Modelo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año</FormLabel>
                <FormControl>
                  <Input placeholder="Año" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patente</FormLabel>
                <FormControl>
                  <Input placeholder="Patente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN</FormLabel>
                <FormControl>
                  <Input placeholder="VIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kilometraje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilometraje</FormLabel>
                <FormControl>
                  <Input placeholder="Km" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacidadKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="Capacidad en kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cantidadEjes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de ejes</FormLabel>
                <FormControl>
                  <Input placeholder="Ejes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cantidadAuxilio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de auxilio</FormLabel>
                <FormControl>
                  <Input placeholder="Auxilio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del vehículo" {...field} />
              </FormControl>
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
          <Button
            type="button"
            onClick={() => router.push("/flota")}
            variant="link"
          >
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
