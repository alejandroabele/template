"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
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
import { CategoriasSelector } from "@/components/selectors/categorias-selector";
import { InventarioCategoriasSelector } from "@/components/selectors/inventario-categorias-selector";
import { InventarioSubcategoriasSelector } from "@/components/selectors/inventario-subcategorias-selector";
import { UnidadMedidaSelector } from "@/components/selectors/unidad-medida-selector";
import { CuentaContableSelector } from "@/components/selectors/cuenta-contable-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { InputMoney } from "@/components/input-money";
import { Inventario } from "@/types";
import {
  useCreateInventarioMutation,
  useEditInventarioMutation,
} from "@/hooks/inventario";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovimientoInventarioDialog } from "@/components/dialogs/movimiento-inventario-dialog";
import { InventarioConversionDialog } from "@/components/dialogs/inventario-conversion-dialog";
import { ActualizarPrecioDialog } from "@/components/dialogs/actualizar-precio-dialog";
import { MovimientosInventarioTable } from "@/components/tables/movimientos-inventario-table";
import { InventarioReservasTable } from "../tables/inventario-reservas-table";
import { InventarioConversionTable } from "../tables/inventario-conversion-table";
import { PrecioHistorialTable } from "../tables/precio-historial-table/index";
import ImagenesInput from "../form-helpers/imagenes-input";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { AlicuotaIvaSelector } from "@/components/selectors/alicuota-iva-selector";

// Definimos tipos explícitos para los selectores
type CategoriaType = number | string;
type UnidadMedidaType = number | string;

const formSchema = z.object({
  id: z.number().optional(),
  nombre: z.string({ message: "Requerido" }).min(1, { message: "Requerido" }),
  categoriaId: z
    .union([z.number(), z.string()])
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Requerido",
    }),
  inventarioCategoriaId: z
    .union([z.number(), z.string()])
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Requerido",
    }),
  inventarioSubcategoriaId: z
    .union([z.number(), z.string()])
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Requerido",
    })
    .optional(),
  stock: z.coerce.number({ message: "Requerido" }),
  stockMinimo: z.coerce.number({ message: "Requerido" }),
  stockMaximo: z.coerce.number({ message: "Requerido" }),
  stockReservado: z.unknown({ message: "Requerido" }),
  sku: z.string({ message: "Requerido" }).min(1, { message: "Requerido" }),
  punit: z.coerce.number({ message: "Requerido" }).optional(),
  alerta: z.coerce.number().optional(),
  manejaStock: z.boolean().default(false),
  esHerramienta: z.boolean().default(false),
  descripcion: z.string().optional(),
  unidadMedida: z.string().optional(),
  cuentaContableId: z
    .union([z.number(), z.string()])
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Requerido",
    })
    .optional(),
  alicuota: z.string().optional(),
});

type MyFormProps = {
  data?: Inventario;
  duplicar?: boolean;
};

