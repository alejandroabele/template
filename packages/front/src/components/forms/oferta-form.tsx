/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Oferta } from "@/types";
import { useCreateOfertaMutation, useEditOfertaMutation } from "@/hooks/oferta";
import {
  useGetSolcomByIdQuery,
  useFetchSolcomItemsByIdsQuery,
  useFetchSolcomItemsBySolcomIdsQuery,
} from "@/hooks/solcom";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import React, { Suspense } from "react";
import { Trash2, Plus, Copy } from "lucide-react";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { Badge } from "@/components/ui/badge";
import { UnidadMedidaInventarioSelector } from "@/components/selectors/unidad-medida-inventario-selector";
import { Separator } from "@/components/ui/separator";
import { ProveedorSelector } from "@/components/selectors/proveedor-selector";
import { MetodoPagoSelector } from "@/components/selectors/metodo-pago-selector";
import { PlazoPagoSelector } from "@/components/selectors/plazo-pago-selector";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { Textarea } from "../ui/textarea";
import { InputMoney } from "@/components/input-money";
import { ColorPicker } from "@/components/form-helpers/color-picker";
import { formatMoney } from "@/utils/number";
import { ConfirmarOrdenCompraDialog } from "@/components/dialogs/confirmar-orden-compra-dialog";
import { SeparatorWithText } from "@/components/ui/separator-with-text";
import { MonedaSelector } from "@/components/selectors/moneda-selector";
import { hasPermission } from "@/hooks/use-access";
import { AlicuotaIvaSelector } from "@/components/selectors/alicuota-iva-selector";
import { OfertaEnviarValidarDialog } from "@/components/dialogs/oferta-enviar-validar-dialog";
import { OfertaRechazarDialog } from "@/components/dialogs/oferta-rechazar-dialog";
import {
  ESTADO_OFERTA_CODIGOS,
  ESTADO_SOLCOM_CODIGOS,
} from "@/constants/compras";

const itemSchema = z.object({
  solcomItemId: z.number().optional().nullable(),
  solcomItem: z.unknown().optional().nullable(),
  inventarioId: z.number().min(1, "Selecciona un producto del inventario"),
  inventario: z.unknown().optional(),
  inventarioConversionId: z.number().optional().nullable(),
  inventarioConversion: z.unknown().optional().nullable(),
  cantidad: z.string().min(1, "Ingresa la cantidad"),
  precio: z.string().min(1, "Ingresa el precio"),
  alicuota: z.string().optional(),
  descripcion: z.string().optional(),
});

const formSchema = z.object({
  id: z.number().optional(),
  proveedorId: z.number().optional().nullable(),
  // proveedor: z.unknown().optional().nullable(),
  metodoPagoId: z.number().optional().nullable(),
  // metodoPago: z.unknown().optional().nullable(),
  plazoPagoId: z.number().optional().nullable(),
  // plazoPago: z.unknown().optional().nullable(),
  fechaDisponibilidad: z.string().optional(),
  observaciones: z.string().optional(),
  anotacionesInternas: z.string().optional(),
  estadoId: z.number().optional(),
  // estado: z.unknown().optional(),
  validez: z.string().optional(),
  bonificacion: z.string().optional(),
  moneda: z.string().optional(),
  color: z.string().optional(),
  favorito: z.boolean().optional(),
  items: z.array(itemSchema).min(1, "Agrega al menos un item"),
});

type OfertaFormProps = {
  data?: Oferta;
  solcomIdFromUrl?: string | null;
  solcomItemIdsFromUrl?: string | null;
  solcomIdsFromUrl?: string | null;
  duplicar?: boolean;
};

