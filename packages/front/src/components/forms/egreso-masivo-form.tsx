"use client";

import React, { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, FileText } from "lucide-react";
import { PresupuestoSelector } from "../selectors/presupuesto-selector";
import { CentroCostoSelector } from "../selectors/centro-costo-selector";
import { ProduccionTrabajoSelector } from "../selectors/produccion-trabajo-selector";
import { ReservaSelector } from "../selectors/reserva-selector";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { PersonaSelector } from "@/components/selectors/persona-selector";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useGetInventarioReservasQuery } from "@/hooks/inventario-reserva";
import {
  useGetReservaByIdQuery,
  useDownloadReservaPdfMutation,
  useDownloadEgresoOtPdfMutation,
} from "@/hooks/reserva";
import { useEgresoMasivoMutation } from "@/hooks/movimiento-inventario";
import type { EgresoMasivo } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";

// --- Types & Schemas ---

const formSchema = z.object({
  tipo: z.enum(["presupuesto", "centro-costo", "reserva"]),
  presupuestoId: z.number().optional(),
  trabajoId: z.number().optional(),
  centroCostoId: z.number().optional(),
  reservaId: z.number().optional(),
  personaId: z.number().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type ProductoConsumo = {
  reservaId: number | null;
  productoId: number;
  productoNombre: string;
  cantidadReservada: number;
  cantidadAConsumir: number | string;
  stockDisponible: number;
  stockReservado: number;
  stockLibre?: number;
  trabajoNombre?: string;
  unidadMedida?: string;
  seleccionado: boolean;
  esNuevo?: boolean;
  inventario?: any;
};

type InventarioItem = {
  id: number;
  nombre: string;
  stock?: number;
  stockReservado?: number;
  unidadMedida?: string;
};

// --- Main Component ---

export default function EgresoMasivoForm() {
  const [productos, setProductos] = useState<ProductoConsumo[]>([]);
  const router = useRouter();
  const { mutateAsync } = useEgresoMasivoMutation();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "presupuesto",
      presupuestoId: 0,
      trabajoId: 0,
      centroCostoId: 0,
      reservaId: 0,
    },
  });

  const tipo = form.watch("tipo");
  const presupuestoId = form.watch("presupuestoId") || 0;
  const trabajoId = form.watch("trabajoId") || 0;
  const centroCostoId = form.watch("centroCostoId") || 0;
  const reservaId = form.watch("reservaId") || 0;
  const personaId = form.watch("personaId");

  // Reset al cambiar tipo
  useEffect(() => {
    form.setValue("presupuestoId", 0);
    form.setValue("trabajoId", 0);
    form.setValue("centroCostoId", 0);
    form.setValue("reservaId", 0);
    form.setValue("personaId", undefined);
    setProductos([]);
  }, [tipo, form]);

  // Query para reservas
  const filtrosPorTipo = {
    presupuesto:
      presupuestoId > 0 && trabajoId > 0
        ? [
            { id: "presupuestoId", value: presupuestoId },
            { id: "trabajoId", value: trabajoId },
          ]
        : [],
    "centro-costo": [],
    reserva: reservaId > 0 ? [{ id: "reservaId", value: reservaId }] : [],
  };

  const { data: reservas, isLoading: isLoadingReservas } =
    useGetInventarioReservasQuery({
      pagination: { pageIndex: 0, pageSize: 1000 },
      columnFilters: filtrosPorTipo[tipo],
      sorting: [],
      enabled: filtrosPorTipo[tipo].length > 0,
    });
  const { data: reservaDetalle } = useGetReservaByIdQuery(
    tipo === "reserva" ? reservaId : 0
  );

  // Cuando se selecciona una reserva, precargar su persona
  useEffect(() => {
    if (tipo === "reserva" && reservaDetalle?.personaId) {
      form.setValue("personaId", reservaDetalle.personaId);
    }
  }, [reservaDetalle, tipo, form]);

  // Cargar productos desde reservas
  useEffect(() => {
    if (reservas && reservas.length > 0) {
      const productosConsumo: ProductoConsumo[] = reservas.map((reserva) => {
        const stock = Number(reserva.producto?.stock || 0);
        const stockReservadoTotal = Number(
          reserva.producto?.stockReservado || 0
        ); // TODO: ANALIZAR ESTE VALOR, ME LLEGA 0
        const cantidadReservada = Number(reserva.cantidad);
        const stockLibre = Math.max(
          0,
          stock - (stockReservadoTotal - cantidadReservada)
        );

        console.log(stockLibre);
        console.log({
          stock,
          stockReservadoTotal,
          cantidadReservada,
          stockLibre,
        });

        // TODO: REVISAR ACA EL CALCULO DE STOCK LIBRE

        return {
          reservaId: reserva.id,
          productoId: reserva.productoId,
          productoNombre: reserva.producto?.nombre || "Sin nombre",
          cantidadReservada,
          cantidadAConsumir: cantidadReservada,
          stockDisponible: stock,
          stockReservado: stockReservadoTotal,
          stockLibre,
          trabajoNombre: reserva.trabajo?.nombre,
          unidadMedida: reserva.producto?.unidadMedida || "UN",
          seleccionado: true,
          esNuevo: false,
          inventario: reserva.producto,
        };
      });
      setProductos(productosConsumo);
    } else {
      setProductos([]);
    }
  }, [reservas]);

  const handleProcesarEgreso = async () => {
    const productosSeleccionados = productos.filter((p) => p.seleccionado);

    if (productosSeleccionados.length === 0) {
      toast({
        description: "Debes seleccionar al menos un producto",
        variant: "destructive",
      });
      return;
    }

    const hayErrores = productosSeleccionados.some((p) => {
      const cantidad =
        typeof p.cantidadAConsumir === "string"
          ? parseFloat(p.cantidadAConsumir)
          : p.cantidadAConsumir;
      return isNaN(cantidad) || cantidad <= 0;
    });

    if (hayErrores) {
      toast({
        description: "Todas las cantidades deben ser mayores a 0",
        variant: "destructive",
      });
      return;
    }

    const productosSinStock = productosSeleccionados.filter((p) => {
      const cantidadAConsumir =
        typeof p.cantidadAConsumir === "string"
          ? parseFloat(p.cantidadAConsumir)
          : p.cantidadAConsumir;
      return cantidadAConsumir > (p.stockLibre ?? 0);
    });

    if (productosSinStock.length > 0) {
      toast({
        title: "Stock insuficiente",
        description: <StockInsuficienteAlert productos={productosSinStock} />,
        variant: "destructive",
      });
      return;
    }

    const payload = {
      tipo,
      presupuestoId: presupuestoId || undefined,
      trabajoId,
      centroCostoId: centroCostoId || undefined,
      reservaId: reservaId || undefined,
      personaId: personaId || undefined,
      productos: productosSeleccionados.map((p) => ({
        reservaId: p.reservaId || null,
        productoId: p.productoId,
        cantidad:
          typeof p.cantidadAConsumir === "string"
            ? parseFloat(p.cantidadAConsumir)
            : p.cantidadAConsumir,
        cantidadReservada: p.cantidadReservada,
      })),
    };

    try {
      await mutateAsync(payload);
      toast({
        description: `Egreso masivo procesado correctamente`,
        variant: "default",
      });
      setTimeout(() => {
        router.push("/movimientos-inventario");
      }, 1000);
    } catch (error: any) {
      toast({
        description: error?.message || "Error al procesar el egreso",
        variant: "destructive",
      });
    }
  };

  const handleAgregarProducto = (inventario: InventarioItem | null) => {
    if (!inventario) return;
    const stock = Number(inventario.stock || 0);
    const stockReservadoTotal = Number(inventario.stockReservado || 0);
    const stockLibre = Math.max(0, stock - stockReservadoTotal);

    const nuevaLinea: ProductoConsumo = {
      reservaId: null,
      productoId: inventario.id,
      productoNombre: inventario.nombre,
      cantidadReservada: 0,
      cantidadAConsumir: 1,
      stockDisponible: stock,
      stockReservado: stockReservadoTotal,
      stockLibre,
      trabajoNombre: undefined,
      unidadMedida: inventario.unidadMedida || "UN",
      seleccionado: true,
      esNuevo: true,
      inventario,
    };
    setProductos((prev) => [...prev, nuevaLinea]);
  };

  const downloadReservaId = {
    reserva: reservaId,
    presupuesto: reservas?.[0]?.reservaId || 0,
    "centro-costo": reservas?.[0]?.reservaId || 0,
  }[tipo];

  const pasoDosCompleto = {
    presupuesto: presupuestoId > 0 && trabajoId > 0,
    "centro-costo": centroCostoId > 0,
    reserva: reservaId > 0,
  }[tipo];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-4">
          <TipoSelector form={form} />

          <DestinoSelector
            form={form}
            tipo={tipo}
            isLoadingReservas={isLoadingReservas}
            reservaDetalle={reservaDetalle}
          />

          {productos.length > 0 && (
            <ProductosTable
              productos={productos}
              onProductosChange={setProductos}
            />
          )}

          {pasoDosCompleto && (
            <AgregarProductoSection onAgregarProducto={handleAgregarProducto} />
          )}
        </div>

        <ActionBar
          tipo={tipo}
          downloadReservaId={downloadReservaId}
          egresoOtPayload={{
            tipo,
            presupuestoId: presupuestoId || undefined,
            trabajoId,
            personaId: personaId || undefined,
            productos: productos.filter((p) => p.seleccionado).map((p) => ({
              reservaId: p.reservaId || null,
              productoId: p.productoId,
              cantidad: typeof p.cantidadAConsumir === "string" ? parseFloat(p.cantidadAConsumir) : p.cantidadAConsumir,
              cantidadReservada: p.cantidadReservada,
            })),
          }}
          onProcesar={handleProcesarEgreso}
          disabled={!pasoDosCompleto || productos.length === 0}
        />
      </Form>
    </div>
  );
}

