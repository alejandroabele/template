"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMemo } from "react";
import { PROCESO_GENERAL } from "@/constants/presupuesto";
import { CONTRATO_MARCO_PRESUPUESTO } from "@/constants/contrato-marco";
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
import { Textarea } from "@/components/ui/textarea";
import { ContratoMarco, ContratoMarcoPresupuesto } from "@/types";
import { useStore } from "@/lib/store";
import { Currency } from "@/components/ui/currency";
import {
  useCreateContratoMarcoPresupuestoMutation,
  useEditContratoMarcoPresupuestoMutation,
} from "@/hooks/contrato-marco-presupuesto";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { today } from "@/utils/date";

/* ------------ Schema relajado (todo unknown) ------------ */
const contratoMarcoPresupuestoItemSchema = z.object({
  id: z.unknown().optional(),
  cantidad: z.unknown().optional(),
  alto: z.unknown().optional(),
  ancho: z.unknown().optional(),
  contratoMarcoTalonarioItemId: z.unknown().optional(),
  contratoMarcoTalonarioItem: z.unknown().optional(),
  deletedAt: z.unknown().optional(),
});

const presupuestoItemBaseSchema = z.object({
  id: z.unknown().optional(),
  descripcion: z.unknown().optional(),
  cantidad: z.unknown().optional(),
  detalles: z.unknown().optional(),
  recetaId: z.unknown().optional(),
  contratoMarcoPresupuestoItems: z
    .array(contratoMarcoPresupuestoItemSchema)
    .default([]),
  deletedAt: z.unknown().optional(),
});

const formSchema = z.object({
  id: z.unknown().optional(),
  presupuesto: z.object({
    id: z.unknown().optional(),
    descripcionCorta: z.unknown().optional(),
    fechaEntregaEstimada: z.unknown().optional(),
    fecha: z.unknown().optional(),
    areaId: z.unknown().optional(),
    procesoGeneralId: z.unknown().optional(),
    clienteId: z.unknown().optional(),
    comprador: z.unknown().optional(),
    vendedorId: z.unknown().optional(),
    taxTransfComision: z.unknown().optional(),
    taxGananciasComision: z.unknown().optional(),
    taxIngresosComision: z.unknown().optional(),
    vendedorComision: z.unknown().optional(),
    estructuraComision: z.unknown().optional(),
    items: z.array(presupuestoItemBaseSchema).default([]),
  }),
  tipo: z.unknown(),
  estado: z.unknown(),
  contratoMarcoId: z.unknown(),
  servicios: z.array(z.unknown()).optional(),
});

type MyFormProps = {
  data?: ContratoMarcoPresupuesto;
  contratoMarco: ContratoMarco;
};

const SERVICIOS = [
  { id: 6, nombre: "Montaje" },
  { id: 7, nombre: "Servicio Petrolero" },
  { id: 8, nombre: "Obra" },
];

