/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Inventario, InventarioConversion, Solcom } from "@/types";
import { useCreateSolcomMutation, useEditSolcomMutation } from "@/hooks/solcom";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import React from "react";
import { Trash2, Plus, Mail, Edit3, ImageIcon } from "lucide-react";
import { ImageCarouselDialog } from "@/components/image-carousel";
import { Archivo } from "@/types";
import { PresupuestoSelector } from "@/components/selectors/presupuesto-selector";
import { CentroCostoSelector } from "@/components/selectors/centro-costo-selector";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { today } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { UnidadMedidaInventarioSelector } from "@/components/selectors/unidad-medida-inventario-selector";
import { Separator } from "@/components/ui/separator";
import { InputMoney } from "../input-money";
import { SeparatorWithText } from "@/components/ui/separator-with-text";
import { hasPermission } from "@/hooks/use-access";
import { FinalizarSolcomDialog } from "@/components/dialogs/finalizar-solcom-dialog";
import { AsignarSolcomDialog } from "@/components/dialogs/asignar-solcom-dialog";
import { ModificarEstadoSolcomDialog } from "@/components/dialogs/modificar-estado-solcom-dialog";
import { GenerarPdfSolcomDialog } from "@/components/dialogs/generar-pdf-solcom-dialog";
import { ESTADO_SOLCOM_CODIGOS } from "@/constants/compras";

const itemSchema = z.object({
  inventarioId: z.number().min(1, "Selecciona un producto del inventario"),
  inventario: z.unknown().optional(),
  inventarioConversionId: z.number().optional().nullable(),
  inventarioConversion: z.unknown().optional().nullable(),
  descripcion: z.string().optional(),
  cantidad: z.string().min(1, "Ingresa la cantidad"),
  minimo: z.string().optional(),
  maximo: z.string().optional(),
});

const formSchema = z.object({
  id: z.number().optional(),
  presupuestoId: z.number().optional().nullable(),
  presupuesto: z.unknown().optional().nullable(),
  centroId: z.number().optional().nullable(),
  centro: z.unknown().optional().nullable(),
  descripcion: z.string().optional(),
  fechaLimite: z.string().optional(),
  estadoId: z.number().optional(),
  estado: z.unknown().optional(),
  items: z.array(itemSchema).min(1, "Agrega al menos un item"),
});

