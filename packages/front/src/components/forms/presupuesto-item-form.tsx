"use client";

import { Trash2, Plus, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetProduccionTrabajosQuery } from "@/hooks/produccion-trabajos";
import { MAX_LIMIT } from "@/constants/query";
import { Loading } from "@/components/loading";
import { RecetaSelector } from "@/components/selectors/receta-selector";
import CargaInventarioForm from "./carga-inventario-form";
import { hasPermission } from "@/hooks/use-access";
import type React from "react";
import { useState } from "react";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { Separator } from "@/components/ui/separator";
import { EditableInput } from "@/components/form-helpers/editable-input";
import { PERMISOS } from "@/constants/permisos";
import { PRESUPUESTO_ITEM_TIPO } from "@/constants/presupuesto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PresupuestoItemFormProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  presupuestoId: number;
}

export function PresupuestoItemForm({
  items,
  setItems,
  presupuestoId,
}: PresupuestoItemFormProps) {
  const { data: trabajos, isLoading } = useGetProduccionTrabajosQuery({
    pagination: {
      pageIndex: 0,
      pageSize: MAX_LIMIT,
    },
    globalFilter: "menu",
  });

  if (isLoading) return <Loading />;

  return (
    <PresupuestoItemFormWithData
      items={items}
      setItems={setItems}
      trabajos={trabajos}
      presupuestoId={presupuestoId}
    />
  );
}

interface PresupuestoItemFormWithDataProps extends PresupuestoItemFormProps {
  trabajos?: any[];
}