export default function MyForm({ data, duplicar = false }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagenes, setImagenes] = React.useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      nombre: data?.nombre || "",
      sku: data?.sku || "",
      descripcion: data?.descripcion || "",
      categoriaId: (data?.categoriaId as CategoriaType) || undefined,
      inventarioCategoriaId:
        (data?.inventarioCategoriaId as CategoriaType) || undefined,
      inventarioSubcategoriaId:
        (data?.inventarioSubcategoriaId as CategoriaType) || undefined,
      unidadMedida: data?.unidadMedida || "",
      stock: data?.stock || 0,
      stockMinimo: data?.stockMinimo || 0,
      stockMaximo: data?.stockMaximo || 0,
      stockReservado: data?.stockReservado || 0,
      punit: data?.punit || 0,
      alerta: data?.alerta || 0,
      manejaStock: data?.manejaStock || false,
      esHerramienta: data?.esHerramienta || false,
      cuentaContableId: data?.cuentaContableId || undefined,
      alicuota: data?.alicuota || undefined,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateInventarioMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditInventarioMutation();

  const { handleMultipleFileUpload } = useFileUploadHandler();

  const [openMovimientoInventario, setOpenMovimientoInventario] =
    React.useState(false);
  const [openConversion, setOpenConversion] = React.useState(false);
  const [openActualizarPrecio, setOpenActualizarPrecio] = React.useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let id;
      if (duplicar) {
        delete values.id;
      }
      delete values.stockReservado;
      if (values.id) {
        await edit({ id: values.id, data: values });
        id = values.id;
      } else {
        const response = await create(values);
        id = response.id;
      }
      if (id) {
        await handleMultipleFileUpload({
          data: data,
          fileArray: imagenes,
          modelo: "inventario",
          modeloId: id,
          tipo: "imagenes",
        });
      }
      toast({
        title: "Operación exitosa",
        description: "El producto se ha guardado correctamente",
        variant: "default",
      });
      router.back();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el producto",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      {data?.id && (
        <MovimientoInventarioDialog
          id={data?.id}
          open={openMovimientoInventario}
          setOpen={setOpenMovimientoInventario}
        />
      )}
      {data?.id && (
        <InventarioConversionDialog
          open={openConversion}
          setOpen={setOpenConversion}
          inventario={data}
        />
      )}
      {data?.id && (
        <ActualizarPrecioDialog
          open={openActualizarPrecio}
          setOpen={setOpenActualizarPrecio}
          inventarioId={data.id}
          precioActual={data.punit || 0}
        />
      )}
      <div className="py-6 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="precio">Precios</TabsTrigger>
                <TabsTrigger value="inventario">Inventario</TabsTrigger>
                <TabsTrigger disabled={!!!data?.id} value="movimientos">
                  Movimientos
                </TabsTrigger>
                <TabsTrigger disabled={!!!data?.id} value="reservas">
                  Reservas
                </TabsTrigger>
                <TabsTrigger disabled={!!!data?.id} value="conversion">
                  Conversiones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Información básica del producto</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del producto *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Laptop HP EliteBook"
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
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: PROD-001"
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
                      name="categoriaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Familia Producto *</FormLabel>
                          <CategoriasSelector
                            value={field.value as CategoriaType}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inventarioCategoriaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría *</FormLabel>
                          <InventarioCategoriasSelector
                            value={field.value as CategoriaType}
                            onChange={field.onChange}
                            inventarioFamiliaId={form.watch("categoriaId")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inventarioSubcategoriaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategoría *</FormLabel>
                          <InventarioSubcategoriasSelector
                            value={field.value as CategoriaType}
                            onChange={field.onChange}
                            inventarioCategoriaId={form.watch(
                              "inventarioCategoriaId"
                            )}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidad de medida *</FormLabel>
                          <UnidadMedidaSelector
                            value={field.value as UnidadMedidaType}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <ImagenesInput
                        label="Imagenes"
                        value={imagenes}
                        setValue={setImagenes}
                        defaultValue={data?.adjuntos}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descripción detallada del producto..."
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="precio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Precio y Contabilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="punit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio unitario *</FormLabel>
                          <FormControl>
                            <InputMoney {...field} className="w-full" disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alicuota"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alícuota IVA</FormLabel>
                          <AlicuotaIvaSelector
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Seleccionar alícuota"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cuentaContableId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuenta Contable</FormLabel>
                          <CuentaContableSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {data?.id && (
                  <PrecioHistorialTable inventarioId={data.id} />
                )}
              </TabsContent>

              <TabsContent value="inventario">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      Gestión de inventario
                      <FormField
                        control={form.control}
                        name="manejaStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Manejar stock
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="esHerramienta"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Es herramienta
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {form.watch("manejaStock") ? (
                      <>
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock actual *</FormLabel>
                              <FormControl>
                                <Input
                                  onInput={(e) => {
                                    e.currentTarget.value =
                                      e.currentTarget.value
                                        .replace(/[^0-9.,]/g, "")
                                        .replace(",", ".");
                                  }}
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="stockReservado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock Reservado *</FormLabel>
                              <FormControl>
                                <Input
                                  onInput={(e) => {
                                    e.currentTarget.value =
                                      e.currentTarget.value
                                        .replace(/[^0-9.,]/g, "")
                                        .replace(",", ".");
                                  }}
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stockMinimo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock mínimo *</FormLabel>
                              <FormControl>
                                <Input
                                  onInput={(e) => {
                                    e.currentTarget.value =
                                      e.currentTarget.value
                                        .replace(/[^0-9.,]/g, "")
                                        .replace(",", ".");
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stockMaximo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock máximo *</FormLabel>
                              <FormControl>
                                <Input
                                  onInput={(e) => {
                                    e.currentTarget.value =
                                      e.currentTarget.value
                                        .replace(/[^0-9.,]/g, "")
                                        .replace(",", ".");
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="alerta"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel de alerta</FormLabel>
                              <FormControl>
                                <Input
                                  onInput={(e) => {
                                    e.currentTarget.value =
                                      e.currentTarget.value
                                        .replace(/[^0-9.,]/g, "")
                                        .replace(",", ".");
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <div className="col-span-full">
                        <Alert variant="info">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Stock desactivado</AlertTitle>
                          <AlertDescription>
                            Este producto no tendrá control de inventario.
                            Activa la opción "Manejar stock" para habilitar las
                            configuraciones de inventario.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="movimientos">
                <MovimientosInventarioTable id={data?.id} />
              </TabsContent>
              <TabsContent value="reservas">
                <InventarioReservasTable id={data?.id} />
              </TabsContent>
              <TabsContent value="conversion">
                <InventarioConversionTable inventario={data} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <LoadingButton
                type="button"
                loading={isPendingCreate || isPendingEdit}
                disabled={!!!data?.id}
                onClick={() => setOpenConversion(true)}
              >
                Agregar conversión
              </LoadingButton>
              <LoadingButton
                type="button"
                loading={isPendingCreate || isPendingEdit}
                disabled={!!!data?.id}
                onClick={() => setOpenActualizarPrecio(true)}
              >
                Actualizar precio
              </LoadingButton>
              <LoadingButton
                type="button"
                loading={isPendingCreate || isPendingEdit}
                disabled={!!!data?.id}
                onClick={() =>
                  router.push("/productos/" + data?.id + "/crear-movimiento")
                }
              >
                {"Registrar Movimiento"}
              </LoadingButton>
              <LoadingButton
                type="submit"
                loading={isPendingCreate || isPendingEdit}
              >
                {data?.id ? "Guardar cambios" : "Crear producto"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
