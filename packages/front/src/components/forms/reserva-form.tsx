"use client";

import React from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Hash, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  useCreateReservaMutation,
  useDeleteReservaMutation,
} from "@/hooks/reserva";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { PresupuestoSelector } from "@/components/selectors/presupuesto-selector";
import { ProduccionTrabajoSelector } from "@/components/selectors/produccion-trabajo-selector";
import { CentroCostoSelector } from "@/components/selectors/centro-costo-selector";
import { PersonaSelector } from "@/components/selectors/persona-selector";
import { Textarea } from "@/components/ui/textarea";
import { InputNumber } from "@/components/ui/input-number";
import { Inventario, Reserva, ReservaItem } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReservaItemsTable } from "@/components/tables/reserva-items-table";
import { cn } from "@/lib/utils";

// ============================================================================
// SCHEMAS Y TIPOS
// ============================================================================

const itemSchema = z.object({
  id: z.number(),
  producto: z.any(),
  productoId: z.number(),
  cantidad: z.string().min(1, "Ingresa la cantidad"),
});

const formSchema = z.object({
  id: z.number().optional(),
  observaciones: z.string().optional(),
  tipoDestino: z.enum(["ot", "centro-costo"]),
  presupuestoId: z.number().optional().nullable(),
  presupuesto: z.any().optional().nullable(),
  trabajoId: z.number().optional().nullable(),
  trabajo: z.any().optional().nullable(),
  centroCostoId: z.number().optional().nullable(),
  centroCosto: z.any().optional().nullable(),
  personaId: z.number().optional().nullable(),
  persona: z.any().optional().nullable(),
  items: z.array(itemSchema).min(1, "Agrega al menos un producto"),
});

type ReservaFormValues = z.infer<typeof formSchema>;
type ReservaFormProps = { data?: Reserva };

// ============================================================================
// HELPERS
// ============================================================================

function calcularStockDisponible(
  producto: Inventario,
  originalItem?: { cantidad: number }
) {
  let stockReservadoGlobal = producto.stockReservado || 0;
  if (originalItem) {
    stockReservadoGlobal = Math.max(
      0,
      stockReservadoGlobal - Number(originalItem.cantidad)
    );
  }
  return Number(producto.stock) - stockReservadoGlobal;
}

function calcularStockDisponibleTable(
  stock: number,
  stockReservado: number,
  cantidadOriginal?: number
) {
  let stockReservadoAjustado = stockReservado;
  if (cantidadOriginal) {
    stockReservadoAjustado = Math.max(0, stockReservado - cantidadOriginal);
  }
  return stock - stockReservadoAjustado;
}

// ============================================================================
// COMPONENTES ATÓMICOS
// ============================================================================

type ItemsTableProps = {
  items: Array<{
    id: number;
    productoId: number;
    cantidad: string;
    producto?: Inventario;
  }>;
  originalItems?: ReservaItem[];
  onUpdateCantidad: (index: number, value: string) => void;
  onEliminar: (index: number) => void;
};