export default function MyForm({ data, contratoMarco }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useStore();

  const talonarioActual = data?.contratoMarco?.talonarios?.find(
    (t) => !t.fechaFin
  );

  // Combinar items del talonario actual + items que están en uso en el presupuesto
  const talonarioItems = useMemo(() => {
    const itemsActuales = talonarioActual?.items ?? [];

    console.log(
      "📦 Items del talonario actual:",
      itemsActuales.length,
      itemsActuales.map((i) => i.id)
    );

    // Crear un Map con todos los items (actuales primero)
    const itemsMap = new Map<
      number,
      (typeof itemsActuales)[0] & { _esHistorico?: boolean }
    >();

    // Agregar items del talonario actual
    itemsActuales.forEach((item) => {
      if (item?.id) {
        console.log("➕ Agregando item actual:", item.id, item.descripcion);
        itemsMap.set(item.id, item);
      }
    });

    // Agregar items que están en uso en el presupuesto (solo si no están ya en el talonario actual)
    data?.presupuesto?.items?.forEach((item, idx) => {
      console.log(
        `🔍 Revisando presupuesto item ${idx}:`,
        item.contratoMarcoPresupuestoItems?.length,
        "sub-items"
      );
      item.contratoMarcoPresupuestoItems?.forEach((cmpItem) => {
        const itemEnUso = cmpItem?.contratoMarcoTalonarioItem;
        const itemId = itemEnUso?.id;

        console.log(
          "  - Sub-item ID:",
          itemId,
          "ya existe?",
          itemsMap.has(itemId ?? -1)
        );

        // Solo agregar si el item existe y NO está ya en el Map
        if (itemEnUso && itemId && !itemsMap.has(itemId)) {
          console.log(
            "  ✅ Agregando histórico:",
            itemId,
            itemEnUso.descripcion
          );
          itemsMap.set(itemId, {
            ...itemEnUso,
            _esHistorico: true, // Marcar como histórico
          });
        }
      });
    });

    // Retornar array de items únicos (verificar que no haya duplicados)
    const resultado = Array.from(itemsMap.values());
    const idsUnicos = new Set(resultado.map((i) => i.id));

    console.log("📊 Resultado final:", resultado.length, "items");
    console.log("📊 IDs únicos:", Array.from(idsUnicos));

    if (idsUnicos.size !== resultado.length) {
      console.error("⚠️ Se detectaron IDs duplicados en talonarioItems");
      console.error(
        "IDs:",
        resultado.map((i) => i.id)
      );
    }

    return resultado;
  }, [talonarioActual?.items, data?.presupuesto?.items]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id ?? undefined,
      tipo: "servicio",
      estado: data?.estado || "nuevo",
      contratoMarcoId: contratoMarco?.id,
      presupuesto: {
        id: data?.presupuesto?.id ?? undefined,
        descripcionCorta: data?.presupuesto?.descripcionCorta ?? "",
        fechaEntregaEstimada: data?.presupuesto?.fechaEntregaEstimada ?? "",
        fecha: data?.presupuesto?.fecha ?? today(),
        areaId: data?.presupuesto?.areaId ?? 16,
        procesoGeneralId:
          data?.presupuesto?.procesoGeneralId ??
          PROCESO_GENERAL.ENVIADO_A_SERVICIO,
        clienteId: contratoMarco?.cliente?.id ?? undefined,
        comprador: contratoMarco?.cliente?.contacto ?? "",
        vendedorId: data?.presupuesto?.vendedorId ?? user?.userId,
        taxTransfComision: data?.presupuesto?.taxTransfComision ?? 1.2,
        taxGananciasComision: data?.presupuesto?.taxGananciasComision ?? 20,
        taxIngresosComision: data?.presupuesto?.taxIngresosComision ?? 3,
        vendedorComision: data?.presupuesto?.vendedorComision ?? 2,
        estructuraComision: data?.presupuesto?.estructuraComision ?? 7,
        items:
          data?.presupuesto?.items?.map((item) => ({
            id: item.id ?? undefined,
            descripcion: item.descripcion ?? "",
            cantidad: item.cantidad ?? "",
            detalles: item.detalles ?? "",
            recetaId: item.recetaId ?? undefined,
            contratoMarcoPresupuestoItems:
              item.contratoMarcoPresupuestoItems?.map((cmi) => ({
                id: cmi.id ?? undefined,
                cantidad: cmi.cantidad ?? "",
                alto: cmi.alto ?? "",
                ancho: cmi.ancho ?? "",
                contratoMarcoTalonarioItemId:
                  cmi.contratoMarcoTalonarioItemId ?? undefined,
                contratoMarcoTalonarioItem:
                  cmi.contratoMarcoTalonarioItem ?? {},
              })) ?? [],
          })) ?? [],
      },
      servicios: data?.servicios ?? [],
    },
  });

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "presupuesto.items",
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContratoMarcoPresupuestoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContratoMarcoPresupuestoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await edit({ id: values.id, data: values });
      } else {
        await create(values);
      }
      toast({ description: "Éxito al realizar la operación" });
      router.back();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }

  function onError(errors: any) {
    console.error("❌ Validation errors:", errors);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8 mx-auto py-10"
      >
        {/* Fecha */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <DatePicker
              label="Fecha entrega P."
              form={form}
              name="presupuesto.fechaEntregaEstimada"
              fromYear={2020}
            />
          </div>

          {/* Servicios */}
          <div className="col-span-12 md:col-span-12 border p-4 rounded-md">
            <FormField
              control={form.control}
              name="servicios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-4 block">
                    Servicios a realizar
                  </FormLabel>
                  <div className="flex flex-col gap-2">
                    {SERVICIOS.map((servicio) => (
                      <FormItem
                        key={servicio.id}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(servicio.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([
                                  ...(field.value || []),
                                  servicio.id,
                                ]);
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (id) => id !== servicio.id
                                  )
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {servicio.nombre}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Items */}
          {data?.id &&
            [
              CONTRATO_MARCO_PRESUPUESTO.ESTADO.VALORIZACION,
              CONTRATO_MARCO_PRESUPUESTO.ESTADO.FINALIZADO,
            ].includes(data.estado) && (
              <div className="col-span-12 mt-4 border rounded-md bg-white py-2">
                <FormLabel className="block p-4 py-2 text-sm font-medium text-gray-900">
                  Ítems del Presupuesto
                </FormLabel>
                <div className="divide-y divide-gray-100">
                  {talonarioItems?.map((talonarioItem) => {
                    const existingIndex = itemFields.findIndex(
                      (f) =>
                        f.contratoMarcoPresupuestoItems?.[0]
                          ?.contratoMarcoTalonarioItemId === talonarioItem.id
                    );
                    return (
                      <div key={talonarioItem.id} className="px-4 py-1">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Checkbox */}
                          <div className="col-span-1 flex items-center">
                            <Checkbox
                              checked={existingIndex !== -1}
                              disabled={talonarioItem._esHistorico}
                              onCheckedChange={(checked) => {
                                if (checked && existingIndex === -1) {
                                  append({
                                    descripcion:
                                      talonarioItem.descripcion ?? "",
                                    cantidad: "",
                                    detalles:
                                      "CÓDIGO " + (talonarioItem.codigo ?? ""),
                                    recetaId:
                                      talonarioItem.recetaId ?? undefined,
                                    contratoMarcoPresupuestoItems: [
                                      {
                                        contratoMarcoTalonarioItemId:
                                          talonarioItem.id,
                                        contratoMarcoTalonarioItem:
                                          talonarioItem ?? {},
                                        cantidad: "",
                                        alto: "",
                                        ancho: "",
                                      },
                                    ],
                                  });
                                }
                                if (!checked && existingIndex !== -1) {
                                  remove(existingIndex);
                                }
                              }}
                            />
                          </div>
                          {/* Código */}
                          <div className="col-span-2">
                            <span className="text-xs font-mono font-bold">
                              {talonarioItem.codigo}
                            </span>
                            {talonarioItem._esHistorico && (
                              <span className="ml-2 text-xs text-orange-600 font-medium">
                                (Talonario anterior)
                              </span>
                            )}
                          </div>
                          {/* Descripción */}
                          <div className="col-span-3">
                            <span className="text-sm text-gray-700">
                              {talonarioItem.descripcion}
                            </span>
                          </div>
                          {/* Unidad */}
                          <div className="col-span-1">
                            <span className="text-sm text-gray-700">
                              {talonarioItem.unidadMedida}
                            </span>
                          </div>
                          {/* Precio */}
                          <div className="col-span-2">
                            <span className="text-sm font-medium text-emerald-600">
                              <Currency>{talonarioItem.precio}</Currency>
                            </span>
                          </div>
                          {/* Cantidad */}
                          <div className="col-span-3">
                            {existingIndex !== -1 && (
                              <FormField
                                control={form.control}
                                name={`presupuesto.items.${existingIndex}.cantidad`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="0"
                                        className="h-8 text-center text-sm border-gray-200"
                                        disabled={talonarioItem._esHistorico}
                                        onInput={(e) => {
                                          e.currentTarget.value =
                                            e.currentTarget.value
                                              .replace(/[^0-9.,]/g, "")
                                              .replace(",", ".");
                                          field.onChange(e.currentTarget.value);
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Descripción corta */}
          <div className="col-span-12 md:col-span-12 space-y-2">
            <FormField
              control={form.control}
              name="presupuesto.descripcionCorta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Podes usar este espacio para una breve descripción del
                    presupuesto
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
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