export default function SolcomForm({ data }: { data?: Solcom }) {
  const { toast } = useToast();
  const router = useRouter();

  const [nuevoItem, setNuevoItem] = React.useState<{
    inventarioId: number;
    inventario: Inventario | null;
    inventarioConversionId: number | null;
    inventarioConversion: InventarioConversion | null;
    descripcion: string;
    cantidad: string;
    minimo: string;
    maximo: string;
  }>({
    inventarioId: 0,
    inventario: null,
    inventarioConversionId: null,
    inventarioConversion: null,
    descripcion: "",
    cantidad: "",
    minimo: "",
    maximo: "",
  });
  const [nuevoItemErrors, setNuevoItemErrors] = React.useState<
    Partial<Record<keyof typeof nuevoItem, string>>
  >({});
  const [finalizarDialogOpen, setFinalizarDialogOpen] = React.useState(false);
  const [asignarDialogOpen, setAsignarDialogOpen] = React.useState(false);
  const [modificarEstadoDialogOpen, setModificarEstadoDialogOpen] =
    React.useState(false);
  const [generarPdfDialogOpen, setGenerarPdfDialogOpen] = React.useState(false);
  const [fotosInventario, setFotosInventario] = React.useState<Archivo[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      presupuestoId: data?.presupuestoId || null,
      presupuesto: data?.presupuesto || null,
      centroId: data?.centroId || null,
      centro: data?.centro || null,
      descripcion: data?.descripcion || "",
      fechaLimite: data?.fechaLimite || "",
      estadoId: data?.estadoId,
      estado: data?.estado,
      items: data?.items || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateSolcomMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditSolcomMutation();

  // Permisos
  const puedeEditar = hasPermission("SOLCOM_EDITAR");
  const puedeCrear = hasPermission("SOLCOM_CREAR");
  const puedeCrearOferta = hasPermission("OFERTA_CREAR");
  const puedeFinalizar = hasPermission("SOLCOM_FINALIZAR");
  const puedeAsignar = hasPermission("SOLCOM_ASIGNAR");
  const puedeModificarEstado = hasPermission("SOLCOM_MODIFICAR_ESTADO");

  // Determinar si el estado actual permite edición
  const estadoActualCodigo = data?.estado?.codigo;
  const estadoPermiteEdicion =
    !estadoActualCodigo || // Si no hay estado (nuevo registro)
    estadoActualCodigo === ESTADO_SOLCOM_CODIGOS.SOLC_INI ||
    estadoActualCodigo === ESTADO_SOLCOM_CODIGOS.SOLC_RECH;

  // Determinar si los CAMPOS del formulario están deshabilitados
  // Para editar: necesita permiso de editar Y que el estado permita edición
  // Para crear: solo necesita permiso de crear
  const camposDeshabilitados = data?.id
    ? !puedeEditar || !estadoPermiteEdicion
    : !puedeCrear;

  // El botón guardar se deshabilita si no puede editar (para edición) o no puede crear (para creación)
  const botonGuardarDeshabilitado = data?.id ? !puedeEditar : !puedeCrear;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const dataToSend = {
        ...values,
        fechaCreacion: today(), // Siempre enviar fecha actual
        // Asegurar que solo enviamos los IDs, no los objetos relacionados
        presupuestoId: values.presupuestoId ?? undefined,
        centroId: values.centroId ?? undefined,
        estadoId: values.estadoId,
        presupuesto: undefined,
        centro: undefined,
        estado: undefined,
        items: values.items.map((item) => ({
          inventarioId: item.inventarioId,
          inventarioConversionId: item.inventarioConversionId,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          minimo: item.minimo,
          maximo: item.maximo,
        })),
      };

      if (values.id) {
        await edit({ id: values.id, data: dataToSend as any });
      } else {
        await create(dataToSend as any);
      }
      toast({
        description: "Exito al realizar la operación",
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

  const agregarItem = async () => {
    // Validar manualmente antes de parsear
    if (!nuevoItem.inventarioId || nuevoItem.inventarioId === 0) {
      setNuevoItemErrors({
        ...nuevoItemErrors,
        inventarioId: "Selecciona un producto del inventario",
      });
      return;
    }

    if (!nuevoItem.cantidad || nuevoItem.cantidad.trim() === "") {
      setNuevoItemErrors({
        ...nuevoItemErrors,
        cantidad: "Ingresa la cantidad",
      });
      return;
    }

    const parsed = itemSchema.safeParse(nuevoItem);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setNuevoItemErrors({
        inventarioId: errors.inventarioId?.[0],
        cantidad: errors.cantidad?.[0],
      });
      return;
    }

    append(parsed.data);
    setNuevoItem({
      inventarioId: 0,
      inventario: null,
      inventarioConversionId: null,
      inventarioConversion: null,
      descripcion: "",
      cantidad: "",
      minimo: "",
      maximo: "",
    });
    setNuevoItemErrors({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
        {/* Información General */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900">
                Información General {data?.id && "#" + data.id}
              </h2>
              {data?.usuarioSolicitante && (
                <span className="text-xs text-muted-foreground">
                  Solicitado por{" "}
                  {data.usuarioSolicitante.nombre ||
                    data.usuarioSolicitante.email}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {data?.id && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => router.push(`/solcom/${data?.id}/mensajes`)}
                    type="button"
                    title="Mensajes"
                  >
                    <Mail />
                  </Button>
                </>
              )}
              {data?.id && data.estado && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                    <Badge variant="outline" className="text-xs">
                      {data.estado.codigo}
                    </Badge>
                    <span className="text-sm font-medium">
                      {data.estado.nombre}
                    </span>
                  </div>
                  {puedeModificarEstado && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setModificarEstadoDialogOpen(true)}
                      type="button"
                      title="Cambiar estado"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <FormField
                control={form.control}
                name="presupuestoId"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Presupuesto
                    </FormLabel>
                    <PresupuestoSelector
                      selectedResult={form.getValues("presupuesto") as any}
                      onSelectResult={(presupuesto) => {
                        form.setValue("presupuestoId", presupuesto?.id || null);
                        form.setValue("presupuesto", presupuesto || null);
                      }}
                    />
                    <FormDescription className="text-xs text-gray-500">
                      Selecciona un presupuesto o un centro de costo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-5">
              <FormField
                control={form.control}
                name="centroId"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Centro de Costo
                    </FormLabel>
                    <CentroCostoSelector
                      centroCosto={form.getValues("centro") as any}
                      onChange={(centro) => {
                        if (centro) {
                          form.setValue("centroId", centro.id);
                          form.setValue("centro", centro);
                          // Si se selecciona centro, limpiar presupuesto
                        }
                      }}
                      onClear={() => {
                        form.setValue("centroId", null);
                        form.setValue("centro", null);
                      }}
                      disabled={camposDeshabilitados}
                    />
                    <FormDescription className="text-xs text-gray-500">
                      Selecciona un centro de costo o un presupuesto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <DatePicker
                form={form}
                name="fechaLimite"
                label="Fecha Límite"
                fromYear={2020}
                disabled={camposDeshabilitados}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Descripción General
                </FormLabel>
                <Textarea
                  placeholder="Describe brevemente el propósito de esta solicitud de compra..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={camposDeshabilitados}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        {/* Sección de Items */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {fields.length > 0 && (
              <span className="text-sm text-gray-500">
                {fields.length} {fields.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {/* Lista de items agregados */}
          {fields.length > 0 && (
            <div className="space-y-2">
              {fields.map((field, index) => {
                const item = form.watch(`items.${index}`);

                return (
                  <div
                    key={field.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 space-y-2"
                  >
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 md:col-span-4">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Producto
                        </label>
                        <InventarioSelector
                          value={item.inventario as any}
                          disabled={camposDeshabilitados}
                          onChange={(inventario) => {
                            if (inventario && inventario.id) {
                              form.setValue(
                                `items.${index}.inventarioId`,
                                inventario.id
                              );
                              form.setValue(
                                `items.${index}.inventario`,
                                inventario
                              );
                              form.setValue(
                                `items.${index}.inventarioConversionId`,
                                null
                              );
                              form.setValue(
                                `items.${index}.inventarioConversion`,
                                null
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Ultimo precio compra aprox
                        </label>
                        <InputMoney
                          value={
                            item.inventarioConversion && item.inventario?.punit
                              ? parseFloat(item.inventario.punit.toString()) /
                                parseFloat(
                                  item.inventarioConversion.cantidad.toString()
                                )
                              : item.inventario?.punit
                          }
                          disabled
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Presentación
                        </label>
                        <UnidadMedidaInventarioSelector
                          value={item.inventarioConversionId?.toString() || ""}
                          disabled={camposDeshabilitados}
                          onChange={(value) => {
                            const conversionId = value ? parseInt(value) : null;
                            form.setValue(
                              `items.${index}.inventarioConversionId`,
                              conversionId
                            );
                          }}
                          onSelect={(conversion) => {
                            if (conversion) {
                              form.setValue(
                                `items.${index}.inventarioConversionId`,
                                conversion.id
                              );
                              form.setValue(
                                `items.${index}.inventarioConversion`,
                                conversion
                              );
                            } else {
                              form.setValue(
                                `items.${index}.inventarioConversionId`,
                                null
                              );
                              form.setValue(
                                `items.${index}.inventarioConversion`,
                                null
                              );
                            }
                          }}
                          id={item.inventarioId}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Cant.
                        </label>
                        <FormField
                          control={form.control}
                          name={`items.${index}.cantidad`}
                          render={({ field: formField }) => (
                            <Input
                              {...formField}
                              placeholder="0"
                              disabled={camposDeshabilitados}
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Mín
                        </label>
                        <FormField
                          control={form.control}
                          name={`items.${index}.minimo`}
                          render={({ field: formField }) => (
                            <Input
                              {...formField}
                              placeholder="0"
                              disabled={camposDeshabilitados}
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Máx
                        </label>
                        <FormField
                          control={form.control}
                          name={`items.${index}.maximo`}
                          render={({ field: formField }) => (
                            <Input
                              {...formField}
                              placeholder="0"
                              disabled={camposDeshabilitados}
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1 flex justify-end gap-1">
                        {(() => {
                          const adjuntos = (item.inventario as any)?.adjuntos as Archivo[] | undefined;
                          const tieneAdjuntos = adjuntos && adjuntos.length > 0;
                          return (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              title={tieneAdjuntos ? "Ver fotos" : "Sin fotos"}
                              disabled={!tieneAdjuntos}
                              onClick={() => setFotosInventario(adjuntos!)}
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          );
                        })()}
                        <Button
                          type="button"
                          size="sm"
                          className="w-full"
                          onClick={() => remove(index)}
                          disabled={camposDeshabilitados}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.descripcion`}
                      render={({ field: formField }) => (
                        <Input
                          {...formField}
                          placeholder="Descripción adicional (opcional)..."
                          disabled={camposDeshabilitados}
                        />
                      )}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Separator con texto */}
          {!camposDeshabilitados && (
            <>
              <SeparatorWithText>Agregar nuevo producto</SeparatorWithText>

              {/* Formulario para agregar nuevo item */}
              <div className="bg-primary/5 border-2 border-dashed border-primary rounded-lg p-3 space-y-2">
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 md:col-span-4">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Producto <span className="text-red-500">*</span>
                      </label>
                      <InventarioSelector
                        inventario={
                          nuevoItem.inventario
                            ? nuevoItem.inventario
                            : undefined
                        }
                        disabled={false}
                        onChange={(inventario) => {
                          if (inventario && inventario.id) {
                            setNuevoItem({
                              ...nuevoItem,
                              inventarioId: inventario.id,
                              inventario: inventario,
                              descripcion: "",
                              inventarioConversionId: null,
                              inventarioConversion: null,
                            });
                            setNuevoItemErrors({
                              ...nuevoItemErrors,
                              inventarioId: undefined,
                            });
                          }
                        }}
                      />
                      {nuevoItemErrors.inventarioId && (
                        <p className="text-xs text-red-600 mt-0.5">
                          {nuevoItemErrors.inventarioId}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Ultimo precio compra aprox
                      </label>
                      <InputMoney
                        value={
                          nuevoItem.inventarioConversion &&
                          nuevoItem.inventario?.punit
                            ? parseFloat(
                                nuevoItem.inventario.punit.toString()
                              ) /
                              parseFloat(
                                nuevoItem.inventarioConversion.cantidad.toString()
                              )
                            : nuevoItem.inventario?.punit
                        }
                        disabled
                      />
                    </div>

                    <div className="col-span-12 md:col-span-2">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Presentación
                      </label>
                      <UnidadMedidaInventarioSelector
                        value={
                          nuevoItem.inventarioConversionId?.toString() || ""
                        }
                        onChange={(value) => {
                          const conversionId = value ? parseInt(value) : null;
                          setNuevoItem({
                            ...nuevoItem,
                            inventarioConversionId: conversionId,
                          });
                        }}
                        onSelect={(conversion) => {
                          if (conversion) {
                            setNuevoItem({
                              ...nuevoItem,
                              inventarioConversionId: conversion.id,
                              inventarioConversion: conversion,
                            });
                          } else {
                            setNuevoItem({
                              ...nuevoItem,
                              inventarioConversionId: null,
                              inventarioConversion: null,
                            });
                          }
                        }}
                        id={nuevoItem.inventarioId}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-1">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Cant. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={nuevoItem.cantidad}
                        onChange={(e) =>
                          setNuevoItem({
                            ...nuevoItem,
                            cantidad: e.target.value,
                          })
                        }
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value
                            .replace(/[^0-9.,]/g, "")
                            .replace(",", ".");
                        }}
                        placeholder="0"
                        className={` ${
                          nuevoItemErrors.cantidad
                            ? "border-red-300 focus:border-red-500"
                            : ""
                        }`}
                      />
                      {nuevoItemErrors.cantidad && (
                        <p className="text-xs text-red-600 mt-0.5">
                          {nuevoItemErrors.cantidad}
                        </p>
                      )}
                    </div>

                    <div className="col-span-12 md:col-span-1">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Mín
                      </label>
                      <Input
                        value={nuevoItem.minimo}
                        onChange={(e) =>
                          setNuevoItem({ ...nuevoItem, minimo: e.target.value })
                        }
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value
                            .replace(/[^0-9.,]/g, "")
                            .replace(",", ".");
                        }}
                        placeholder="0"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-1">
                      <label className="text-xs text-gray-500 mb-0.5 block">
                        Máx
                      </label>
                      <Input
                        value={nuevoItem.maximo}
                        onChange={(e) =>
                          setNuevoItem({ ...nuevoItem, maximo: e.target.value })
                        }
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value
                            .replace(/[^0-9.,]/g, "")
                            .replace(",", ".");
                        }}
                        placeholder="0"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-1">
                      <Button
                        type="button"
                        onClick={agregarItem}
                        size="sm"
                        className="w-full "
                      >
                        <Plus className="h-4 w-4 md:mr-1" />
                      </Button>
                    </div>
                  </div>

                  <Input
                    value={nuevoItem.descripcion}
                    onChange={(e) =>
                      setNuevoItem({
                        ...nuevoItem,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Descripción adicional (opcional)..."
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            type="submit"
            disabled={botonGuardarDeshabilitado}
            className="w-full sm:w-auto"
          >
            Guardar
          </LoadingButton>
          {data?.id && puedeAsignar && (
            <Button
              type="button"
              onClick={() => setAsignarDialogOpen(true)}
              variant="default"
              className="w-full sm:w-auto"
            >
              Asignar comprador
            </Button>
          )}
          {data?.id && puedeCrearOferta && (
            <Button
              type="button"
              onClick={() => router.push(`/ofertas/crear?solcomId=${data.id}`)}
              variant="outline"
              disabled={data.estado?.codigo !== ESTADO_SOLCOM_CODIGOS.SOLC_AP}
              className="w-full sm:w-auto"
            >
              Crear oferta
            </Button>
          )}
          {data?.id && puedeFinalizar && (
            <Button
              type="button"
              onClick={() => setFinalizarDialogOpen(true)}
              variant="outline"
              disabled={data.estado?.codigo == ESTADO_SOLCOM_CODIGOS.SOLC_FIN}
              className="w-full sm:w-auto"
            >
              Cerrar solicitud
            </Button>
          )}
          {data?.id && (
            <Button
              variant="outline"
              onClick={() => setGenerarPdfDialogOpen(true)}
              type="button"
              title="Descargar PDF"
              className="w-full sm:w-auto"
            >
              Descargar PDF
            </Button>
          )}
          <Button
            type="button"
            onClick={() => router.back()}
            variant={"link"}
            className="w-full sm:w-auto"
          >
            Volver
          </Button>
        </div>
      </form>

      {/* Dialog fotos inventario */}
      <ImageCarouselDialog
        archivos={fotosInventario ?? []}
        open={!!fotosInventario}
        onOpenChange={(open) => !open && setFotosInventario(null)}
      />

      {/* Modales */}
      {data && (
        <>
          <FinalizarSolcomDialog
            open={finalizarDialogOpen}
            setOpen={setFinalizarDialogOpen}
            solcom={data}
          />
          <AsignarSolcomDialog
            open={asignarDialogOpen}
            setOpen={setAsignarDialogOpen}
            solcom={data}
          />
          <ModificarEstadoSolcomDialog
            open={modificarEstadoDialogOpen}
            setOpen={setModificarEstadoDialogOpen}
            solcom={data}
          />
          <GenerarPdfSolcomDialog
            open={generarPdfDialogOpen}
            setOpen={setGenerarPdfDialogOpen}
            solcom={data}
          />
        </>
      )}
    </Form>
  );
}