function ItemsTable({
  items,
  originalItems,
  onUpdateCantidad,
  onEliminar,
}: ItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded py-8 text-center text-muted-foreground text-sm">
        Selecciona productos para agregar a la reserva
      </div>
    );
  }

  return (
    <table className="w-full text-sm border border ">
      <thead>
        <tr className="bg-muted/70 text-xs uppercase tracking-wider text-muted-foreground">
          <th className="py-2 px-3 font-medium w-10"></th>
          <th className="py-2 px-3 font-medium text-left">Producto</th>
          <th className="py-2 px-3 font-medium text-left w-56">SKU</th>
          <th className="py-2 px-3 font-medium text-left w-24">Stock</th>
          <th className="py-2 px-3 font-medium text-left w-24">Reserv.</th>
          <th className="py-2 px-3 font-medium text-left w-24">Disp.</th>
          <th className="py-2 px-3 font-medium text-left w-24">Cantidad</th>
          <th className="py-2 px-2 w-10"></th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {items.map((item, index) => {
          const producto = item.producto;
          if (!producto) return null;

          const originalItem = originalItems?.find(
            (i) => i.producto?.id === producto.id
          );
          const stockDisponible = calcularStockDisponibleTable(
            Number(producto.stock),
            producto.stockReservado || 0,
            originalItem ? Number(originalItem.cantidad) : undefined
          );
          const ok = Number(item.cantidad) <= stockDisponible;

          const stockReservadoAjustado = originalItem
            ? Math.max(
                0,
                (producto.stockReservado || 0) - Number(originalItem.cantidad)
              )
            : producto.stockReservado || 0;

          return (
            <tr key={item.id} className="hover:bg-muted/30">
              <td className="py-1.5 px-3 text-center">
                {ok ? (
                  <Check className="h-3.5 w-3.5 text-green-500 mx-auto" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-1.5 px-3 font-medium">{producto.nombre}</td>
              <td className="py-1.5 px-3 text-muted-foreground font-mono text-xs">
                {producto.sku}
              </td>
              <td className="py-1.5 px-3 text-left tabular-nums">
                {producto.stock}
              </td>
              <td className="py-1.5 px-3 text-left tabular-nums text-amber-600">
                {stockReservadoAjustado}
              </td>
              <td
                className={cn(
                  "py-1.5 px-3 text-left tabular-nums font-medium",
                  ok ? "text-green-600" : "text-red-600"
                )}
              >
                {stockDisponible}
              </td>
              <td className="py-1.5 px-3 text-left">
                <InputNumber
                  value={String(item.cantidad)}
                  onChange={(v) => onUpdateCantidad(index, v)}
                  className={cn(
                    "h-7 w-20 text-left text-sm mx-auto",
                    !ok && "border-red-500"
                  )}
                />
              </td>
              <td className="py-1.5 px-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEliminar(index)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

type HeaderInfoProps = {
  isEditing: boolean;
  data?: Reserva;
  itemsCount: number;
  totalUnidades: number;
  hayErrores: boolean;
};

function HeaderInfo({
  isEditing,
  data,
  itemsCount,
  totalUnidades,
  hayErrores,
}: HeaderInfoProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex items-center gap-4">
        {isEditing && (
          <>
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded text-sm font-mono">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold">{data!.id}</span>
            </div>
            {data!.fecha && (
              <span className="text-sm text-muted-foreground">
                {format(new Date(data!.fecha), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </span>
            )}
            {data!.createdByUser && (
              <span className="text-sm text-muted-foreground">
                por {data!.createdByUser.nombre || data!.createdByUser.email}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {itemsCount} ítem{itemsCount !== 1 && "s"}
        </span>
        <span className="text-muted-foreground/50">|</span>
        <span>{totalUnidades} uds</span>
        {hayErrores && (
          <>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Stock insuficiente
            </span>
          </>
        )}
      </div>
    </div>
  );
}

type ProductoInputProps = {
  productoSeleccionado: Inventario | null;
  cantidad: string;
  onProductoChange: (producto: Inventario | null) => void;
  onCantidadChange: (cantidad: string) => void;
  onAgregar: () => void;
};

function ProductoInput({
  productoSeleccionado,
  cantidad,
  onProductoChange,
  onCantidadChange,
  onAgregar,
}: ProductoInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <InventarioSelector
            value={productoSeleccionado || undefined}
            onChange={onProductoChange}
          />
        </div>
        <InputNumber
          value={cantidad}
          onChange={onCantidadChange}
          placeholder="Cant."
          disabled={!productoSeleccionado}
          className="w-24"
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), onAgregar())
          }
        />
        <Button
          type="button"
          size="icon"
          onClick={onAgregar}
          disabled={!productoSeleccionado || !cantidad}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {productoSeleccionado && (
        <div className="text-xs flex gap-3 text-muted-foreground bg-muted/50 px-2 py-1 rounded">
          <span>{productoSeleccionado.sku}</span>
          <span>Stock: {productoSeleccionado.stock}</span>
          <span className="text-amber-600">
            Reserv: {productoSeleccionado.stockReservado || 0}
          </span>
          <span className="text-green-600 font-medium">
            Disp: {calcularStockDisponible(productoSeleccionado)}
          </span>
        </div>
      )}
    </div>
  );
}

type ObservacionesFieldProps = {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
};

function ObservacionesField({
  value,
  onChange,
  isEditing,
}: ObservacionesFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Observaciones
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Notas adicionales..."
        className="mt-1 resize-none h-16 text-sm"
        disabled={isEditing}
      />
    </div>
  );
}

type DestinoSelectorProps = {
  form: UseFormReturn<ReservaFormValues>;
  tipoDestino: "ot" | "centro-costo";
};

function DestinoSelector({ form, tipoDestino }: DestinoSelectorProps) {
  return (
    <div className="space-y-3 bg-muted/30 p-4 rounded border">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Dirigir a
      </label>

      <RadioGroup
        value={tipoDestino}
        onValueChange={(value) => {
          form.setValue("tipoDestino", value as "ot" | "centro-costo");
          if (value === "ot") {
            form.setValue("centroCostoId", null);
            form.setValue("centroCosto", null);
          } else {
            form.setValue("presupuestoId", null);
            form.setValue("presupuesto", null);
            form.setValue("trabajoId", null);
            form.setValue("trabajo", null);
          }
        }}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ot" id="tipo-ot" />
          <Label htmlFor="tipo-ot" className="cursor-pointer font-medium">
            Orden de Trabajo
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="centro-costo" id="tipo-cc" />
          <Label htmlFor="tipo-cc" className="cursor-pointer font-medium">
            Centro de Costo
          </Label>
        </div>
      </RadioGroup>

      {tipoDestino === "ot" ? (
        <OTSelector form={form} />
      ) : (
        <CentroCostoField form={form} />
      )}

      <div className="pt-3 border-t">
        <label className="text-xs font-medium text-muted-foreground">
          Persona
        </label>
        <PersonaSelector
          value={form.watch("personaId") || undefined}
          onValueChange={(v) => form.setValue("personaId", v || null)}
          placeholder="Seleccionar persona..."
        />
      </div>
    </div>
  );
}

type OTSelectorProps = {
  form: UseFormReturn<ReservaFormValues>;
};

function OTSelector({ form }: OTSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground">
          Orden de Trabajo
        </label>
        <PresupuestoSelector
          selectedResult={
            form.watch("presupuestoId")
              ? { id: form.watch("presupuestoId")!, descripcionCorta: "" }
              : undefined
          }
          onSelectResult={(v) => {
            form.setValue("presupuestoId", v?.id || null);
            form.setValue("presupuesto", v || null);
            form.setValue("trabajoId", null);
            form.setValue("trabajo", null);
          }}
        />
      </div>
      {form.watch("presupuestoId") && (
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Trabajo
          </label>
          <ProduccionTrabajoSelector
            value={form.watch("trabajoId")}
            onChange={(v) => {
              const id =
                typeof v === "string" ? parseInt(v, 10) : v?.id || null;
              form.setValue("trabajoId", id);
              form.setValue("trabajo", v || null);
            }}
          />
        </div>
      )}
    </div>
  );
}

type CentroCostoFieldProps = {
  form: UseFormReturn<ReservaFormValues>;
};

function CentroCostoField({ form }: CentroCostoFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        Centro de Costo
      </label>
      <CentroCostoSelector
        onChange={(v) => {
          form.setValue("centroCostoId", v?.id || null);
          form.setValue("centroCosto", v || null);
        }}
        centroCosto={form.watch("centroCosto")}
      />
    </div>
  );
}

type FormActionsProps = {
  isEditing: boolean;
  isPendingCreate: boolean;
  itemsCount: number;
  hayErrores: boolean;
  onCancel: () => void;
};

function FormActions({
  isEditing,
  isPendingCreate,
  itemsCount,
  hayErrores,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex gap-2 pt-2 border-t">
      {!isEditing && (
        <LoadingButton
          type="submit"
          size="sm"
          loading={isPendingCreate}
          disabled={itemsCount === 0 || hayErrores}
        >
          Crear Reserva
        </LoadingButton>
      )}
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Volver
      </Button>
    </div>
  );
}

type DeleteDialogProps = {
  open: boolean;
  reservaId?: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function DeleteDialog({
  open,
  reservaId,
  onOpenChange,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar reserva #{reservaId}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se liberará el stock reservado de todos los productos. Esta acción
            no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ReservaForm({ data }: ReservaFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateReservaMutation();
  const { mutateAsync: eliminar } = useDeleteReservaMutation();

  const isEditing = !!data?.id;

  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      observaciones: data?.observaciones || "",
      tipoDestino: data?.presupuestoId
        ? "ot"
        : data?.centroCostoId
          ? "centro-costo"
          : "ot",
      presupuestoId: data?.presupuestoId || null,
      presupuesto: data?.presupuesto || null,
      trabajoId: data?.trabajoId || null,
      trabajo: data?.trabajo || null,
      centroCostoId: data?.centroCostoId || null,
      centroCosto: data?.centroCosto || null,
      personaId: data?.personaId || null,
      persona: data?.persona || null,
      items:
        data?.items?.map((item) => ({
          id: item.id!,
          producto: item.producto as Inventario,
          productoId: item.producto.id!,
          cantidad: String(item.cantidad),
        })) || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const watchTipoDestino = form.watch("tipoDestino");

  const [productoSeleccionado, setProductoSeleccionado] =
    React.useState<Inventario | null>(null);
  const [cantidad, setCantidad] = React.useState("");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const agregarItem = () => {
    if (!productoSeleccionado || !cantidad || Number(cantidad) <= 0) return;

    const existeIndex = watchItems.findIndex(
      (i) => i.productoId === productoSeleccionado.id
    );

    if (existeIndex >= 0) {
      const currentCantidad = Number(watchItems[existeIndex].cantidad) || 0;
      update(existeIndex, {
        ...watchItems[existeIndex],
        cantidad: String(currentCantidad + Number(cantidad)),
      });
    } else {
      append({
        id: Date.now(),
        producto: productoSeleccionado,
        productoId: productoSeleccionado.id!,
        cantidad: cantidad,
      });
    }
    setCantidad("");
    setProductoSeleccionado(null);
  };

  const hayErrores = watchItems.some((item) => {
    const producto = item.producto as Inventario;
    const originalItem = data?.items?.find(
      (i) => i.producto.id === producto.id
    );
    const stockDisponible = calcularStockDisponible(producto, originalItem);
    return Number(item.cantidad) > stockDisponible;
  });

  const totalUnidades = fields.reduce(
    (acc, i) => acc + (Number(i.cantidad) || 0),
    0
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const values = form.getValues();

    if (values.items.length === 0) {
      toast({
        description: "Agrega al menos un producto",
        variant: "destructive",
      });
      return;
    }

    if (
      values.tipoDestino === "ot" &&
      (!values.presupuestoId || !values.trabajoId)
    ) {
      toast({
        description: "Selecciona una OT y un Trabajo",
        variant: "destructive",
      });
      return;
    }

    if (values.tipoDestino === "centro-costo" && !values.centroCostoId) {
      toast({
        description: "Selecciona un Centro de Costo",
        variant: "destructive",
      });
      return;
    }

    if (hayErrores) {
      toast({ description: "Stock insuficiente", variant: "destructive" });
      return;
    }

    try {
      await create({
        observaciones: values.observaciones,
        presupuestoId:
          values.tipoDestino === "ot" ? values.presupuestoId : null,
        trabajoId: values.tipoDestino === "ot" ? values.trabajoId : null,
        centroCostoId:
          values.tipoDestino === "centro-costo" ? values.centroCostoId : null,
        personaId: values.personaId || null,
        items: values.items.map((i) => ({
          productoId: i.productoId,
          cantidad: Number(i.cantidad) || 0,
        })),
      });
      toast({ description: "Reserva creada" });
      router.push("/reservas");
    } catch {
      toast({
        description: "Error al crear reserva",
        variant: "destructive",
      });
    }
  }

  const handleEliminarReserva = async () => {
    if (!data?.id) return;
    try {
      await eliminar(data.id);
      toast({ description: "Reserva eliminada" });
      router.push("/reservas");
    } catch {
      toast({ description: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <HeaderInfo
        isEditing={isEditing}
        data={data}
        itemsCount={fields.length}
        totalUnidades={totalUnidades}
        hayErrores={hayErrores}
      />

      {!isEditing ? (
        <>
          <ProductoInput
            productoSeleccionado={productoSeleccionado}
            cantidad={cantidad}
            onProductoChange={setProductoSeleccionado}
            onCantidadChange={setCantidad}
            onAgregar={agregarItem}
          />

          <ItemsTable
            items={watchItems}
            originalItems={data?.items}
            onUpdateCantidad={(index: number, value: string) =>
              form.setValue(`items.${index}.cantidad`, value)
            }
            onEliminar={remove}
          />
        </>
      ) : (
        <ReservaItemsTable reservaId={data!.id!} />
      )}

      <ObservacionesField
        value={form.watch("observaciones") || ""}
        onChange={(value) => form.setValue("observaciones", value)}
        isEditing={isEditing}
      />

      <DestinoSelector form={form} tipoDestino={watchTipoDestino} />

      <FormActions
        isEditing={isEditing}
        isPendingCreate={isPendingCreate}
        itemsCount={fields.length}
        hayErrores={hayErrores}
        onCancel={() => router.push("/reservas")}
      />

      <DeleteDialog
        open={showDeleteDialog}
        reservaId={data?.id}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleEliminarReserva}
      />
    </form>
  );
}