// --- Presentation Components ---

function StockInsuficienteAlert({
  productos,
}: {
  productos: ProductoConsumo[];
}) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">
        Los siguientes productos no tienen stock suficiente:
      </p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        {productos.map((p, idx) => {
          const cantidadAConsumir =
            typeof p.cantidadAConsumir === "string"
              ? parseFloat(p.cantidadAConsumir)
              : p.cantidadAConsumir;
          const disponible = p.stockLibre ?? 0;
          const faltante = cantidadAConsumir - disponible;

          return (
            <li key={idx}>
              <strong>{p.productoNombre}:</strong> solicitas {cantidadAConsumir}{" "}
              pero solo hay {p.stockLibre} disponibles (faltan{" "}
              {faltante.toFixed(2)})
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TipoSelector({ form }: { form: UseFormReturn<FormSchema> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paso 1: Selecciona el Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presupuesto" id="presupuesto" />
                    <Label htmlFor="presupuesto" className="cursor-pointer">
                      Orden de Trabajo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="centro-costo" id="centro-costo" />
                    <Label htmlFor="centro-costo" className="cursor-pointer">
                      Centro de Costo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reserva" id="reserva" />
                    <Label htmlFor="reserva" className="cursor-pointer">
                      Reserva
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function DestinoSelector({
  form,
  tipo,
  isLoadingReservas,
  reservaDetalle,
}: {
  form: UseFormReturn<FormSchema>;
  tipo: string;
  isLoadingReservas: boolean;
  reservaDetalle?: {
    id: number;
    presupuestoId?: number;
    centroCostoId?: number;
    personaId?: number;
    persona?: { nombre: string; apellido: string };
  };
}) {
  const presupuestoId = form.watch("presupuestoId") || 0;
  const personaDesdeReserva = tipo === "reserva" && !!reservaDetalle?.personaId;

  const titulos = {
    presupuesto: "la OT y el Trabajo",
    "centro-costo": "el Centro de Costo",
    reserva: "la Reserva",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Paso 2: Selecciona {titulos[tipo as keyof typeof titulos]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tipo === "presupuesto" && (
          <SelectorPresupuestoYTrabajo
            form={form}
            presupuestoId={presupuestoId}
          />
        )}

        {tipo === "centro-costo" && <SelectorCentroCosto form={form} />}

        {tipo === "reserva" && (
          <SelectorReserva form={form} reservaDetalle={reservaDetalle} />
        )}

        <FormField
          control={form.control}
          name="personaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona que retira</FormLabel>
              <PersonaSelector
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
                placeholder={personaDesdeReserva ? "Cargado desde reserva" : "Seleccionar persona..."}
              />
              {personaDesdeReserva && (
                <p className="text-xs text-muted-foreground">Persona asignada en la reserva</p>
              )}
            </FormItem>
          )}
        />

        {isLoadingReservas && <CargandoReservas />}
      </CardContent>
    </Card>
  );
}

function SelectorPresupuestoYTrabajo({
  form,
  presupuestoId,
}: {
  form: UseFormReturn<FormSchema>;
  presupuestoId: number;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="presupuestoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Orden de Trabajo</FormLabel>
            <PresupuestoSelector
              selectedResult={
                field.value
                  ? { id: field.value, descripcionCorta: "" }
                  : undefined
              }
              onSelectResult={(v) => {
                field.onChange(v?.id || 0);
                form.setValue("trabajoId", 0);
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {presupuestoId > 0 && (
        <FormField
          control={form.control}
          name="trabajoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trabajo</FormLabel>
              <ProduccionTrabajoSelector
                value={field.value}
                onChange={(v) => {
                  const id =
                    typeof v === "string" ? parseInt(v, 10) : v?.id || 0;
                  field.onChange(id);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

function SelectorCentroCosto({ form }: { form: UseFormReturn<FormSchema> }) {
  return (
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
  );
}

function SelectorReserva({
  form,
  reservaDetalle,
}: {
  form: UseFormReturn<FormSchema>;
  reservaDetalle?: {
    id: number;
    presupuestoId?: number;
    centroCostoId?: number;
    personaId?: number;
    persona?: {
      nombre: string;
      apellido: string;
    };
  };
}) {
  return (
    <div className="flex gap-4 items-end">
      <FormField
        control={form.control}
        name="reservaId"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Reserva</FormLabel>
            <ReservaSelector
              value={field.value ? { id: field.value } : undefined}
              onChange={(v) => {
                field.onChange(v?.id || 0);
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {/* {reservaDetalle && reservaDetalle.persona && (
        <InfoReservaDetectada reservaDetalle={reservaDetalle} />
      )} */}
    </div>
  );
}

function InfoReservaDetectada({
  reservaDetalle,
}: {
  reservaDetalle: {
    presupuestoId?: number;
    persona: {
      nombre: string;
      apellido: string;
    };
  };
}) {
  const tipoDetectado = reservaDetalle.presupuestoId
    ? "Presupuesto / OT"
    : "Centro de Costo";

  return (
    <div className="ml-2 mb-2 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 flex flex-col gap-1 self-end">
      <span>Detectado: {tipoDetectado}</span>
      <span className="font-medium">
        Persona: {reservaDetalle.persona.nombre}{" "}
        {reservaDetalle.persona.apellido}
      </span>
    </div>
  );
}

function CargandoReservas() {
  return (
    <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Cargando reservas...
    </div>
  );
}

function ProductosTable({
  productos,
  onProductosChange,
}: {
  productos: ProductoConsumo[];
  onProductosChange: React.Dispatch<React.SetStateAction<ProductoConsumo[]>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Paso 3: Selecciona y Ajusta las Cantidades
        </CardTitle>
        <ProductosTableHeader
          productos={productos}
          onSeleccionarTodos={() =>
            onProductosChange((prev) =>
              prev.map((p) => ({ ...p, seleccionado: true }))
            )
          }
          onDeseleccionarTodos={() =>
            onProductosChange((prev) =>
              prev.map((p) => ({ ...p, seleccionado: false }))
            )
          }
        />
        <Separator className="my-4" />
        {/* <InstruccionesUso /> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {productos.map((producto, index) => (
            <ProductoRow
              key={`${producto.reservaId}-${index}`}
              producto={producto}
              index={index}
              onCantidadChange={(idx, cantidad) =>
                onProductosChange((prev) =>
                  prev.map((p, i) =>
                    i === idx ? { ...p, cantidadAConsumir: cantidad } : p
                  )
                )
              }
              onToggleSeleccion={(idx) =>
                onProductosChange((prev) =>
                  prev.map((p, i) =>
                    i === idx ? { ...p, seleccionado: !p.seleccionado } : p
                  )
                )
              }
              onEliminar={(idx) =>
                onProductosChange((prev) => prev.filter((_, i) => i !== idx))
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProductosTableHeader({
  productos,
  onSeleccionarTodos,
  onDeseleccionarTodos,
}: {
  productos: ProductoConsumo[];
  onSeleccionarTodos: () => void;
  onDeseleccionarTodos: () => void;
}) {
  const productosSeleccionados = productos.filter((p) => p.seleccionado).length;

  return (
    <div className="flex items-center justify-between mt-2">
      <ContadorProductos
        seleccionados={productosSeleccionados}
        total={productos.length}
      />
      <BotonesSeleccion
        onSeleccionarTodos={onSeleccionarTodos}
        onDeseleccionarTodos={onDeseleccionarTodos}
      />
    </div>
  );
}

function ContadorProductos({
  seleccionados,
  total,
}: {
  seleccionados: number;
  total: number;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      {seleccionados} de {total} productos seleccionados
    </p>
  );
}

function BotonesSeleccion({
  onSeleccionarTodos,
  onDeseleccionarTodos,
}: {
  onSeleccionarTodos: () => void;
  onDeseleccionarTodos: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onSeleccionarTodos}
      >
        Seleccionar todos
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onDeseleccionarTodos}
      >
        Deseleccionar todos
      </Button>
    </div>
  );
}

function InstruccionesUso() {
  return (
    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
      <p className="font-medium mb-1">ℹ️ Información de uso:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Selecciona los productos que deseas procesar</li>
        <li>
          La validación se hace contra el <strong>stock físico real</strong>
        </li>
        <li>
          Si tienes una reserva pero no hay stock físico, NO podrás procesar el
          egreso
        </li>
        <li>
          ⚠️ El &quot;Stock libre&quot; indica cuánto stock no está reservado
          por ninguna OT
        </li>
        <li>❌ No podrás procesar si excedes el stock físico disponible</li>
      </ul>{" "}
    </div>
  );
}

function ProductoRow({
  producto,
  index,
  onCantidadChange,
  onToggleSeleccion,
  onEliminar,
}: {
  producto: ProductoConsumo;
  index: number;
  onCantidadChange: (index: number, cantidad: string) => void;
  onToggleSeleccion: (index: number) => void;
  onEliminar: (index: number) => void;
}) {
  const cantidadNumero = parseFloat(String(producto.cantidadAConsumir)) || 0;
  const excedioStock = cantidadNumero > (producto.stockLibre ?? 0);
  const excedioReserva = cantidadNumero > producto.cantidadReservada;

  return (
    <div
      className={`flex flex-col gap-3 p-4 border rounded-lg transition-all ${
        !producto.seleccionado
          ? "opacity-50 bg-muted/20"
          : excedioStock
            ? "border-red-500 bg-red-50"
            : excedioReserva
              ? "border-amber-500 bg-amber-50"
              : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={producto.seleccionado}
          onCheckedChange={() => onToggleSeleccion(index)}
          className="mt-1"
        />

        <InfoProducto
          nombre={producto.productoNombre}
          esNuevo={producto.esNuevo}
          trabajoNombre={producto.trabajoNombre}
        />

        <BadgesStock
          cantidadReservada={producto.cantidadReservada}
          stockDisponible={producto.stockDisponible}
          stockLibre={producto.stockLibre}
          stockReservado={producto.stockReservado}
          unidadMedida={producto.unidadMedida || "UN"}
        />

        <InputCantidad
          cantidad={producto.cantidadAConsumir}
          unidadMedida={producto.unidadMedida || "UN"}
          excedioStock={excedioStock}
          excedioReserva={excedioReserva}
          disabled={!producto.seleccionado}
          onChange={(valor) => onCantidadChange(index, valor)}
        />

        {producto.esNuevo && (
          <BotonEliminar onClick={() => onEliminar(index)} />
        )}
      </div>

      {producto.seleccionado && excedioStock && (
        <AlertaStockInsuficiente
          cantidadSolicitada={cantidadNumero}
          stockDisponible={producto.stockLibre || 0}
          unidadMedida={producto.unidadMedida || "UN"}
        />
      )}
    </div>
  );
}

function InfoProducto({
  nombre,
  esNuevo,
  trabajoNombre,
}: {
  nombre: string;
  esNuevo?: boolean;
  trabajoNombre?: string;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="font-medium">{nombre}</p>
        {esNuevo && (
          <Badge variant="default" className="text-xs">
            Nuevo
          </Badge>
        )}
      </div>
      {trabajoNombre && (
        <p className="text-sm text-muted-foreground">Sector: {trabajoNombre}</p>
      )}
    </div>
  );
}

function BadgesStock({
  cantidadReservada,
  stockDisponible,
  stockLibre,
  stockReservado,
  unidadMedida,
}: {
  cantidadReservada: number;
  stockDisponible: number;
  stockLibre?: number;
  stockReservado?: number;
  unidadMedida: string;
}) {
  const nf = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col leading-tight text-xs cursor-zoom-in">
          <span className="font-medium text-foreground">
            {nf.format(stockLibre)} {unidadMedida} disponibles
          </span>

          {cantidadReservada > 0 && (
            <span className="text-muted-foreground">
              reservado {nf.format(cantidadReservada)} {unidadMedida}
            </span>
          )}
        </div>
      </TooltipTrigger>

      <TooltipContent className="text-xs">
        <div className="flex flex-col gap-1 min-w-[180px]">
          {stockLibre !== undefined && (
            <span>
              <strong>Stock disponible:</strong> {nf.format(stockLibre)}{" "}
              {unidadMedida}
            </span>
          )}

          {stockReservado !== undefined && (
            <span>
              <strong>Stock reservado:</strong> {nf.format(stockReservado)}{" "}
              {unidadMedida}
            </span>
          )}

          <span>
            <strong>Tu reserva:</strong> {nf.format(cantidadReservada)}{" "}
            {unidadMedida}
          </span>

          <span className="pt-1 border-t">
            <strong>Fisico:</strong> {nf.format(stockDisponible)} {unidadMedida}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function InputCantidad({
  cantidad,
  unidadMedida,
  excedioStock,
  excedioReserva,
  disabled,
  onChange,
}: {
  cantidad: number | string;
  unidadMedida: string;
  excedioStock: boolean;
  excedioReserva: boolean;
  disabled: boolean;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="0"
        value={cantidad}
        onChange={(e) => {
          const valor = e.target.value;
          if (valor === "" || /^[0-9]*[.,]?[0-9]*$/.test(valor)) {
            onChange(valor);
          }
        }}
        disabled={disabled}
        className={`w-28 h-8 ${
          excedioStock
            ? "border-red-500"
            : excedioReserva
              ? "border-amber-500"
              : ""
        }`}
      />
      <span className="text-sm text-muted-foreground">{unidadMedida}</span>
    </div>
  );
}

function BotonEliminar({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function AlertaStockInsuficiente({
  cantidadSolicitada,
  stockDisponible,
  unidadMedida,
}: {
  cantidadSolicitada: number;
  stockDisponible: number;
  unidadMedida: string;
}) {
  const faltante = cantidadSolicitada - stockDisponible;

  return (
    <div className="flex items-start gap-2 text-xs text-red-700 bg-red-100 p-2 rounded">
      <span className="font-bold">❌</span>
      <p>
        <strong>Stock insuficiente:</strong> Estás intentando consumir{" "}
        {cantidadSolicitada} {unidadMedida} pero solo hay {stockDisponible}{" "}
        {unidadMedida} de stock disponible. Faltan {faltante.toFixed(2)}{" "}
        {unidadMedida}.
      </p>
    </div>
  );
}

function AgregarProductoSection({
  onAgregarProducto,
}: {
  onAgregarProducto: (inventario: InventarioItem | null) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">¿Necesitas algo más?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label className="mb-2 block">Agregar producto extra</Label>
            <InventarioSelector
              onChange={onAgregarProducto}
              value={undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionBar({
  tipo,
  downloadReservaId,
  egresoOtPayload,
  onProcesar,
  disabled,
}: {
  tipo: string;
  downloadReservaId: number;
  egresoOtPayload: EgresoMasivo;
  onProcesar: () => void;
  disabled: boolean;
}) {
  const downloadReservaPdfMutation = useDownloadReservaPdfMutation();
  const downloadEgresoOtPdfMutation = useDownloadEgresoOtPdfMutation();
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    try {
      if (tipo === "reserva") {
        if (!downloadReservaId) {
          toast({ description: "Debe seleccionar una reserva válida", variant: "destructive" });
          return;
        }
        await downloadReservaPdfMutation.mutateAsync({ id: downloadReservaId });
      } else {
        await downloadEgresoOtPdfMutation.mutateAsync(egresoOtPayload);
      }
    } catch {
      toast({ description: "Error al descargar el PDF", variant: "destructive" });
    }
  };

  return (
    <div className="flex justify-between items-center bg-background border-t pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadPdf}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>

      <Button
        type="button"
        onClick={onProcesar}
        className="ml-auto"
        disabled={disabled}
      >
        Procesar Egreso
      </Button>
    </div>
  );
}
