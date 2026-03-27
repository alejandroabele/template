"use client";
//FIX
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CardContent,
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Clipboard,
  Package,
  ListChecks,
  BadgeDollarSign,
  AlertCircle,
  Mail,
  FileSliders,
  BarChart3,
  History,
} from "lucide-react";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { ProcesoGeneralSelector } from "@/components/selectors/proceso-general";
import { AreaSelector } from "@/components/selectors/areas-selector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Presupuesto, Cliente } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { today } from "@/utils/date";
import { Textarea } from "@/components/ui/textarea";
import { DETALLE_PRESUPUESTO } from "@/constants/presupuesto";
import { Switch } from "@/components/ui/switch";
import { PresupuestoItemForm } from "@/components/forms/presupuesto-item-form";
import { Button } from "@/components/ui/button";
import { PresupuestoResumen } from "@/components/form-helpers/presupuesto-resumen";
import { PresupuestoTimeline } from "@/components/features/presupuesto-timeline";
import {
  useCreatePresupuestoMutation,
  useEditPresupuestoMutation,
} from "@/hooks/presupuestos";
import { LoadingButton } from "@/components/ui/loading-button";
import { useStore as useGlobalStore } from "@/lib/store";
import { CosteoComercialForm } from "@/components/forms/costeo-comercial-form";
import { PresupuestoFacturacionForm } from "@/components/forms/presupuesto-administracion-form";
import { PresupuestoAnalisisCostos } from "@/components/pages/presupuesto-analisis-costos";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { PROCESO_GENERAL, ESTATUS } from "@/constants/presupuesto";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { useSearchParams, useRouter } from "next/navigation";

export const formSchema = z.object({
  id: z.number().optional(),
  fecha: z.unknown({ message: "Requerido" }),
  clienteId: z.unknown({ message: "Cliente requerido" }),
  vendedorId: z.unknown({ message: "Vendedor requerido" }),
  cliente: z.unknown({ message: "Cliente requerido" }).optional(),
  contacto: z.unknown({ message: "Contacto requerido" }),
  comprador: z.string({ message: "Comprador requerido" }).optional(),
  procesoGeneral: z.unknown({ message: "Proceso General requerido" }),
  procesoGeneralId: z
    .number({ message: "Proceso General requerido" })
    .min(1, { message: "Este campo es requerido" }),
  areaId: z.unknown({ message: "Area requerido" }),
  area: z.unknown({ message: "Area requerido" }),
  descripcionCorta: z.string({ message: "Descripcion  requerido" }).optional(),
  disenoSolicitar: z.unknown({ message: "Requerido" }).optional(),
  disenoEstatus: z.unknown({ message: "Requerido" }).optional(),
  disenoUbicacion: z.string({ message: "Requerido" }).optional(),
  proyeccion: z.unknown({ message: "Area requerido" }).optional(),
  estructuraComision: z.unknown({ message: "Area requerido" }).optional(),
  estructuraCosto: z.unknown({ message: "Area requerido" }).optional(),
  vendedorComision: z.unknown({ message: "Area requerido" }).optional(),
  vendedorCosto: z.unknown({ message: "Area requerido" }).optional(),
  directorComision: z.unknown({ message: "Area requerido" }).optional(),
  directorCosto: z.unknown({ message: "Area requerido" }).optional(),
  costoAdminTotal: z.unknown({ message: "Area requerido" }).optional(),
  ventaTotal: z.unknown({ message: "Area requerido" }).optional(),
  costoTotal: z.unknown({ message: "Area requerido" }).optional(),
  taxIngresosComision: z.unknown({ message: "Requerudi" }).optional(),
  taxIngresosCosto: z.unknown({ message: "Requerudi" }).optional(),
  taxTransfComision: z.unknown({ message: "Requerudi" }).optional(),
  taxTransfCosto: z.unknown({ message: "Requerudi" }).optional(),
  taxGananciasComision: z.unknown({ message: "Requerudi" }).optional(),
  taxGananciasCosto: z.unknown({ message: "Requerudi" }).optional(),
  taxTotal: z.unknown({ message: "Requerudi" }).optional(),
  contribucionMarginal: z.unknown({ message: "Requerudi" }).optional(),
  margenTotal: z.unknown({ message: "Requerudi" }).optional(),
  bab: z.unknown({ message: "Requerudi" }).optional(),
  fechaEntregado: z.unknown({ message: "Requerudi" }).optional(),
  condicionIva: z.string({ message: "Requerido" }).optional(),
  condicionPago: z.string({ message: "Requerido" }).optional(),
  tiempoEntrega: z.string({ message: "Requerido" }).optional(),
  lugarEntrega: z.string({ message: "Requerido" }).optional(),
  mantOferta: z.string({ message: "Requerido" }).optional(),
  descripcionGlobal: z.string({ message: "Requerido" }).optional(),
  costeoEstatus: z.unknown({ message: "Requerido" }).optional(),
  costeoComercialEstatus: z.unknown({ message: "Requerido" }).optional(),
  cobranzaEstatus: z.string({ message: "Requerido" }).optional(),
  produccionEstatus: z.string({ message: "Requerido" }).optional(),
  moneda: z.string({ message: "Requerido" }).optional(),
  facturacionEstatus: z.string({ message: "Requerido" }).optional(),
  montoFacturado: z.unknown({ message: "Requerudi" }).optional(),
  montoCobrado: z.unknown({ message: "Requerudi" }).optional(),
  montoRetenciones: z.unknown({ message: "Requerudi" }).optional(),
  fechaEntregaEstimada: z.unknown({ message: "Requerudi" }).optional(),
  contactoCasoId: z.number().optional(),
});

