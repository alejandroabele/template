"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { today } from "@/utils/date";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { useRouter } from "next/navigation";
import { Package, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContratoMarcoTalonario } from "@/types/index";
import { LoadingButton } from "@/components/ui/loading-button";
import { Label } from "@/components/ui/label";
import { RecetaSelector } from "@/components/selectors/receta-selector";
import { UnidadMedidaSelector } from "@/components/selectors/unidad-medida-selector";
import { InputMoney } from "@/components/input-money";
import {
  useCreateContratoMarcoTalonarioMutation,
  useEditContratoMarcoTalonarioMutation,
} from "@/hooks/contrato-marco-talonario";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

const itemSchema = z.object({
  codigo: z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido"),
  precio: z.string({
    required_error: "Requerido",
  }),
  recetaId: z.number().min(1, "Selecciona una receta"),
  receta: z.unknown(),
  unidadMedida: z.unknown().optional(),
});

const formSchema = z.object({
  id: z.number().optional(),
  fechaInicio: z.unknown({ required_error: "Requerido" }),
  fechaFin: z.unknown({ required_error: "Requerido" }),
  contratoMarcoId: z.number().min(1, "Selecciona un contrato"),
  contratoMarcoTalonarioId: z.number().optional(),
  items: z.array(itemSchema).min(1, "Agrega al menos un item"),
});

type FormValues = z.infer<typeof formSchema>;

type MyFormProps = {
  data?: ContratoMarcoTalonario;
  porcentaje?: string | null;
};

export default function MyForm({ data, porcentaje }: MyFormProps) {
  const [nuevoItem, setNuevoItem] = React.useState<z.infer<typeof itemSchema>>({
    codigo: "",
    descripcion: "",
    precio: "",
    recetaId: 0,
    receta: null,
    unidadMedida: "",
  });
  const [nuevoItemErrors, setNuevoItemErrors] = React.useState<
    Partial<Record<keyof typeof nuevoItem, string>>
  >({});

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContratoMarcoTalonarioMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContratoMarcoTalonarioMutation();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      fechaInicio: data?.fechaInicio || today(),
      fechaFin: data?.fechaFin || null,
      contratoMarcoId: data?.contratoMarcoId,
      items: data?.items || [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const dataToSend = form.getValues();
      if (porcentaje) {
        delete dataToSend.id; // Elimina el id si porcentaje está presente
        dataToSend.items = (dataToSend.items ?? []).map(({ id, ...rest }) => ({
          ...rest,
        }));
      }

      if (values?.id && !porcentaje) {
        await edit({ id: values?.id, data: dataToSend });
      } else {
        await create(dataToSend);
      }

      toast({ description: "Talonario guardado con éxito" });
      router.back();
    } catch (error) {
      toast({
        description: "Error al guardar talonario",
        variant: "destructive",
      });
    }
  }

  const agregarItem = async () => {
    const parsed = itemSchema.safeParse(nuevoItem);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setNuevoItemErrors({
        codigo: errors.codigo?.[0],
        descripcion: errors.descripcion?.[0],
        precio: errors.precio?.[0],
        recetaId: errors.recetaId?.[0],
      });
      return;
    }

    append(parsed.data);
    setNuevoItem({
      codigo: "",
      descripcion: "",
      precio: "",
      recetaId: 0,
      receta: null,
    });
    setNuevoItemErrors({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <DatePicker form={form} name="fechaInicio" label="Fecha Inicio" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <DatePicker
              disabled
              form={form}
              name="fechaFin"
              label="Fecha Fin"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Contrato Marco
              </Label>
              <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-200 rounded-md">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">
                  N° {data?.contratoMarco?.nroContrato} -{" "}
                  {data?.contratoMarco?.cliente?.nombre}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Items del Talonario</h2>
          {fields.length === 0 && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay items agregados</p>
              <p className="text-sm text-gray-400">
                Agrega el primer item usando el formulario de abajo
              </p>
            </div>
          )}

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 items-end border p-4 rounded-md"
            >
              <div className="col-span-12 md:col-span-1">
                <FormField
                  control={form.control}
                  name={`items.${index}.codigo`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: MED001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <FormField
                  control={form.control}
                  name={`items.${index}.descripcion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Descripción del item"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.precio`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <InputMoney {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormItem>
                  <FormLabel>Receta</FormLabel>
                  <RecetaSelector
                    value={item?.receta}
                    onChange={(receta) => {
                      const items = form.getValues("items");
                      const updated = items.map((it, i) => {
                        if (i !== index) return it;
                        return {
                          ...it,
                          recetaId: receta?.id || 0,
                          receta,
                        };
                      });
                      form.setValue("items", updated);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              </div>
              <div className="col-span-12 md:col-span-1">
                <FormField
                  control={form.control}
                  name={`items.${index}.unidadMedida`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sel.." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UN">UN</SelectItem>
                          <SelectItem value="M2">M2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-1 flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {/* Separador visual */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Agregar nuevo item
              </span>
            </div>
          </div>
          {/* NUEVO ITEM */}
          <div className="mt-6 border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 rounded-md">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-1">
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      value={nuevoItem.codigo}
                      onChange={(e) =>
                        setNuevoItem((prev) => ({
                          ...prev,
                          codigo: e.target.value,
                        }))
                      }
                      placeholder="Ej: MED001"
                    />
                  </FormControl>
                  {nuevoItemErrors.codigo && (
                    <FormMessage>{nuevoItemErrors.codigo}</FormMessage>
                  )}
                </FormItem>
              </div>

              <div className="col-span-12 md:col-span-3">
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      value={nuevoItem.descripcion}
                      onChange={(e) =>
                        setNuevoItem((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Descripción del item..."
                      className="bg-white resize-none"
                    />
                  </FormControl>
                  {nuevoItemErrors.descripcion && (
                    <FormMessage>{nuevoItemErrors.descripcion}</FormMessage>
                  )}
                </FormItem>
              </div>

              <div className="col-span-12 md:col-span-2">
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <InputMoney
                      value={nuevoItem.precio}
                      onChange={(value) =>
                        setNuevoItem((prev) => ({ ...prev, precio: value }))
                      }
                      className="w-full"
                    />
                  </FormControl>
                  {nuevoItemErrors.precio && (
                    <FormMessage>{nuevoItemErrors.precio}</FormMessage>
                  )}
                </FormItem>
              </div>

              <div className="col-span-12 md:col-span-4">
                <FormItem>
                  <FormLabel>Receta</FormLabel>
                  <RecetaSelector
                    value={nuevoItem.receta}
                    onChange={(receta) =>
                      setNuevoItem((prev) => ({
                        ...prev,
                        receta,
                        recetaId: receta?.id || 0,
                      }))
                    }
                  />
                  {nuevoItemErrors.recetaId && (
                    <FormMessage>{nuevoItemErrors.recetaId}</FormMessage>
                  )}
                </FormItem>
              </div>
              <div className="col-span-12 md:col-span-1">
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <Select
                    value={nuevoItem.unidadMedida}
                    onValueChange={(value) =>
                      setNuevoItem((prev) => ({ ...prev, unidadMedida: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Valor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN</SelectItem>
                      <SelectItem value="M2">M2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="col-span-12 md:col-span-1 flex items-end">
                <Button
                  type="button"
                  onClick={agregarItem}
                  className="w-full"
                  variant="outline"
                >
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-6 border-t border-gray-200">
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
}