function PresupuestoItemFormWithData({
  items,
  setItems,
  trabajos,
  presupuestoId,
}: PresupuestoItemFormWithDataProps) {
  const puedeEditarItems = hasPermission(PERMISOS.PRESUPUESTO_ITEM_EDITAR);
  const puedeAsignarRecetas = hasPermission(
    PERMISOS.PRESUPUESTO_ITEM_ASIGNAR_RECETAS
  );
  const puedeVerInventario = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_TECNICO_VER
  );
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const toggleItemExpansion = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const agregarItem = () => {
    const newItem = {
      tipo: undefined,
      descripcion: "",
      cantidad: 1,
      detalles: "",
      observaciones: "",
      archivos: [],
      archivo: undefined,
      produccionTrabajos: trabajos,
      trabajosSeleccionados: [],
    };

    setItems([...items, newItem]);

    // Auto-expand the newly added item
    const newIndex = items.length;
    setExpandedItems((prev) => ({
      ...prev,
      [newIndex]: true,
    }));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    const updatedItem = { ...updatedItems[index], [field]: value };

    if (field === "cantidad") {
      const prevCantidad = items[index]?.cantidad || 1;
      const nuevaCantidad = value || 1;

      if (items[index]?.produccionTrabajos) {
        const ajustar = (trabajos: any[]) =>
          trabajos.map((trabajo: any) => ({
            ...trabajo,
            materiales: trabajo.materiales.map((m: any) => ({
              ...m,
              cantidad: (m.cantidad / prevCantidad) * nuevaCantidad,
              importe: (m.cantidad / prevCantidad) * nuevaCantidad * m.punit,
            })),
            suministros: trabajo.suministros.map((s: any) => ({
              ...s,
              cantidad: (s.cantidad / prevCantidad) * nuevaCantidad,
              importe: (s.cantidad / prevCantidad) * nuevaCantidad * s.punit,
            })),
            manoDeObra: trabajo.manoDeObra.map((mo: any) => ({
              ...mo,
              cantidad: (mo.cantidad / prevCantidad) * nuevaCantidad,
              importe: (mo.cantidad / prevCantidad) * nuevaCantidad * mo.punit,
            })),
          }));

        updatedItem.produccionTrabajos = {
          producto: ajustar(items[index].produccionTrabajos.producto),
          servicio: ajustar(items[index].produccionTrabajos.servicio),
        };
      }
    }

    updatedItems[index] = updatedItem;
    setItems(updatedItems);
  };

  const recalcularProduccionTrabajos = (receta: any, cantidad: number) => {
    const base = receta?.produccionTrabajos || { producto: [], servicio: [] };

    const escalar = (trabajos: any[]) =>
      trabajos.map((trabajo: any) => ({
        ...trabajo,
        materiales: trabajo.materiales.map((m: any) => ({
          ...m,
          cantidad: m.cantidad * cantidad,
          importe: m.cantidad * cantidad * m.punit,
        })),
        suministros: trabajo.suministros.map((s: any) => ({
          ...s,
          cantidad: s.cantidad * cantidad,
          importe: s.cantidad * cantidad * s.punit,
        })),
        manoDeObra: trabajo.manoDeObra.map((mo: any) => ({
          ...mo,
          cantidad: mo.cantidad * cantidad,
          importe: mo.cantidad * cantidad * mo.punit,
        })),
      }));

    const produccionEscalada = {
      producto: escalar(base.producto),
      servicio: escalar(base.servicio),
    };

    // Calcular trabajosSeleccionados desde los trabajos que tienen costos en la receta
    const trabajosConCostos = new Set<number>();
    for (const categoria of Object.values(produccionEscalada) as {
      id: number;
      materiales: unknown[];
      suministros: unknown[];
      manoDeObra: unknown[];
    }[][]) {
      for (const trabajo of categoria) {
        const tieneCostos =
          (trabajo.materiales?.length || 0) > 0 ||
          (trabajo.suministros?.length || 0) > 0 ||
          (trabajo.manoDeObra?.length || 0) > 0;
        if (tieneCostos) trabajosConCostos.add(trabajo.id);
      }
    }

    return {
      produccionEscalada,
      trabajosSeleccionados: Array.from(trabajosConCostos),
    };
  };

  const handleUpdateProduccionTrabajos = (
    itemId: any,
    nuevoProduccionTrabajos: any
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, produccionTrabajos: nuevoProduccionTrabajos }
          : item
      )
    );
  };

  // Simplified removal function that immediately updates the UI
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-md overflow-hidden ">
        <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted/50 border-b border-border">
          <div className="col-span-1">#</div>
          <div className="col-span-8">Descripción</div>
          <div className="col-span-1">Tipo</div>
          <div className="col-span-1 text-center">Cantidad</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className={index !== 0 ? "border-t  border-border" : ""}
          >
            <div
              className={`grid grid-cols-12 gap-2 p-3 items-center ${
                item.recetaId ? "bg-muted/30" : "bg-background"
              } cursor-pointer hover:bg-muted/20 transition-colors duration-150`}
              onClick={() => toggleItemExpansion(index)}
            >
              <div className="col-span-1">
                <Badge variant="outline" className="font-medium bg-background">
                  {index + 1}
                </Badge>
              </div>
              <div className="col-span-8 truncate font-medium">
                {item.descripcion ? (
                  <span>{item.descripcion}</span>
                ) : (
                  <span className="text-muted-foreground italic">
                    Sin descripción
                  </span>
                )}
                {item.recetaId && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/10 text-primary border-primary/20"
                  >
                    {item.receta?.nombre || "Receta"}
                  </Badge>
                )}
                {item.archivo && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-muted text-muted-foreground"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {1}
                  </Badge>
                )}
              </div>
              <div className="col-span-1">
                {item.tipo &&
                  (() => {
                    const tipoInfo = Object.values(PRESUPUESTO_ITEM_TIPO).find(
                      (t) => t.valor === item.tipo
                    );
                    return tipoInfo ? (
                      <Badge
                        variant="outline"
                        className={`text-xs ${tipoInfo.color}`}
                      >
                        {tipoInfo?.label}
                      </Badge>
                    ) : null;
                  })()}
              </div>
              <div className="col-span-1 text-center">
                {item.cantidad > 0 ? item.cantidad : "-"}
              </div>
              <div className="col-span-1 flex justify-end items-center gap-1">
                {puedeEditarItems && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(index);
                    }}
                    type="button"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar ítem</span>
                  </Button>
                )}
              </div>
            </div>

            {expandedItems[index] && (
              <div className="p-4 bg-background border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div className="md:col-span-3 space-y-2">
                    <Label
                      htmlFor={`descripcion-${index}`}
                      className="required text-sm font-medium"
                    >
                      Descripción
                    </Label>
                    <Input
                      id={`descripcion-${index}`}
                      value={item.descripcion}
                      onChange={(e) =>
                        handleChange(index, "descripcion", e.target.value)
                      }
                      placeholder="Descripción del ítem"
                      required
                      disabled={!puedeEditarItems}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label
                      htmlFor={`tipo-${index}`}
                      className="required text-sm font-medium"
                    >
                      Tipo
                    </Label>
                    <Select
                      value={item.tipo ?? ""}
                      onValueChange={(value) =>
                        handleChange(index, "tipo", value)
                      }
                      disabled={!puedeEditarItems}
                      required
                    >
                      <SelectTrigger id={`tipo-${index}`} className="h-10">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PRESUPUESTO_ITEM_TIPO).map((tipo) => (
                          <SelectItem key={tipo.valor} value={tipo.valor}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`cantidad-${index}`}
                      className="required text-sm font-medium"
                    >
                      Cantidad
                    </Label>
                    {presupuestoId ? (
                      <EditableInput
                        field={{
                          value: item.cantidad,
                          onChange: (newValue: number) => {
                            handleChange(index, "cantidad", newValue);
                          },
                        }}
                        className="h-10"
                        label="Cantidad"
                        disabled={!puedeEditarItems}
                        isInteger={true}
                      />
                    ) : (
                      <Input
                        id={`cantidad-${index}`}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /\D/g,
                            ""
                          );
                        }}
                        min="0"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "cantidad",
                            Number(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        required
                        disabled={!puedeEditarItems}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`detalles-${index}`}
                      className="text-sm font-medium"
                    >
                      Detalles
                    </Label>
                    <Textarea
                      id={`detalles-${index}`}
                      value={item.detalles || ""}
                      onChange={(e) =>
                        handleChange(index, "detalles", e.target.value)
                      }
                      placeholder="Detalles adicionales del ítem"
                      rows={3}
                      disabled={!puedeEditarItems}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`observaciones-${index}`}
                      className="text-sm font-medium"
                    >
                      Observaciones
                    </Label>
                    <Textarea
                      id={`observaciones-${index}`}
                      value={item.observaciones || ""}
                      onChange={(e) =>
                        handleChange(index, "observaciones", e.target.value)
                      }
                      placeholder="Observaciones sobre el ítem"
                      rows={3}
                      disabled={!puedeEditarItems}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <ArchivosInput
                    disabled={!puedeEditarItems}
                    label="Archivos adjuntos"
                    value={item.archivos}
                    setValue={(files) => {
                      setItems((prevItems) => {
                        const newItems = [...prevItems];
                        newItems[index] = {
                          ...newItems[index],
                          archivos: files || [],
                        };
                        return newItems;
                      });
                    }}
                    defaultValue={item.archivo}
                    onDelete={() => {
                      setItems((prevItems) => {
                        const newItems = [...prevItems];
                        newItems[index] = {
                          ...newItems[index],
                          remove: true,
                        };
                        return newItems;
                      });
                    }}
                  />
                </div>

                {puedeAsignarRecetas && (
                  <div className="mb-4 mt-6">
                    <Separator className="my-4" />
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                      <h3 className="text-sm font-medium mb-3 text-primary/90 flex items-center">
                        Asignar receta
                      </h3>
                      <RecetaSelector
                        value={item.receta}
                        onChange={(v) => {
                          setItems((prevItems) =>
                            prevItems.map((prevItem, i) => {
                              if (i !== index) return prevItem;
                              const nuevaCantidad = prevItem.cantidad || 1;
                              if (v.id) {
                                const {
                                  produccionEscalada,
                                  trabajosSeleccionados,
                                } = recalcularProduccionTrabajos(
                                  v,
                                  nuevaCantidad
                                );
                                return {
                                  ...prevItem,
                                  recetaId: v?.id,
                                  receta: v,
                                  produccionTrabajos: produccionEscalada,
                                  trabajosSeleccionados,
                                };
                              } else {
                                //LIMPIO LA RECETA
                                return {
                                  ...prevItem,
                                  recetaId: null,
                                  receta: null,
                                };
                              }
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                )}

                {puedeVerInventario && trabajos && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-muted-foreground shrink-0 mr-1">
                      Trabajos
                    </span>
                    {(
                      Object.values(trabajos) as {
                        id: number;
                        nombre: string;
                      }[][]
                    )
                      .flat()
                      .map((t) => {
                        const seleccionado = (
                          item.trabajosSeleccionados || []
                        ).includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              const actuales = item.trabajosSeleccionados || [];
                              handleChange(
                                index,
                                "trabajosSeleccionados",
                                seleccionado
                                  ? actuales.filter((id: number) => id !== t.id)
                                  : [...actuales, t.id]
                              );
                            }}
                            className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${
                              seleccionado
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {t.nombre}
                          </button>
                        );
                      })}
                  </div>
                )}

                {presupuestoId && puedeVerInventario && (
                  <div className="mt-4">
                    <Separator className="my-4" />
                    <CargaInventarioForm
                      produccionTrabajos={item.produccionTrabajos}
                      setProduccionTrabajos={(nuevoValor) =>
                        handleUpdateProduccionTrabajos(item.id, nuevoValor)
                      }
                      trabajos={trabajos}
                      trabajosSeleccionados={item.trabajosSeleccionados || []}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {puedeEditarItems && (
        <Button
          type="button"
          onClick={agregarItem}
          className="w-full"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar ítem
        </Button>
      )}
    </div>
  );
}
