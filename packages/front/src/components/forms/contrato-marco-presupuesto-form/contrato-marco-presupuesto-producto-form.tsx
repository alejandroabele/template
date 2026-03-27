"use client";

import type React from "react";
import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileText,
  Package,
  Settings,
  AlertCircle,
  DollarSign,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

import { PROCESO_GENERAL } from "@/constants/presupuesto";
import type { ContratoMarco, ContratoMarcoPresupuesto } from "@/types";
import {
  useCreateContratoMarcoPresupuestoMutation,
  useEditContratoMarcoPresupuestoMutation,
} from "@/hooks/contrato-marco-presupuesto";
import { today } from "@/utils/date";
import { getTodayDateTime } from "@/utils/date";
import { DeleteDialog } from "@/components/ui/delete-dialog";

/** ------------------ Schema ------------------ */
const contratoMarcoPresupuestoItemSchema = z.object({
  id: z.unknown().optional(),
  cantidad: z.unknown().optional(),
  alto: z.string().optional(),
  ancho: z.string().optional(),
  contratoMarcoTalonarioItemId: z.number().optional(),
  contratoMarcoTalonarioItem: z.unknown().optional(),
  deletedAt: z.unknown().optional(),
});

const presupuestoItemBaseSchema = z.object({
  id: z.number().optional(),
  descripcion: z.string().min(1, "Requerido"),
  cantidad: z.unknown().optional(),
  contratoMarcoPresupuestoItems: z
    .array(contratoMarcoPresupuestoItemSchema)
    .default([]),
  deletedAt: z.unknown().optional(),
});

