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
import { useCreateEquipamientoMutation, useEditEquipamientoMutation } from "@/hooks/equipamiento";
import { useRouter } from "next/navigation";
import type { Equipamiento } from "@/types";

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(1, "Requerido"),
  codigo: z.string().min(1, "Requerido"),
  tipo: z.enum(["computadoras", "herramientas", "maquinarias", "instalaciones", "mobiliarios", "insumos_informaticos"], { required_error: "Requerido" }),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  descripcion: z.string().optional(),
});

type EquipamientoFormProps = {
  data?: Equipamiento;
};

export default function EquipamientoForm({ data }: EquipamientoFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!data?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      codigo: data?.recurso?.codigo || "",
      tipo: data?.tipo || undefined,
      modelo: data?.modelo || "",
      numeroSerie: data?.numeroSerie || "",
      descripcion: data?.descripcion || "",
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateEquipamientoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditEquipamientoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values as Equipamiento);
      }
      toast({ description: "Operación exitosa", variant: "default" });
      router.push("/equipamiento");
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
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre descriptivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código *</FormLabel>
                <FormControl>
                  <Input placeholder="EQ-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <SelectItem value="computadoras">Computadoras</SelectItem>
                    <SelectItem value="herramientas">Herramientas</SelectItem>
                    <SelectItem value="maquinarias">Maquinarias</SelectItem>
                    <SelectItem value="instalaciones">Instalaciones</SelectItem>
                    <SelectItem value="mobiliarios">Mobiliarios</SelectItem>
                    <SelectItem value="insumos_informaticos">Insumos Informáticos</SelectItem>
                  </SelectContent>
                </Select>
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
            name="numeroSerie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Serie</FormLabel>
                <FormControl>
                  <Input placeholder="N° de serie" {...field} />
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
                <Textarea placeholder="Descripción del equipamiento" {...field} />
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
            onClick={() => router.push("/equipamiento")}
            variant="link"
          >
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
