"use client";

import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputNumber } from "@/components/ui/input-number";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCreatePresupuestoMutation } from "@/hooks/presupuestos";
import { useCreateMovimientoInventarioMutation } from "@/hooks/movimiento-inventario";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { useGetProduccionTrabajosQuery } from "@/hooks/produccion-trabajos";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { UnidadMedidaInventarioSelector } from "@/components/selectors/unidad-medida-inventario-selector";
import { PROCESO_GENERAL } from "@/constants/presupuesto";
import { today } from "@/utils/date";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Query, Presupuesto, Inventario, InventarioConversion } from "@/types";

type TrabajoMantenimiento = { nombre: string; id: number; color: string };

const tareaSchema = z.object({
  descripcion: z.string({ message: "Requerido" }).min(1, "Requerido"),
  observaciones: z.string({ message: "Requerido" }).min(1, "Requerido"),
  archivos: z.array(z.any()).default([]),
  expandida: z.boolean().default(true),
});

const materialSchema = z.object({
  productoId: z.number({ message: "Requerido" }).min(1, "Requerido"),
  producto: z.any().optional(),
  cantidad: z.string().min(1, "Requerido"),
  observaciones: z.string().optional(),
  inventarioConversionId: z.number().optional(),
});

const formSchema = z.object({
  tareas: z.array(tareaSchema).min(1),
  materiales: z.array(materialSchema).default([]),
});

type FormValues = z.infer<typeof formSchema>;