type PresupuestoProps = {
  data?: Presupuesto;
};
export default function PresupuestoForm({ data }: PresupuestoProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const canVerItems = hasPermission(PERMISOS.PRESUPUESTO_ITEM_VER);
  const canEditarPresupuesto = hasPermission(PERMISOS.PRESUPUESTOS_EDITAR);
  const canVerCosteoComercial = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_COMERCIAL_VER
  );
  const canVerFacturacion = hasPermission(PERMISOS.PRESUPUESTO_FACTURACION_VER);
  const canVerCobro = hasPermission(PERMISOS.PRESUPUESTO_COBRO_VER);
  const canVerAnalisis = hasPermission(PERMISOS.PRESUPUESTOS_VER_ANALISIS);
  const canCosteoTecnicoCrear = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_TECNICO_CREAR
  );
  const canCosteoComercialCrear = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_COMERCIAL_CREAR
  );
  const canEnviarAlmacen = hasPermission(
    PERMISOS.PRESUPUESTOS_ENVIAR_A_ALMACEN
  );

  // Obtener el tab inicial de los query params o usar 'informacion' por defecto
  const initialTab = searchParams.get("tab") || "informacion";
  const [tabValue, setTabValue] = React.useState(initialTab);

  // Obtener el casoId de los query params
  const casoId = searchParams.get("casoId");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || 0,
      clienteId: data?.clienteId || null,
      cliente: data?.cliente,
      fecha: data?.fecha || today(),
      fechaEntregaEstimada: data?.fechaEntregaEstimada,
      comprador: data?.comprador || "",
      // procesoId: data?.procesoId || 0,
      // proceso: data?.proceso,
      procesoGeneralId: data?.procesoGeneralId || 0,
      procesoGeneral: data?.procesoGeneral,
      areaId: data?.areaId || null,
      area: data?.area,
      proyeccion: data?.proyeccion || 0,
      disenoSolicitar: data?.disenoSolicitar,
      descripcionCorta: data?.descripcionCorta || "",
      disenoEstatus: data?.disenoEstatus || "",
      disenoUbicacion: data?.disenoUbicacion || "",
      vendedorId: data?.vendedorId || null,
      estructuraComision: data?.estructuraComision || 7,
      estructuraCosto: data?.estructuraCosto || 0,
      vendedorComision: data?.vendedorComision || 2,
      vendedorCosto: data?.vendedorCosto || 0,
      directorComision: data?.directorComision || 0,
      directorCosto: data?.directorCosto || 0,
      costoAdminTotal: data?.costoAdminTotal || 0,
      ventaTotal: data?.ventaTotal || 0,
      costoTotal: data?.costoTotal || 0,
      taxIngresosComision: data?.taxIngresosComision || 3,
      taxIngresosCosto: data?.taxIngresosCosto || 0,
      taxTransfComision: data?.taxTransfComision || 1.2,
      taxTransfCosto: data?.taxTransfCosto || 0,
      taxGananciasComision: data?.taxGananciasComision || 20,
      taxGananciasCosto: data?.taxGananciasCosto || 0,
      taxTotal: data?.taxTotal || 0,
      contribucionMarginal: data?.contribucionMarginal || 0,
      margenTotal: data?.margenTotal || 0,
      bab: data?.bab || 0,
      condicionIva: data?.condicionIva || DETALLE_PRESUPUESTO.CONDICION_IVA,
      condicionPago: data?.condicionPago || DETALLE_PRESUPUESTO.CONDICION_PAGO,
      tiempoEntrega: data?.tiempoEntrega || DETALLE_PRESUPUESTO.TIEMPO_ENTREGA,
      lugarEntrega: data?.lugarEntrega || DETALLE_PRESUPUESTO.LUGAR_ENTREGA,
      mantOferta: data?.mantOferta || DETALLE_PRESUPUESTO.MANT_OFERTA,
      descripcionGlobal:
        data?.descripcionGlobal || DETALLE_PRESUPUESTO.DESCRIPCION_GLOBAL,
      costeoEstatus: data?.costeoEstatus || ESTATUS.pendiente,
      costeoComercialEstatus: data?.costeoComercialEstatus || ESTATUS.pendiente,
      cobranzaEstatus: data?.cobranzaEstatus || ESTATUS.pendiente,
      produccionEstatus: data?.produccionEstatus || ESTATUS.pendiente,
      facturacionEstatus: data?.facturacionEstatus || ESTATUS.pendiente,
      fechaEntregado: data?.fechaEntregado || null,
      montoFacturado: data?.montoFacturado || 0,
      montoCobrado: data?.montoCobrado || 0,
      montoRetenciones: data?.montoRetenciones || 0,
      moneda: data?.moneda || DETALLE_PRESUPUESTO.MONEDA,
      contactoCasoId:
        data?.contactoCasoId || (casoId ? Number(casoId) : undefined),
    },
  });
  const [items, setItems] = React.useState(
    data?.items ||
      "" || [
        {
          descripcion: "",
          cantidad: 0,
          detalles: "",
          observaciones: "",
          archivo: null,
          archivos: [],
          receta: null,
          punit: 0,
          importe: 0,
        },
      ]
  );

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreatePresupuestoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditPresupuestoMutation();
  const user = useGlobalStore((state) => state.user);
  const { handleFileUpload } = useFileUploadHandler();
  // Función para manejar el cambio de tab y actualizar la URL
  const handleTabChange = (newTab: string) => {
    setTabValue(newTab);

    // Crear nuevos query params manteniendo los existentes
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);

    // Actualizar la URL sin recargar la página
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const validarCantidades = () => {
    return items.every((item) => {
      if (!item.produccionTrabajos) return true; // Si no tiene producción, es válido

      // Verificar todas las categorías (producto, servicio)
      return Object.values(item.produccionTrabajos).every((categoria: any) => {
        return categoria.every((trabajo: any) => {
          // Verificar todas las subcategorías (materiales, suministros, manoDeObra)
          return ["materiales", "suministros", "manoDeObra"].every(
            (subcategoria) => {
              if (!trabajo[subcategoria]) return true;

              return trabajo[subcategoria].every((item: any) => {
                return (
                  item.cantidad !== "" &&
                  item.cantidad !== null &&
                  item.cantidad !== undefined &&
                  Number(item.cantidad) > 0
                );
              });
            }
          );
        });
      });
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let response: any;

    const payload = {
      ...values,
      items: items.map(({ archivos, remove, ...rest }) => rest), // Elimina archivos de cada ítem
    };
    try {
      // TODO: Crear servicio para eliminar o crear archivos pero de alquileres

      if (values.id) {
        response = await edit({ id: values.id, data: payload });
      } else {
        // delete payload.id
        payload.vendedorId = user?.userId;
        response = await create(payload);

        if (response?.id) {
          // form.setValue('id', response.id)
          form.setValue("id", response.id);
          router.push("/presupuestos/" + response.id);
        }
      }
      if (response?.items) {
        for (const [index, item] of items.entries()) {
          const itemId = item.id || response.items[index]?.id;
          if (!itemId) continue;
          await handleFileUpload({
            fileId: item.remove ? item.archivo?.id : undefined,
            fileArray: item.archivos,
            modelo: "presupuesto_item",
            modeloId: itemId,
            tipo: "",
          });
        }
      }

      toast({
        description: `Exito al ${values.id ? "actualizar" : "crear"}  el presupuesto`,
        variant: "success",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }
  const procesoGeneralDisabled = () => {
    // if (hasPermission(PERMISOS.PRESUPUESTOS_COSTEO_TECNICO_CREAR)) {
    //   return (
    //     form.getValues("procesoGeneralId") !== PROCESO_GENERAL.COSTEO_TECNICO
    //   );
    // }
    // if (hasPermission(PERMISOS.PRESUPUESTOS_COSTEO_COMERCIAL_CREAR)) {
    //   return (
    //     form.getValues("procesoGeneralId") !== PROCESO_GENERAL.COSTEO_COMERCIAL
    //   );
    // }
    // TODO: RESOLVER ANTES DE PASAR A PRODUCCION
  };

  const ButtonActions = () => {
    const handleButtonClick = async () => {
      // Primero se valida el formulario antes de proceder
      if (!validarCantidades()) {
        toast({
          title: "Revisión necesaria",
          description: "Hay algunos ítems que no tienen una cantidad asignada.",
          variant: "warning",
        });
        return;
      }

      const isValid = await form.trigger(); // Ejecuta la validación
      if (!isValid) {
        // Si la validación falla, no hacer nada
        toast({
          description: "Por favor, completa todos los campos correctamente",
        });
        return;
      }

      // Si estamos en la pestaña de resumen y el formulario es válido, enviamos el formulario
      if (tabValue === "resumen") {
        form.handleSubmit(onSubmit)();
      } else {
        // Si no estamos en "resumen", cambiamos a la pestaña "resumen"
        setTabValue("resumen");
      }
    };
    const handleTerminarCosteoTecnico = () => {
      form.setValue("costeoEstatus", "completo");
      form.setValue("procesoGeneralId", PROCESO_GENERAL.COSTEO_COMERCIAL);
      form.setValue("procesoGeneral", {
        id: PROCESO_GENERAL.COSTEO_COMERCIAL,
        nombre: "COSTEO COMERCIAL",
      });
      handleButtonClick();
    };

    const handleTerminarCosteoComercial = () => {
      form.setValue("costeoComercialEstatus", "completo");
      form.setValue("procesoGeneralId", PROCESO_GENERAL.PROPUESTA_PREPARADA);
      form.setValue("procesoGeneral", {
        id: PROCESO_GENERAL.PROPUESTA_PREPARADA,
        nombre: "PROPUESTA PREPARADA",
      });
      handleButtonClick();
    };

    const handleEnviarAAlmacen = () => {
      form.setValue("procesoGeneralId", PROCESO_GENERAL.ENVIADO_A_ALMACEN);
      form.setValue("procesoGeneral", {
        id: PROCESO_GENERAL.ENVIADO_A_ALMACEN,
        nombre: "ENVIADO A ALMACEN",
      });
      handleButtonClick();
    };

    return (
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <LoadingButton
          loading={isPendingCreate || isPendingEdit}
          onClick={handleButtonClick}
          type="button"
        >
          Guardar
        </LoadingButton>
        {canCosteoTecnicoCrear && (
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            onClick={handleTerminarCosteoTecnico}
            type="button"
          >
            Terminar Costeo Técnico
          </LoadingButton>
        )}
        {canCosteoComercialCrear && (
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            onClick={handleTerminarCosteoComercial}
            type="button"
          >
            Terminar Costeo Comercial
          </LoadingButton>
        )}
        {canEnviarAlmacen && (
          <LoadingButton
            loading={isPendingCreate || isPendingEdit}
            onClick={handleEnviarAAlmacen}
            type="button"
          >
            Enviar a Almacen
          </LoadingButton>
        )}

        <Button type="button" onClick={() => router.back()} variant={"link"}>
          Volver
        </Button>
      </div>
    );
  };

  const mostrarInfoDiseno: ReactNode = (form.watch(
    "disenoSolicitar"
  ) as boolean) ? (
    <div className="pt-4 space-y-2 w-full text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="">Estado:</span>
        <Badge
          variant={
            (form.watch("disenoEstatus") as string) === "completo"
              ? "success"
              : "destructive"
          }
        >
          {(form.watch("disenoEstatus") as string) === "completo"
            ? "Completo"
            : "Pendiente"}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="">Ubicación:</span>
        <span className="text-sm font-bold italic">
          {(form.watch("disenoUbicacion") as string) || "Archivo No cargado"}
        </span>
      </div>
    </div>
  ) : (
    ""
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={tabValue} onValueChange={handleTabChange} className="">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="informacion" className="text-center flex gap-2">
              <span className="hidden sm:inline">Información</span>
              <Clipboard className="w-5 h-5" />
            </TabsTrigger>
            {canVerItems && (
              <TabsTrigger value="items" className="text-center flex gap-2">
                <span className="hidden sm:inline">Items</span>
                <Package className="w-5 h-5" />
              </TabsTrigger>
            )}
            {canVerCosteoComercial && (
              <TabsTrigger
                disabled={!data}
                value="costeo_comercial"
                className="text-center flex gap-2"
              >
                <span className="hidden sm:inline">Costeo Comercial</span>
                <BadgeDollarSign className="w-5 h-5" />
              </TabsTrigger>
            )}
            {(canVerFacturacion || canVerCobro) && (
              <TabsTrigger
                disabled={!data}
                value="administracion"
                className="text-center flex gap-2"
              >
                <span className="hidden sm:inline">Administración</span>
                <FileSliders className="w-5 h-5" />
              </TabsTrigger>
            )}
            {canVerAnalisis && (
              <TabsTrigger
                disabled={!data}
                value="analisis-costos"
                className="text-center flex gap-2"
              >
                <span className="hidden sm:inline">Inventario</span>
                <BarChart3 className="w-5 h-5" />
              </TabsTrigger>
            )}
            <TabsTrigger
              disabled={!data}
              value="historial"
              className="text-center flex gap-2"
            >
              <span className="hidden sm:inline">Historial</span>
              <History className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="resumen" className="text-center flex gap-2">
              <span className="hidden sm:inline">Resumen</span>
              <ListChecks className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="informacion">
            <Card className="">
              <CardHeader className="rounded-t-lg border-b bg-muted flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="">
                    Información del Presupuesto
                  </CardTitle>
                  <CardDescription>
                    Ingresa los datos básicos del presupuesto
                  </CardDescription>
                </div>
                {data?.id && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full "
                    onClick={() =>
                      router.push(`${window.location.pathname}/mensajes`)
                    }
                    type="button"
                  >
                    <Mail />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-8  mx-auto py-10">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-3">
                      <DatePicker
                        label="Fecha"
                        form={form}
                        name="fecha"
                        fromYear={2020}
                        disabled={!canEditarPresupuesto}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número del presupuesto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                readOnly
                                disabled
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Generado automaticamente
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3  space-y-2">
                      <Label>Area</Label>
                      <AreaSelector
                        value={form.getValues("area")}
                        onChange={(v) => {
                          form.setValue("areaId", v.id);
                          form.setValue("area", v);
                        }}
                        disabled={!canEditarPresupuesto}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <DatePicker
                        label="Fecha entrega"
                        form={form}
                        name="fechaEntregaEstimada"
                        fromYear={2020}
                        disabled
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6  space-y-2">
                      <Label>Cliente</Label>
                      <ClienteSelector
                        value={form.getValues("cliente")}
                        onChange={(v: Cliente) => {
                          form.setValue("clienteId", v.id);
                          form.setValue("cliente", v);
                          form.setValue("comprador", v.contacto);
                        }}
                        disabled={!canEditarPresupuesto}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormField
                        control={form.control}
                        name="comprador"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comprador</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                type="text"
                                disabled={!canEditarPresupuesto}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Nombre del contato
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-12  space-y-2">
                      <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                        <Label className="font-bold text-primary flex items-center gap-2 pb-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Proceso General{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Este campo es crítico y debe ser seleccionado
                          correctamente antes de guardar el presupuesto. El
                          proceso general determina el flujo de trabajo y las
                          etapas del presupuesto.
                        </p>
                        <ProcesoGeneralSelector
                          proceso={() => form.getValues("procesoGeneral")}
                          onChange={(v: Cliente) => {
                            form.setValue("procesoGeneralId", v.id);
                            form.setValue("procesoGeneral", v);
                            // Trigger validation after setting the value
                            form.trigger("procesoGeneralId");
                          }}
                          disabled={procesoGeneralDisabled()}
                        />
                        {form.formState.errors.procesoGeneralId && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {
                              form.formState.errors.procesoGeneralId
                                .message as string
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6  space-y-2"></div>

                    <div className="col-span-12 md:col-span-12  space-y-2">
                      <FormField
                        control={form.control}
                        name="descripcionCorta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder=""
                                className="resize-none"
                                {...field}
                                disabled={!canEditarPresupuesto}
                              />
                            </FormControl>
                            <FormDescription>
                              Podes usar este espacio para almacenar una breve
                              descripcion del presupuesto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-12  space-y-2">
                      <FormField
                        control={form.control}
                        name="disenoSolicitar"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Solicitar diseño
                              </FormLabel>
                              <FormDescription>
                                Seleccionar esta opción en el caso de requerir
                                un diseño personalizado
                              </FormDescription>
                              {mostrarInfoDiseno}
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!canEditarPresupuesto}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ButtonActions />
          </TabsContent>
          <TabsContent value="items">
            {canVerItems && (
              <div>
                <Card>
                  <CardHeader className="rounded-t-lg border-b bg-muted">
                    <CardTitle>Ítems del Presupuesto</CardTitle>
                    <CardDescription>
                      Agrega los productos o servicios que forman parte de este
                      presupuesto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-3 ">
                    <PresupuestoItemForm
                      presupuestoId={data?.id}
                      items={items} // Pasa los items directamente
                      setItems={setItems} // Pasa setItems
                    />
                  </CardContent>
                </Card>
                <ButtonActions />
              </div>
            )}
          </TabsContent>
          <TabsContent value="costeo_comercial">
            {canVerCosteoComercial && (
              <>
                <CosteoComercialForm
                  form={form}
                  items={items}
                  setItems={setItems}
                />
                <ButtonActions />
              </>
            )}
          </TabsContent>
          <TabsContent value="administracion">
            {(canVerFacturacion || canVerCobro) && (
              <>
                <PresupuestoFacturacionForm form={form} />
                <ButtonActions />
              </>
            )}
          </TabsContent>
          <TabsContent value="analisis-costos">
            {canVerAnalisis && data?.id && (
              <PresupuestoAnalisisCostos presupuestoId={data.id} />
            )}
          </TabsContent>
          <TabsContent value="historial">
            <>{data?.id && <PresupuestoTimeline presupuestoId={data.id} />}</>
          </TabsContent>
          <TabsContent value="resumen">
            <PresupuestoResumen form={form} items={items} />
            <ButtonActions />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

// TODO: Cuando actualizo el precio y me muevo en los tabs me toma uno viejo
// TODO: Agregar el cliente al precio