const formSchema = z.object({
  id: z.number().optional(),
  presupuesto: z.object({
    id: z.unknown().optional(),
    descripcionCorta: z.string().min(1, "La descripción es requerida"),
    fechaEntregaEstimada: z.string().min(1, "La fecha de entrega es requerida"),
    fecha: z.unknown().optional(),
    areaId: z.unknown(),
    procesoGeneralId: z.unknown(),
    clienteId: z.unknown(),
    comprador: z.unknown(),
    vendedorId: z.unknown(),
    taxTransfComision: z.unknown().optional(),
    taxGananciasComision: z.unknown().optional(),
    taxIngresosComision: z.unknown().optional(),
    vendedorComision: z.unknown().optional(),
    estructuraComision: z.unknown().optional(),
    items: z.array(presupuestoItemBaseSchema).default([]),
  }),
  tipo: z.string(),
  estado: z.string(),
  contratoMarcoId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

type MyFormProps = {
  data?: ContratoMarcoPresupuesto;
  contratoMarco: ContratoMarco;
};

export default function MyForm({ data, contratoMarco }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useStore();

  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isItemsOpen, setIsItemsOpen] = useState(true);

  const talonarioActual = useMemo(
    () => contratoMarco?.talonarios?.find((t) => !t.fechaFin),
    [contratoMarco?.talonarios]
  );

  // Combinar items del talonario actual + items que están en uso en el presupuesto
  const talonarioItems = useMemo(() => {
    const itemsActuales = talonarioActual?.items ?? [];

    // Crear un Map con todos los items (actuales primero)
    const itemsMap = new Map<
      number,
      (typeof itemsActuales)[0] & { _esHistorico?: boolean }
    >();

    // Agregar items del talonario actual
    itemsActuales.forEach((item) => {
      itemsMap.set(item.id, item);
    });

    // Agregar items que están en uso en el presupuesto (solo si no están ya en el talonario actual)
    data?.presupuesto?.items?.forEach((item) => {
      item.contratoMarcoPresupuestoItems?.forEach((cmpItem) => {
        const itemEnUso = cmpItem?.contratoMarcoTalonarioItem;
        const itemId = itemEnUso?.id;

        // Solo agregar si el item existe y NO está ya en el Map
        if (itemEnUso && itemId && !itemsMap.has(itemId)) {
          itemsMap.set(itemId, {
            ...itemEnUso,
            _esHistorico: true, // Marcar como histórico
          });
        }
      });
    });

    // Retornar array de items únicos
    return Array.from(itemsMap.values());
  }, [talonarioActual?.items, data?.presupuesto?.items]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      tipo: data?.tipo || "producto",
      estado: data?.estado || "nuevo",
      contratoMarcoId: contratoMarco?.id,
      presupuesto: {
        id: data?.presupuesto?.id ?? null,
        descripcionCorta: data?.presupuesto?.descripcionCorta ?? "",
        fechaEntregaEstimada: data?.presupuesto?.fechaEntregaEstimada ?? "",
        fecha: data?.presupuesto?.fecha ?? today(),
        areaId: data?.presupuesto?.areaId ?? 16,
        procesoGeneralId:
          data?.presupuesto?.procesoGeneralId ??
          PROCESO_GENERAL.COSTEO_COMERCIAL,
        clienteId: contratoMarco?.cliente?.id,
        comprador: contratoMarco?.cliente?.contacto,
        vendedorId: data?.presupuesto?.vendedorId ?? user?.userId,
        taxTransfComision: data?.presupuesto?.taxTransfComision ?? 1.2,
        taxGananciasComision: data?.presupuesto?.taxGananciasComision ?? 20,
        taxIngresosComision: data?.presupuesto?.taxIngresosComision ?? 3,
        vendedorComision: data?.presupuesto?.vendedorComision ?? 2,
        estructuraComision: data?.presupuesto?.estructuraComision ?? 7,
        items: data?.presupuesto.items || [],
      },
    },
    shouldUnregister: false,
  });

  const {
    fields: itemsFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "presupuesto.items",
    keyName: "keyId",
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContratoMarcoPresupuestoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContratoMarcoPresupuestoMutation();

  const handleAddPresupuestoItem = useCallback(() => {
    appendItem({
      descripcion: "",
      cantidad: "",
      contratoMarcoPresupuestoItems: [],
    });
    setTimeout(() => {
      const items = form.getValues("presupuesto.items") ?? [];
      const lastIndex = Math.max(0, items.length - 1);
      // @ts-ignore path dinámica
      form.setFocus(`presupuesto.items.${lastIndex}.descripcion`);
    }, 0);
  }, [appendItem, form]);

  const onBack = useCallback(() => router.back(), [router]);

  async function onSubmit(values: FormValues) {
    try {
      if (values.id) await edit({ id: values.id, data: values });
      else await create(values);
      toast({ description: "Éxito al guardar", variant: "default" });
      router.back();
    } catch (error) {
      console.error("Form submission error", error);
      toast({ description: "Error al guardar", variant: "destructive" });
    }
  }
  const onError = (values) => {};

  return (
    <div className=" mx-auto py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >
          {/* Error Banner */}
          {!form.formState.isValid && form.formState.isSubmitted && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-700">
                Hay campos requeridos sin completar. Revisá los mensajes en
                rojo.
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="border-2   rounded-lg">
            <Collapsible
              open={isBasicInfoOpen}
              onOpenChange={setIsBasicInfoOpen}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4  cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">
                      Información Básica
                    </h3>
                  </div>
                  {isBasicInfoOpen ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 border-t  border-gray-200">
                  <div className="pt-4">
                    <PresupuestoData form={form} />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Items Section */}
          <div className="border-2   rounded-lg">
            <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4  cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">
                      Ítems del Presupuesto
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {itemsFields.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddPresupuestoItem();
                      }}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar
                    </Button>
                    {isItemsOpen ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 border-t border-dashed border-gray-200">
                  <div className="pt-4">
                    {itemsFields.filter((_, index) => {
                      const deletedAt = form.watch(
                        `presupuesto.items.${index}.deletedAt`
                      );
                      return !deletedAt;
                    }).length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <Package className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">
                          No hay ítems en el presupuesto
                        </p>
                        <Button
                          type="button"
                          onClick={handleAddPresupuestoItem}
                          variant="outline"
                          className="gap-2 bg-transparent"
                        >
                          <Plus className="h-4 w-4" />
                          Agregar Ítem
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {itemsFields.map((field, index) => {
                          const deletedAt = form.watch(
                            `presupuesto.items.${index}.deletedAt`
                          );
                          if (deletedAt) return null; // 👈 no renderizar los eliminados
                          return (
                            <PresupuestoItemCard
                              key={field.keyId}
                              form={form}
                              index={index}
                              field={field}
                              removeItem={removeItem}
                              talonarioItems={talonarioItems}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Action Bar */}
          <div className=" bg-white border-t-2  border-gray-300 p-4 -mx-6">
            <div className="mx-auto flex items-center gap-3">
              <LoadingButton
                loading={isPendingCreate || isPendingEdit}
                type="submit"
                size="default"
              >
                {isPendingCreate || isPendingEdit ? "Guardando..." : "Guardar"}
              </LoadingButton>
              <Button type="button" onClick={onBack} variant="link">
                Volver
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ====================== Subcomponentes ====================== */

function PresupuestoData({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <DatePicker
          label="Fecha entrega estimada"
          form={form}
          name="presupuesto.fechaEntregaEstimada"
        />
      </div>

      <div className="md:col-span-3">
        <FormField
          control={form.control}
          name="presupuesto.descripcionCorta"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Descripción del Presupuesto
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ingrese una descripción detallada del presupuesto..."
                  className="resize-none min-h-[100px] border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Proporcione una descripción clara y concisa del presupuesto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function PresupuestoItemCard({
  form,
  index,
  field,
  removeItem,
  talonarioItems,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  index: number;
  field: any;
  removeItem: (index: number) => void;
  talonarioItems: Array<any>;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4  cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                Ítem #{index + 1}
              </span>
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
              className="text-gray-500 hover:text-red-600 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
            <DeleteDialog
              open={openDelete}
              onClose={() => setOpenDelete(false)}
              onDelete={() => {
                const itemId = form.getValues(
                  `presupuesto.items.${index}.id` as const
                );
                if (!itemId) {
                  removeItem(index);
                } else {
                  form.setValue(
                    `presupuesto.items.${index}.deletedAt`,
                    getTodayDateTime(),
                    { shouldDirty: true }
                  );
                }
                setOpenDelete(false);
              }}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-dashed border-gray-200">
            <div className="pt-4 space-y-6">
              <PresupuestoItem
                form={form}
                index={index}
                onRemove={() => removeItem(index)}
              />
              <div className="border-t border-dashed border-gray-200 pt-4">
                <ContratoMarcoPresupuestoItems
                  form={form}
                  index={index}
                  talonarioItems={talonarioItems}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function PresupuestoItem({
  form,
  index,
  onRemove,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  index: number;
  onRemove: () => void;
}) {
  const handleCantidadInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>, onChange: (v: string) => void) => {
      const v = e.currentTarget.value
        .replace(/[^0-9.,]/g, "")
        .replace(",", ".");
      onChange(v);
    },
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-3">
        <FormField
          control={form.control}
          name={`presupuesto.items.${index}.descripcion`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Descripción del Ítem
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Descripción detallada del ítem..."
                  className="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-1">
        <FormField
          control={form.control}
          name={`presupuesto.items.${index}.cantidad`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Cantidad
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="decimal"
                  placeholder="0"
                  className="text-right border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  onInput={(e) => handleCantidadInput(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function ContratoMarcoPresupuestoItems({
  form,
  index,
  talonarioItems,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  index: number;
  talonarioItems: Array<any>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `presupuesto.items.${index}.contratoMarcoPresupuestoItems` as const,
    keyName: "keyId",
  });

  const [isOpen, setIsOpen] = useState(fields.length > 0);

  const handleAdd = useCallback(() => {
    append({
      contratoMarcoTalonarioItemId: undefined,
      contratoMarcoTalonarioItem: undefined,
      cantidad: "",
      alto: "",
      ancho: "",
    });
    setIsOpen(true);
  }, [append]);

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 p-0 h-auto font-medium text-gray-700 "
            >
              <DollarSign className="h-4 w-4" />
              Lista de precios
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 ml-2">
                {
                  fields.filter(
                    (_, i) =>
                      !form.watch(
                        `presupuesto.items.${index}.contratoMarcoPresupuestoItems.${i}.deletedAt`
                      )
                  ).length
                }
              </span>
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          <Button type="button" size="sm" variant="outline" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        <CollapsibleContent>
          {fields.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <Settings className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                No hay asignaciones del talonario
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAdd}
                className="gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((f, i) => {
                const deletedAt = form.watch(
                  `presupuesto.items.${index}.contratoMarcoPresupuestoItems.${i}.deletedAt`
                );
                if (deletedAt) return null; // 👈 no mostrar los eliminados
                return (
                  <ContratoMarcoPresupuestoItemCard
                    key={f.keyId}
                    form={form}
                    indexGlobal={index}
                    indexLocal={i}
                    remove={remove}
                    talonarioItems={talonarioItems}
                  />
                );
              })}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function ContratoMarcoPresupuestoItemCard({
  form,
  indexGlobal,
  indexLocal,
  remove,
  talonarioItems,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  indexGlobal: number;
  indexLocal: number;
  remove: (index: number) => void;
  talonarioItems: Array<any>;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  // Get the selected talonario item to check if it's historical
  const base =
    `presupuesto.items.${indexGlobal}.contratoMarcoPresupuestoItems.${indexLocal}` as const;
  const selectedId = form.watch(
    `${base}.contratoMarcoTalonarioItemId` as const
  ) as number | undefined;
  const selectedItem = useMemo(
    () => talonarioItems.find((ti: any) => ti.id === selectedId),
    [talonarioItems, selectedId]
  );
  const isHistorico = selectedItem?._esHistorico ?? false;

  return (
    <div className="border border-gray-300  bg-red-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3  cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-medium rounded">
                {indexLocal + 1}
              </span>
              <span className="text-sm font-medium text-gray-900">
                Talonario Item #{indexLocal + 1}
              </span>

              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
              disabled={isHistorico}
              className="text-gray-500 hover:text-red-600 gap-1 h-7 text-xs"
            >
              <Trash2 className="h-3 w-3" />
              Eliminar
            </Button>
            <DeleteDialog
              open={openDelete}
              onClose={() => setOpenDelete(false)}
              onDelete={() => {
                const itemId = form.getValues(
                  `presupuesto.items.${indexGlobal}.contratoMarcoPresupuestoItems.${indexLocal}.id` as const
                );
                if (!itemId) {
                  remove(indexLocal);
                } else {
                  form.setValue(
                    `presupuesto.items.${indexGlobal}.contratoMarcoPresupuestoItems.${indexLocal}.deletedAt`,
                    getTodayDateTime(),
                    { shouldDirty: true }
                  );
                }
                setOpenDelete(false);
              }}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 border-t  border-gray-300 bg-white">
            <div className="pt-3">
              <ContratoMarcoPresupuestoItem
                form={form}
                indexGlobal={indexGlobal}
                indexLocal={indexLocal}
                talonarioItems={talonarioItems}
                onRemove={() => remove(indexLocal)}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function ContratoMarcoPresupuestoItem({
  form,
  indexGlobal,
  indexLocal,
  talonarioItems,
  onRemove,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  indexGlobal: number;
  indexLocal: number;
  talonarioItems: Array<any>;
  onRemove: () => void;
}) {
  const base =
    `presupuesto.items.${indexGlobal}.contratoMarcoPresupuestoItems.${indexLocal}` as const;

  const handleNumInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>, onChange: (v: string) => void) => {
      const v = e.currentTarget.value
        .replace(/[^0-9.,]/g, "")
        .replace(",", ".");
      onChange(v);
    },
    []
  );

  const selectedId = form.watch(
    `${base}.contratoMarcoTalonarioItemId` as const
  ) as number | undefined;

  const selected = useMemo(
    () => talonarioItems.find((ti: any) => ti.id === selectedId),
    [talonarioItems, selectedId]
  );

  const isHistorico = selected?._esHistorico ?? false;

  const unitRaw = String(selected?.unidad ?? selected?.unidadMedida ?? "");
  const unit = unitRaw.toLowerCase();
  const isM2 = unit === "m2";

  const alto = form.watch(`${base}.alto`) as string | undefined;
  const ancho = form.watch(`${base}.ancho`) as string | undefined;

  useEffect(() => {
    if (!isM2) return;
    const a = Number.parseFloat((alto ?? "").replace(",", "."));
    const b = Number.parseFloat((ancho ?? "").replace(",", "."));
    const area = Number.isFinite(a) && Number.isFinite(b) ? a * b : Number.NaN;
    form.setValue(
      `${base}.cantidad` as const,
      Number.isFinite(area) ? area.toFixed(2) : "",
      { shouldDirty: true }
    );
  }, [alto, ancho, isM2, base, form]);

  return (
    <div className="space-y-4">
      <div>
        <Controller
          control={form.control}
          name={`${base}.contratoMarcoTalonarioItemId` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Ítem del Talonario
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ""}
                  disabled={isHistorico}
                  onValueChange={(val) => {
                    const num = val ? Number(val) : undefined;
                    field.onChange(num);

                    const selectedItem = talonarioItems.find(
                      (ti: any) => ti.id === num
                    );

                    form.setValue(
                      `${base}.contratoMarcoTalonarioItem` as const,
                      selectedItem,
                      { shouldDirty: true }
                    );

                    const selectedUnit = String(
                      selectedItem?.unidad ?? selectedItem?.unidadMedida ?? ""
                    ).toLowerCase();

                    if (selectedUnit === "m2") {
                      form.setValue(`${base}.cantidad` as const, "");
                    } else {
                      form.setValue(`${base}.alto` as const, "");
                      form.setValue(`${base}.ancho` as const, "");
                    }
                  }}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="Seleccionar ítem del talonario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {talonarioItems.map((ti: any) => (
                      <SelectItem key={ti.id} value={String(ti.id)}>
                        {ti.codigo ? `${ti.codigo} — ` : ""}
                        {ti.descripcion} {ti.precio ? `($ ${ti.precio})` : ""}
                        {ti._esHistorico && (
                          <span className="ml-2 text-xs text-orange-600 font-medium">
                            (Talonario anterior)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FormField
            control={form.control}
            name={`${base}.cantidad`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Cantidad{unit ? ` (${unit.toUpperCase()})` : ""}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder={isM2 ? "Calculado automáticamente" : "0"}
                    className="text-right border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={isM2 || isHistorico}
                    aria-disabled={isM2 || isHistorico}
                    onInput={(e) => !isM2 && handleNumInput(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name={`${base}.ancho`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Ancho (m)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder={isM2 ? "0.00" : "No aplica"}
                    className="text-right border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={!isM2 || isHistorico}
                    aria-disabled={!isM2 || isHistorico}
                    onInput={(e) =>
                      isM2 && !isHistorico && handleNumInput(e, field.onChange)
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name={`${base}.alto`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Alto (m)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder={isM2 ? "0.00" : "No aplica"}
                    className="text-right border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={!isM2 || isHistorico}
                    aria-disabled={!isM2 || isHistorico}
                    onInput={(e) =>
                      isM2 && !isHistorico && handleNumInput(e, field.onChange)
                    }
                  />
                </FormControl>
                {isM2 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Área calculada: </span>
                      {(() => {
                        const a = Number.parseFloat(
                          (alto ?? "0").replace(",", ".")
                        );
                        const b = Number.parseFloat(
                          (ancho ?? "0").replace(",", ".")
                        );
                        return Number.isFinite(a) &&
                          Number.isFinite(b) &&
                          a > 0 &&
                          b > 0
                          ? `${(a * b).toFixed(2)} m²`
                          : "Ingrese alto y ancho";
                      })()}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