function MaterialRow({
  index,
  control,
  onRemove,
  setValue,
}: {
  index: number;
  control: Control<FormValues>;
  onRemove: () => void;
  setValue: (name: any, value: any) => void;
}) {
  const producto = useWatch({ control, name: `materiales.${index}.producto` }) as Inventario | undefined;
  const cantidad = useWatch({ control, name: `materiales.${index}.cantidad` });
  const [conversion, setConversion] = React.useState<InventarioConversion | null>(null);
  const stockDisponible = producto ? Number(producto.stock) - (producto.stockReservado || 0) : 0;
  const ok = !producto || Number(cantidad) <= stockDisponible;
  const unidad = conversion ? conversion.unidadOrigen : (producto?.unidadMedida ?? "");

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <FormField
          control={control}
          name={`materiales.${index}.productoId`}
          render={({ field: f }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <InventarioSelector
                  value={producto}
                  onChange={(inv: Inventario) => {
                    f.onChange(inv.id);
                    setValue(`materiales.${index}.producto`, inv);
                    setValue(`materiales.${index}.inventarioConversionId`, undefined);
                    setConversion(null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {producto && (
          <div className="flex gap-3 mt-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            <span>Stock: {producto.stock}</span>
            <span className="text-amber-600">Reserv: {producto.stockReservado || 0}</span>
            <span className={cn("font-medium", ok ? "text-green-600" : "text-red-600")}>
              Disp: {stockDisponible}
            </span>
          </div>
        )}
      </div>
      {producto && (
        <FormField
          control={control}
          name={`materiales.${index}.inventarioConversionId`}
          render={({ field: f }) => (
            <FormItem className="space-y-0 shrink-0 w-36">
              <FormControl>
                <UnidadMedidaInventarioSelector
                  id={producto.id!}
                  value={f.value}
                  onChange={(val) => f.onChange(val ? Number(val) : undefined)}
                  unidadBase={producto.unidadMedida}
                  onSelect={(c) => setConversion(c)}
                />
              </FormControl>
              {conversion && conversion.id > 0 && Number(cantidad) > 0 && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  = {Number(cantidad) / Number(conversion.cantidad)} {conversion.unidadDestino}
                </p>
              )}
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name={`materiales.${index}.cantidad`}
        render={({ field: f }) => (
          <FormItem className="space-y-0 shrink-0">
            <FormControl>
              <div className="flex items-center gap-1">
                <InputNumber
                  value={f.value}
                  onChange={f.onChange}
                  placeholder="Cant."
                  className={cn("h-9 w-20 text-sm", !ok && producto && "border-red-500")}
                />
                {unidad && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{unidad}</span>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

type NuevaOtMantenimientoFormProps = {
  alquilerRecursoId: number;
  codigoRecurso?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function NuevaOtMantenimientoForm({
  alquilerRecursoId,
  codigoRecurso,
  onSuccess,
  onCancel,
}: NuevaOtMantenimientoFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tareas: [{ descripcion: "", observaciones: "", archivos: [], expandida: true }],
      materiales: [],
    },
  });
  const { mutateAsync: create, isPending: isPendingCreate } = useCreatePresupuestoMutation();
  const { mutateAsync: createMovimiento } = useCreateMovimientoInventarioMutation();
  const { handleFileUpload } = useFileUploadHandler();
  const { data: trabajos = [] } = useGetProduccionTrabajosQuery({
    columnFilters: [{ id: "tipo", value: "mantenimiento" }],
    pagination: { pageIndex: 0, pageSize: 10 },
  } as Query);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "tareas",
  });

  const { fields: materialesFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({
    control: form.control,
    name: "materiales",
  });

  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState<number | null>(null);

  const toggleExpandida = (index: number) => {
    const tarea = fields[index];
    update(index, { ...tarea, expandida: !tarea.expandida });
  };

  const agregarTarea = () => {
    fields.forEach((t, i) => update(i, { ...t, expandida: false }));
    append({ descripcion: "", observaciones: "", archivos: [], expandida: true });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (trabajoSeleccionado === null) {
      toast({ description: "Seleccioná un tipo de mantenimiento", variant: "destructive" });
      return;
    }

    try {
      const trabajo = (trabajos as TrabajoMantenimiento[]).find((t) => t.id === trabajoSeleccionado);
      const tipo = trabajo?.nombre ?? "";

      const codigo = codigoRecurso?.split("-").slice(1).join("-") ?? "";
      const descripcionCorta = codigo
        ? `Orden de mantenimiento de recurso ${codigo}`
        : "Orden de mantenimiento";

      const payload: Presupuesto = {
        fecha: today(),
        descripcionCorta,
        alquilerRecursoId,
        procesoGeneralId: PROCESO_GENERAL.EN_MANTENIMIENTO,
        tipo,
        clienteId: null,
        produccionEstatus: "pendiente",
        areaId: null,
        comprador: null,
        disenoSolicitar: false,
        ignorarStock: false,
        items: values.tareas.map((t) => ({
          descripcion: t.descripcion,
          detalles: `MANTENIMIENTO ${tipo}`,
          observaciones: t.observaciones,
          cantidad: 1,
          tipo: "MANTENIMIENTO",
          trabajosSeleccionados: [trabajoSeleccionado],
        })),
      } as unknown as Presupuesto;
      const response = await create(payload);

      if (response?.items) {
        for (const [index, tarea] of values.tareas.entries()) {
          const itemId = response.items[index]?.id;
          if (itemId && tarea.archivos.length > 0) {
            await handleFileUpload({
              fileArray: tarea.archivos,
              modelo: "presupuesto_item",
              modeloId: itemId,
              tipo: "",
            });
          }
        }
      }

      if (values.materiales.length > 0) {
        for (const m of values.materiales) {
          try {
            await createMovimiento({
              tipoMovimiento: 'RESERVA',
              motivo: 'Reserva de material',
              cantidad: Number(m.cantidad) || 0,
              productoId: m.productoId,
              presupuestoId: response.id,
              trabajoId: trabajoSeleccionado,
              observaciones: m.observaciones,
              inventarioConversionId: m.inventarioConversionId || undefined,
            } as any);
          } catch {
            toast({ description: `Error al reservar material`, variant: "destructive" });
          }
        }
      }

      toast({ description: "OT de mantenimiento creada", variant: "success" });
      onSuccess?.();
      router.push(`/presupuestos/${response.id}`);
    } catch {
      toast({ description: "Error al crear la OT de mantenimiento", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit)(e); }}
        className="flex flex-col gap-4 overflow-hidden"
      >
        <div className="shrink-0">
          <Label className="mb-2 block">Tipo de mantenimiento *</Label>
          <div className="grid grid-cols-2 gap-2">
            {(trabajos as TrabajoMantenimiento[]).map((trabajo) => {
              const seleccionado = trabajoSeleccionado === trabajo.id;
              return (
                <button
                  key={trabajo.id}
                  type="button"
                  onClick={() => setTrabajoSeleccionado(trabajo.id)}
                  className={[
                    "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-150",
                    seleccionado
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted",
                  ].join(" ")}
                >
                  <div
                    className="shrink-0 w-3 h-3 rounded-full"
                    style={{ backgroundColor: trabajo.color }}
                  />
                  <p className={["text-sm font-semibold leading-none", seleccionado ? "text-primary" : "text-foreground"].join(" ")}>
                    {trabajo.nombre}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between shrink-0">
          <Label>Tareas</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {fields.filter((t) => t.descripcion.trim()).length}/{fields.length}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={agregarTarea} className="h-7 px-2 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto space-y-2 pr-1 flex-1 min-h-0 max-h-[35vh]">
          {fields.map((field, index) => (
            <div key={field.id} className="border-2 border-border rounded-lg overflow-hidden bg-background">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/60">
                <span className="text-muted-foreground text-xs font-medium w-4 shrink-0">{index + 1}</span>
                <FormField
                  control={form.control}
                  name={`tareas.${index}.descripcion`}
                  render={({ field: f, fieldState }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormControl>
                        <input
                          placeholder="Nombre de la tarea *"
                          {...f}
                          className={`w-full text-sm bg-transparent outline-none font-medium placeholder:font-normal ${fieldState.error ? "placeholder:text-destructive" : "placeholder:text-muted-foreground"}`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-1 shrink-0">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => toggleExpandida(index)}>
                    {field.expandida ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {field.expandida && (
                <div className="px-3 py-3 space-y-3 border-t">
                  <FormField
                    control={form.control}
                    name={`tareas.${index}.observaciones`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Descripción *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción de la tarea..." className="resize-none text-sm" rows={2} {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tareas.${index}.archivos`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormControl>
                          <ArchivosInput
                            label="Adjunto"
                            value={f.value}
                            setValue={(files) => f.onChange(files ?? [])}
                            variant="compact"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="shrink-0">
          <div className="flex items-center justify-between mb-2">
            <Label>Materiales / Suministros</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMaterial({ productoId: 0, producto: undefined, cantidad: "", observaciones: "", inventarioConversionId: undefined })}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          </div>

          {materialesFields.length > 0 && (
            <div className="space-y-2">
              {materialesFields.map((field, index) => (
                <MaterialRow
                  key={field.id}
                  index={index}
                  control={form.control}
                  setValue={form.setValue}
                  onRemove={() => removeMaterial(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end border-t pt-3 shrink-0">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <LoadingButton loading={isPendingCreate} type="submit">Crear OT</LoadingButton>
        </div>
      </form>
    </Form>
  );
}
