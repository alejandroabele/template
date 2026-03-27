"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Inventario, InventarioConversion } from "@/types";
const formSchema = z.object({
  tipoMovimiento: z
    .string()
    .min(1, { message: "Tipo de movimiento requerido" }),
  motivo: z.string().min(1, { message: "Motivo requerido" }),
  cantidad: z.unknown({ message: "Cantidad debe ser mayor que 0" }),
  cantidadAntes: z.unknown({ message: "Cantidad debe ser mayor que 0" }),
  cantidadDespues: z.unknown({ message: "Cantidad debe ser mayor que 0" }),
  producto: z.unknown({ message: "Cantidad debe ser mayor que 0" }),
  observaciones: z.string().optional(),
  productoId: z.unknown(),
  presupuestoId: z.unknown().optional(),
  trabajoId: z.unknown().optional(),
  inventarioConversionId: z.unknown().optional(),
  centroCostoId: z.unknown().optional(),
});
import { useCreateMovimientoInventarioMutation } from "@/hooks/movimiento-inventario";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { TipoMovimientoSelector } from "../selectors/tipo-movimiento-selector";
import { PresupuestoSelector } from "../selectors/presupuesto-selector";
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction } from "react";
import { ProduccionTrabajoSelector } from "../selectors/produccion-trabajo-selector";
import { UnidadMedidaInventarioSelector } from "../selectors/unidad-medida-inventario-selector";
import { CentroCostoSelector } from "../selectors/centro-costo-selector";