function OfertaFormContent({
  data,
  solcomIdFromUrl,
  solcomItemIdsFromUrl,
  solcomIdsFromUrl,
  duplicar = false,
}: OfertaFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Parsear los IDs de items de SOLCOM del query param
  const solcomItemIds = React.useMemo(() => {
    if (!solcomItemIdsFromUrl) return [];
    return solcomItemIdsFromUrl
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
  }, [solcomItemIdsFromUrl]);

  // Parsear los IDs de SOLCOMs del query param
  const solcomIds = React.useMemo(() => {
    if (!solcomIdsFromUrl) return [];
    return solcomIdsFromUrl
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
  }, [solcomIdsFromUrl]);

  const [nuevoItem, setNuevoItem] = React.useState<{
    inventarioId: number;
    inventario: any;
    inventarioConversionId: number | null;
    inventarioConversion: any;
    cantidad: string;
    precio: string;
    alicuota: string;
    descripcion: string;
  }>({
    inventarioId: 0,
    inventario: null,
    inventarioConversionId: null,
    inventarioConversion: null,
    cantidad: "",
    precio: "",
    alicuota: "",
    descripcion: "",
  });
  const [nuevoItemErrors, setNuevoItemErrors] = React.useState<
    Partial<Record<keyof typeof nuevoItem, string>>
  >({});

  const [archivoOferta, setArchivoOferta] = React.useState<File[]>([]);
  const { handleFileUpload } = useFileUploadHandler();

  const [openConfirmarOrden, setOpenConfirmarOrden] = React.useState(false);
  const [openEnviarValidar, setOpenEnviarValidar] = React.useState(false);
  const [openRechazar, setOpenRechazar] = React.useState(false);

  const handleDuplicarOferta = () => {
    if (data?.id) {
      router.push(`/ofertas/${data.id}/duplicar`);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: duplicar ? undefined : data?.id,
      proveedorId: data?.proveedorId || null,
      // proveedor: data?.proveedor || null,
      metodoPagoId: data?.metodoPagoId || null,
      // metodoPago: data?.metodoPago || null,
      plazoPagoId: data?.plazoPagoId || null,
      // plazoPago: data?.plazoPago || null,
      fechaDisponibilidad: data?.fechaDisponibilidad || "",
      observaciones: data?.observaciones || "",
      anotacionesInternas: data?.anotacionesInternas || "",
      estadoId: duplicar ? undefined : data?.estadoId,
      // estado: duplicar ? undefined : data?.estado,
      validez: data?.validez || "",
      bonificacion: data?.bonificacion || "",
      moneda: data?.moneda || "",
      color: data?.color || "",
      favorito: data?.favorito || false,
      items:
        data?.items?.map((item) => ({
          ...item,
          descripcion: item.descripcion || "",
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateOfertaMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditOfertaMutation();

  // Permisos
  const puedeEditar = hasPermission("OFERTA_EDITAR");
  const puedeCrear = hasPermission("OFERTA_CREAR");
  const puedeCrearOrdenCompra = hasPermission("ORDEN_COMPRA_CREAR");
  const puedeEnviarAValidar = hasPermission("OFERTA_ENVIAR_A_VALIDAR");

  // Verificar si la oferta está en estado editable (OF_INICIADA o OF_VALIDACION)
  const estadosEditables = [
    ESTADO_OFERTA_CODIGOS.OF_INICIADA,
    ESTADO_OFERTA_CODIGOS.OF_VALIDACION,
  ];
  const estadoEsEditable = data?.estado?.codigo
    ? estadosEditables.includes(data.estado.codigo as any)
    : true; // Si no hay estado (es nuevo), es editable

  // Verificar si la SOLCOM está aprobada
  const solcomEsAprobada =
    data?.solcom?.estado?.codigo === ESTADO_SOLCOM_CODIGOS.SOLC_AP;
  const solcomNoAprobada = data?.solcom && !solcomEsAprobada;

  // Determinar si el formulario está en modo solo lectura
  const soloLectura =
    data?.id && !duplicar
      ? !puedeEditar || !estadoEsEditable || solcomNoAprobada
      : !puedeCrear;

  // Obtener datos de la SOLCOM si viene del URL (legacy)
  const { data: solcomData } = useGetSolcomByIdQuery(
    solcomIdFromUrl ? parseInt(solcomIdFromUrl) : 0
  );

  // Obtener items específicos de SOLCOMs si vienen del URL
  const { data: solcomItemsData } =
    useFetchSolcomItemsByIdsQuery(solcomItemIds);

  // Obtener items de múltiples SOLCOMs si vienen del URL
  const { data: solcomIdsItemsData } =
    useFetchSolcomItemsBySolcomIdsQuery(solcomIds);

  // Efecto para precargar items de la SOLCOM (legacy - desde solcomId completo)
  React.useEffect(() => {
    if (
      solcomData &&
      solcomData.items &&
      solcomData.items.length > 0 &&
      !data &&
      !duplicar &&
      solcomItemIds.length === 0 // Solo si no hay items específicos
    ) {
      // Solo precargar si es creación (no edición ni duplicación) y si aún no hay items
      const currentItems = form.getValues("items");
      if (currentItems.length === 0) {
        solcomData.items.forEach((solcomItem) => {
          append({
            solcomItemId: solcomItem.id,
            solcomItem: {
              ...solcomItem,
              solcom: {
                id: solcomData.id,
                estado: solcomData.estado,
              },
            },
            inventarioId: solcomItem.inventarioId,
            inventario: solcomItem.inventario,
            inventarioConversionId: solcomItem.inventarioConversionId || null,
            inventarioConversion: solcomItem.inventarioConversion || null,
            cantidad: solcomItem.cantidad || "",
            precio: solcomItem.inventario?.punit?.toString() || "", // Precargar último precio
            alicuota: solcomItem.inventario?.alicuota || "",
            descripcion: solcomItem.descripcion || "",
          });
        });
      }
    }
  }, [solcomData, data, duplicar, form, append, solcomItemIds.length]);

  // Efecto para precargar items específicos de SOLCOMs
  React.useEffect(() => {
    if (solcomItemsData && solcomItemsData.length > 0 && !data && !duplicar) {
      // Solo precargar si es creación (no edición ni duplicación)
      const currentItems = form.getValues("items");
      if (currentItems.length === 0) {
        solcomItemsData.forEach((solcomItem) => {
          append({
            solcomItemId: solcomItem.id,
            solcomItem: solcomItem,
            inventarioId: solcomItem.inventarioId,
            inventario: solcomItem.inventario,
            inventarioConversionId: solcomItem.inventarioConversionId || null,
            inventarioConversion: solcomItem.inventarioConversion || null,
            cantidad: solcomItem.cantidad || "",
            precio: solcomItem.inventario?.punit?.toString() || "", // Precargar último precio
            alicuota: solcomItem.inventario?.alicuota || "",
            descripcion: solcomItem.descripcion || "",
          });
        });
      }
    }
  }, [solcomItemsData, data, duplicar, form, append]);

  // Efecto para precargar items desde múltiples SOLCOMs
  React.useEffect(() => {
    if (
      solcomIdsItemsData &&
      solcomIdsItemsData.length > 0 &&
      !data &&
      !duplicar
    ) {
      // Solo precargar si es creación (no edición ni duplicación)
      const currentItems = form.getValues("items");
      if (currentItems.length === 0 && solcomItemIds.length === 0) {
        // Solo si no hay items específicos preseleccionados
        solcomIdsItemsData.forEach((solcomItem) => {
          append({
            solcomItemId: solcomItem.id,
            solcomItem: solcomItem,
            inventarioId: solcomItem.inventarioId,
            inventario: solcomItem.inventario,
            inventarioConversionId: solcomItem.inventarioConversionId || null,
            inventarioConversion: solcomItem.inventarioConversion || null,
            cantidad: solcomItem.cantidad || "",
            precio: solcomItem.inventario?.punit?.toString() || "", // Precargar último precio
            alicuota: solcomItem.inventario?.alicuota || "",
            descripcion: solcomItem.descripcion || "",
          });
        });
      }
    }
  }, [solcomIdsItemsData, data, duplicar, form, append, solcomItemIds.length]);

  const uploadFiles = async (id: number) => {
    await handleFileUpload({
      fileId: data?.archivoOferta?.id,
      fileArray: archivoOferta,
      modelo: "oferta",
      modeloId: id,
      tipo: "oferta",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let response;
    try {
      if (duplicar) {
        delete values.id;
      }
      const dataToSend = {
        ...values,
        solcomId: values.solcomId ?? undefined,
        proveedorId: values.proveedorId ?? undefined,
        metodoPagoId: values.metodoPagoId ?? undefined,
        plazoPagoId: values.plazoPagoId ?? undefined,
        estadoId: values.estadoId,
        items: values.items.map((item) => ({
          solcomItemId: item.solcomItemId,
          inventarioId: item.inventarioId,
          inventarioConversionId: item.inventarioConversionId,
          cantidad: item.cantidad,
          precio: item.precio,
          alicuota: item.alicuota,
          descripcion: item.descripcion,
        })),
      };
      if (values.id) {
        response = await edit({ id: values.id, data: dataToSend as any });
        await uploadFiles(values.id);
      } else {
        response = await create(dataToSend as any);
        if (response.id) {
          await uploadFiles(response.id);
        }
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

    if (!nuevoItem.precio || nuevoItem.precio.trim() === "") {
      setNuevoItemErrors({
        ...nuevoItemErrors,
        precio: "Ingresa el precio",
      });
      return;
    }

    const parsed = itemSchema.safeParse(nuevoItem);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setNuevoItemErrors({
        inventarioId: errors.inventarioId?.[0],
        cantidad: errors.cantidad?.[0],
        precio: errors.precio?.[0],
      });
      return;
    }

    append(parsed.data);
    setNuevoItem({
      inventarioId: 0,
      inventario: null,
      inventarioConversionId: null,
      inventarioConversion: null,
      cantidad: "",
      precio: "",
      alicuota: "",
      descripcion: "",
    });
    setNuevoItemErrors({});
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Información General */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {duplicar ? "Duplicar Presupuesto" : "Presupuesto"}
              </h2>
              {data?.estado?.nombre && !duplicar && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">#{data.id}</span>
                  <Badge variant="destructive" className="text-xs">
                    {data?.estado?.nombre}
                  </Badge>
                </div>
              )}
            </div>

            {/* Mensaje informativo si no es editable */}
            {data?.id && !duplicar && !estadoEsEditable && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Este presupuesto no se puede modificar porque está en estado{" "}
                  <strong>{data?.estado?.nombre}</strong>. Solo se pueden editar
                  presupuestos en estado Iniciada o En Validación.
                </p>
              </div>
            )}

            {/* Mensaje informativo si la SOLCOM no está aprobada */}
            {data?.id && !duplicar && solcomNoAprobada && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Esta presupuesto no se puede modificar porque la SOLCOM
                  asociada no está aprobada. Estado actual de la SOLCOM:{" "}
                  <strong>{data?.solcom?.estado?.nombre}</strong>.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div className="sm:col-span-2 lg:col-span-4">
                <FormField
                  control={form.control}
                  name="proveedorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Proveedor
                      </FormLabel>
                      <ProveedorSelector
                        value={data?.proveedor}
                        onChange={(proveedor) => {
                          field.onChange(proveedor.id);
                          // form.setValue("proveedor", proveedor);
                        }}
                        disabled={soloLectura}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <FormField
                  control={form.control}
                  name="metodoPagoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Método de Pago
                      </FormLabel>
                      <MetodoPagoSelector
                        value={field.value?.toString() || ""}
                        onChange={(value) => {
                          field.onChange(value ? parseInt(value) : null);
                        }}
                        disabled={soloLectura}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <FormField
                  control={form.control}
                  name="plazoPagoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Plazo de Pago
                      </FormLabel>
                      <PlazoPagoSelector
                        value={field.value?.toString() || ""}
                        onChange={(value) => {
                          field.onChange(value ? parseInt(value) : null);
                        }}
                        disabled={soloLectura}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <DatePicker
                  form={form}
                  name="fechaDisponibilidad"
                  label="Fecha Disponibilidad"
                  fromYear={2025}
                  disabled={soloLectura}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <FormField
                  control={form.control}
                  name="favorito"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end h-full ">
                      <FormControl>
                        <Label
                          className={`flex items-center gap-2 rounded-md border-2 p-3 cursor-pointer transition-all hover:bg-accent/50 ${
                            field.value
                              ? "border-primary bg-primary/10"
                              : "border-input"
                          }`}
                        >
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={soloLectura}
                            className={
                              field.value
                                ? "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                : ""
                            }
                          />
                          <span>Marcar Favorita</span>
                        </Label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-2">
                <DatePicker
                  form={form}
                  name="validez"
                  label="Validez"
                  fromYear={2025}
                  disabled={soloLectura}
                />
              </div>
              <div className="lg:col-span-2">
                <FormField
                  control={form.control}
                  name="bonificacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Bonificación
                      </FormLabel>
                      <InputMoney {...field} disabled={soloLectura} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="lg:col-span-2">
                <FormField
                  control={form.control}
                  name="moneda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Moneda
                      </FormLabel>
                      <MonedaSelector
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={soloLectura}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <ArchivosInput
                  label="Archivo de presupuesto"
                  value={archivoOferta}
                  setValue={(files) => setArchivoOferta(files || [])}
                  defaultValue={data?.archivoOferta}
                  variant="compact"
                  disabled={soloLectura}
                />
              </div>
              <div className="lg:col-span-2">
                <ColorPicker
                  form={form}
                  name="color"
                  label="Color"
                  disabled={soloLectura}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-6">
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Observaciones (va en la orden de compra)
                      </FormLabel>
                      <Textarea
                        placeholder="Observaciones o comentarios adicionales..."
                        {...field}
                        disabled={soloLectura}
                        rows={3}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-6">
                <FormField
                  control={form.control}
                  name="anotacionesInternas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Anotaciones Internas (no va en la orden de compra)
                      </FormLabel>
                      <Textarea
                        placeholder="Notas internas sobre esta oferta para su posible aprobación..."
                        {...field}
                        disabled={soloLectura}
                        rows={3}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <Separator />
          {/* Sección de Items */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {fields.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {fields.length} {fields.length === 1 ? "item" : "items"}
                  </span>
                )}
                {fields.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Monto Total:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      $
                      {form
                        .watch("items")
                        .reduce((total, item) => {
                          const cantidad = parseFloat(item.cantidad) || 0;
                          const precio = parseFloat(item.precio) || 0;
                          return total + cantidad * precio;
                        }, 0)
                        .toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de items agregados */}
            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((field, index) => {
                  const item = form.watch(`items.${index}`);
                  const solcomItem = item.solcomItem as any;
                  const esDeSolcom = !!item.solcomItemId;

                  return (
                    <div
                      key={field.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 space-y-2"
                    >
                      {/* Badge indicador de origen */}
                      {esDeSolcom ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            SOLCOM #{solcomItem?.solcom?.id || "N/A"}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="default"
                            className="text-xs bg-blue-500"
                          >
                            Item Manual
                          </Badge>
                        </div>
                      )}
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-12 lg:col-span-4">
                          <label className="text-xs text-gray-500 mb-0.5 block">
                            Producto
                          </label>
                          <InventarioSelector
                            value={item.inventario}
                            disabled={soloLectura}
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
                                // Precargar alícuota del inventario
                                form.setValue(
                                  `items.${index}.alicuota`,
                                  inventario.alicuota || ""
                                );
                              }
                            }}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-4 lg:col-span-2">
                          <label className="text-xs text-gray-500 mb-0.5 block">
                            Presentación
                          </label>
                          <UnidadMedidaInventarioSelector
                            value={
                              item.inventarioConversionId?.toString() || ""
                            }
                            onChange={(value) => {
                              const conversionId = value
                                ? parseInt(value)
                                : null;
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
                            unidadBase={(item.inventario as any)?.unidadMedida}
                            disabled={soloLectura}
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-2 lg:col-span-1">
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
                                disabled={soloLectura}
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-3 lg:col-span-2">
                          <label className="text-xs text-gray-500 mb-0.5 block">
                            P. Unit.
                          </label>
                          <FormField
                            control={form.control}
                            name={`items.${index}.precio`}
                            render={({ field: formField }) => (
                              <InputMoney
                                {...formField}
                                disabled={soloLectura}
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-2 lg:col-span-1">
                          <label className="text-xs text-gray-500 mb-0.5 block">
                            IVA %
                          </label>
                          <FormField
                            control={form.control}
                            name={`items.${index}.alicuota`}
                            render={({ field: formField }) => (
                              <AlicuotaIvaSelector
                                value={formField.value}
                                onChange={formField.onChange}
                                disabled={soloLectura}
                                placeholder="21%"
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-3 lg:col-span-1">
                          <label className="text-xs text-gray-500 mb-0.5 block">
                            Total
                          </label>
                          <div className="h-10 flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-600 font-medium">
                              {item.cantidad &&
                              item.precio &&
                              parseFloat(item.cantidad) > 0
                                ? formatMoney(
                                    parseFloat(item.precio) *
                                      parseFloat(item.cantidad)
                                  )
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-2 lg:col-span-1">
                          <Button
                            type="button"
                            size="sm"
                            className="w-full"
                            onClick={() => remove(index)}
                            disabled={soloLectura}
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
                            value={formField.value || ""}
                            placeholder="Descripción adicional (opcional)..."
                            disabled={soloLectura}
                          />
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Separator con texto */}
            {!soloLectura && (
              <>
                <SeparatorWithText>Agregar nuevo producto</SeparatorWithText>

                {/* Formulario para agregar nuevo item */}
                <div className="bg-primary/5 border-2 border-dashed border-primary rounded-lg p-3 space-y-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 lg:col-span-4">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Producto <span className="text-red-500">*</span>
                        </label>
                        <InventarioSelector
                          value={nuevoItem.inventario || undefined}
                          disabled={false}
                          onChange={(inventario) => {
                            if (inventario && inventario.id) {
                              setNuevoItem({
                                ...nuevoItem,
                                inventarioId: inventario.id,
                                inventario: inventario,
                                inventarioConversionId: null,
                                inventarioConversion: null,
                                alicuota: inventario.alicuota
                                  ? String(inventario.alicuota)
                                  : "",
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

                      <div className="col-span-6 sm:col-span-4 lg:col-span-2">
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

                      <div className="col-span-3 sm:col-span-2 lg:col-span-1">
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

                      <div className="col-span-3 sm:col-span-3 lg:col-span-2">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          P. Unit. <span className="text-red-500">*</span>
                        </label>
                        <InputMoney
                          value={nuevoItem.precio}
                          onChange={(value) =>
                            setNuevoItem({ ...nuevoItem, precio: value })
                          }
                          className={` ${
                            nuevoItemErrors.precio
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }`}
                        />
                        {nuevoItemErrors.precio && (
                          <p className="text-xs text-red-600 mt-0.5">
                            {nuevoItemErrors.precio}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 sm:col-span-2 lg:col-span-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          IVA %
                        </label>
                        <AlicuotaIvaSelector
                          value={nuevoItem.alicuota}
                          onChange={(value) =>
                            setNuevoItem({
                              ...nuevoItem,
                              alicuota: value,
                            })
                          }
                          placeholder="21%"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-3 lg:col-span-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Total
                        </label>
                        <div className="h-10 flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                          <span className="text-sm text-gray-600 font-medium">
                            {nuevoItem.cantidad &&
                            nuevoItem.precio &&
                            parseFloat(nuevoItem.cantidad) > 0
                              ? formatMoney(
                                  parseFloat(nuevoItem.precio) *
                                    parseFloat(nuevoItem.cantidad)
                                )
                              : "-"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-12 sm:col-span-2 lg:col-span-1">
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
              disabled={soloLectura}
              className="w-full sm:w-auto"
            >
              {duplicar
                ? "Crear Presupuesto"
                : data?.id
                  ? "Guardar"
                  : "Guardar"}
            </LoadingButton>

            {data?.id && !duplicar && puedeCrearOrdenCompra && (
              <Button
                type="button"
                onClick={() => setOpenConfirmarOrden(true)}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={
                  !puedeCrearOrdenCompra ||
                  data.estado?.codigo !== ESTADO_OFERTA_CODIGOS.OF_ACEPTADA
                }
              >
                Crear Orden Compra
              </Button>
            )}

            {data?.id && !duplicar && puedeCrear && (
              <Button
                type="button"
                onClick={handleDuplicarOferta}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </Button>
            )}

            {data?.id && !duplicar && puedeEnviarAValidar && (
              <Button
                type="button"
                onClick={() => setOpenRechazar(true)}
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={
                  !puedeEnviarAValidar ||
                  data.estado?.codigo === ESTADO_OFERTA_CODIGOS.OF_RECHAZADA
                }
              >
                Rechazar
              </Button>
            )}

            {data?.id && !duplicar && puedeEnviarAValidar && (
              <Button
                type="button"
                onClick={() => setOpenEnviarValidar(true)}
                variant="default"
                className="w-full sm:w-auto"
                disabled={
                  !puedeEnviarAValidar ||
                  solcomNoAprobada ||
                  data.estado?.codigo === ESTADO_OFERTA_CODIGOS.OF_VALIDACION
                }
              >
                Enviar a Validar
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
      </Form>

      {data?.id && !duplicar && (
        <ConfirmarOrdenCompraDialog
          open={openConfirmarOrden}
          setOpen={setOpenConfirmarOrden}
          oferta={data}
        />
      )}

      {data?.id && !duplicar && (
        <OfertaEnviarValidarDialog
          open={openEnviarValidar}
          setOpen={setOpenEnviarValidar}
          ofertaId={data.id}
        />
      )}

      {data?.id && !duplicar && (
        <OfertaRechazarDialog
          open={openRechazar}
          setOpen={setOpenRechazar}
          ofertaId={data.id}
        />
      )}
    </>
  );
}

function OfertaFormWrapper({
  data,
  duplicar,
}: {
  data?: Oferta;
  duplicar?: boolean;
}) {
  const searchParams = useSearchParams();
  const solcomIdFromUrl = searchParams.get("solcomId");
  const solcomItemIdsFromUrl = searchParams.get("solcomItemIds");
  const solcomIdsFromUrl = searchParams.get("solcomIds");

  return (
    <OfertaFormContent
      data={data}
      solcomIdFromUrl={solcomIdFromUrl}
      solcomItemIdsFromUrl={solcomItemIdsFromUrl}
      solcomIdsFromUrl={solcomIdsFromUrl}
      duplicar={duplicar}
    />
  );
}

export default function OfertaForm({
  data,
  duplicar = false,
}: {
  data?: Oferta;
  duplicar?: boolean;
}) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <OfertaFormWrapper data={data} duplicar={duplicar} />
    </Suspense>
  );
}