type MyFormProps = {
  data?: Inventario;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function MyForm({ data, setOpen }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoMovimiento: "",
      motivo: "",
      cantidad: 0,
      observaciones: "",
      productoId: data?.id,
      cantidadAntes: data?.stock,
      producto: data,
      inventarioConversionId: null,
      presupuestoId: null,
      centroCostoId: null,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateMovimientoInventarioMutation();

  // Valores observados del formulario
  const tipoMovimiento = form.watch("tipoMovimiento");
  const cantidad = Number(form.watch("cantidad")) || 0;
  const stockActual = Number(form.watch("cantidadAntes")) || 0;
  const stockReservado = Number(data?.stockReservado) || 0;
  const stockDisponible = stockActual - stockReservado;
  const [conversionSeleccionada, setConversionSeleccionada] =
    React.useState<InventarioConversion | null>(null);

  // Calcular cantidad final considerando conversiones
  const cantidadFinal = conversionSeleccionada
    ? cantidad / Number(conversionSeleccionada.cantidad)
    : cantidad;

  // Validar si hay stock suficiente para salidas
  const stockInsuficiente =
    tipoMovimiento === "OUT" && cantidadFinal > stockActual;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validar stock antes de enviar si es un egreso (OUT)
    if (values.tipoMovimiento === "OUT") {
      const cantidadFinalEgreso = conversionSeleccionada
        ? Number(values.cantidad) / Number(conversionSeleccionada.cantidad)
        : Number(values.cantidad);

      if (cantidadFinalEgreso > stockActual) {
        toast({
          title: "Stock insuficiente",
          description: `No hay suficiente stock para realizar el egreso. Stock actual: ${stockActual} ${data?.unidadMedida || "UN"}, intentas egresar: ${cantidadFinalEgreso.toFixed(2)} ${data?.unidadMedida || "UN"}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await create(values);
      toast({
        description: "Éxito al realizar la operación",
        variant: "default",
      });
      router.back();
    } catch (error) {
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="tipoMovimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimiento *</FormLabel>
                  <TipoMovimientoSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="inventarioConversionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversion</FormLabel>
                  <UnidadMedidaInventarioSelector
                    value={field.value}
                    onChange={field.onChange}
                    id={data.id}
                    onSelect={(conversion) => {
                      setConversionSeleccionada(conversion);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad *</FormLabel>
                  <FormControl>
                    <Input
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
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
          </div>
          <div className="col-span-12">
            {/* Vista previa del impacto */}
            {tipoMovimiento && cantidad > 0 && (
              <div
                className={`p-4 rounded-lg ${stockInsuficiente ? "bg-red-50 border-2 border-red-500" : "bg-muted/50"}`}
              >
                <Label className="text-sm font-medium">Vista Previa:</Label>
                <div className="mt-1 space-y-1 text-sm">
                  {conversionSeleccionada && conversionSeleccionada.id > 0 && (
                    <div>
                      <strong>Usando conversión:</strong>{" "}
                      {conversionSeleccionada.cantidad}{" "}
                      {conversionSeleccionada.unidadOrigen} = 1{" "}
                      {conversionSeleccionada.unidadDestino}
                    </div>
                  )}

                  {/* Información de stock disponible para egresos */}
                  {(tipoMovimiento === "OUT" ||
                    tipoMovimiento === "RESERVA") && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <div>
                        <strong>Stock total:</strong> {stockActual}{" "}
                        {data?.unidadMedida || "UN"}
                      </div>
                      <div>
                        <strong>Stock reservado (otras OTs):</strong>{" "}
                        {stockReservado} {data?.unidadMedida || "UN"}
                      </div>
                      <div>
                        <strong>Stock libre disponible:</strong>{" "}
                        {stockDisponible} {data?.unidadMedida || "UN"}
                      </div>
                    </div>
                  )}

                  {tipoMovimiento === "IN" && (
                    <div>
                      Stock actual: {stockActual} →{" "}
                      {conversionSeleccionada
                        ? stockActual +
                          cantidad / Number(conversionSeleccionada.cantidad)
                        : stockActual + cantidad}
                    </div>
                  )}
                  {tipoMovimiento === "OUT" && (
                    <>
                      <div
                        className={
                          stockInsuficiente ? "text-red-700 font-semibold" : ""
                        }
                      >
                        Stock actual: {stockActual} →{" "}
                        {conversionSeleccionada
                          ? Math.max(
                              0,
                              stockActual -
                                cantidad /
                                  Number(conversionSeleccionada.cantidad)
                            )
                          : Math.max(0, stockActual - cantidad)}
                      </div>
                      {stockInsuficiente && (
                        <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 mt-2">
                          <strong>❌ Stock insuficiente:</strong> Estás
                          intentando egresar {cantidadFinal.toFixed(2)}{" "}
                          {data?.unidadMedida || "UN"} pero solo hay{" "}
                          {stockActual} {data?.unidadMedida || "UN"}{" "}
                          disponibles. Faltan{" "}
                          {(cantidadFinal - stockActual).toFixed(2)}{" "}
                          {data?.unidadMedida || "UN"}.
                        </div>
                      )}
                    </>
                  )}
                  {tipoMovimiento === "AJUSTE" && (
                    <div>
                      Stock actual: {stockActual} →{" "}
                      {conversionSeleccionada
                        ? cantidad / Number(conversionSeleccionada.cantidad)
                        : cantidad}
                    </div>
                  )}
                  {tipoMovimiento === "RESERVA" && (
                    <div>
                      Stock actual: {stockActual} →
                      {conversionSeleccionada
                        ? Math.max(
                            0,
                            stockActual -
                              cantidad / Number(conversionSeleccionada.cantidad)
                          )
                        : Math.max(0, stockActual - cantidad)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="presupuestoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden de trabajo *</FormLabel>
                  <PresupuestoSelector
                    selectedResult={
                      field.value
                        ? { id: field.value, descripcionCorta: "" }
                        : undefined
                    }
                    onSelectResult={(v) => {
                      field.onChange(v?.id || 0);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="trabajoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector *</FormLabel>
                  <ProduccionTrabajoSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="centroCostoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de Costo</FormLabel>
                  <CentroCostoSelector
                    onChange={(v) => {
                      field.onChange(v?.id || 0);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del movimiento *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Compra, venta, ajuste..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles adicionales..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <LoadingButton
            loading={isPendingCreate}
            type="submit"
            disabled={stockInsuficiente}
          >
            Guardar
          </LoadingButton>
          <Button
            type="button"
            onClick={() => {
              if (setOpen) setOpen(false);
              else {
                router.back();
              }
            }}
            variant={"outline"}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
