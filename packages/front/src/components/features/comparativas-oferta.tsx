"use client";

import React, { useState } from "react";
import type { Oferta, OfertaItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/utils/number";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Clock,
  Building2,
  Package,
  Trophy,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AprobacionMasivaOfertasDialog } from "@/components/dialogs/aprobacion-masiva-ofertas-dialog";
import { useStore } from "@/lib/store";
import { PERMISOS } from "@/constants/permisos";
import { ESTADO_OFERTA_CODIGOS } from "@/constants/compras";

interface ComparativasOfertaProps {
  ofertas: Oferta[];
}

interface ItemComparativo {
  inventarioId: number;
  nombre: string;
  sku?: string;
  ofertas: Map<number, OfertaItem>;
}

export function ComparativasOferta({ ofertas }: ComparativasOfertaProps) {
  const [expandedOfertas, setExpandedOfertas] = useState<Set<number>>(
    new Set()
  );
  const [openAprobacionDialog, setOpenAprobacionDialog] = useState(false);
  const permissions = useStore((state) => state.permissions);

  // Verificar si el usuario tiene algún permiso de aprobación
  const permisosAprobacion: string[] = [
    PERMISOS.OFERTA_APROBAR_TECNICA,
    PERMISOS.OFERTA_APROBAR_CALIDAD,
    PERMISOS.OFERTA_APROBAR_GERENCIA,
    PERMISOS.OFERTA_APROBAR_ADMINISTRACION,
  ];
  const tienePermisoAprobacion = permissions.some(
    (p) => p?.codigo && permisosAprobacion.includes(p.codigo)
  );

  // Verificar si hay ofertas en estado de validación
  const hayOfertasEnValidacion = ofertas.some(
    (oferta) => oferta.estado?.codigo === ESTADO_OFERTA_CODIGOS.OF_VALIDACION
  );

  const toggleExpanded = (ofertaId: number) => {
    setExpandedOfertas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ofertaId)) {
        newSet.delete(ofertaId);
      } else {
        newSet.add(ofertaId);
      }
      return newSet;
    });
  };

  const itemsComparativos = React.useMemo(() => {
    const itemsMap = new Map<number, ItemComparativo>();

    ofertas.forEach((oferta) => {
      oferta.items?.forEach((item) => {
        const inventarioId = item.inventarioId;
        if (!itemsMap.has(inventarioId)) {
          itemsMap.set(inventarioId, {
            inventarioId,
            nombre: item.inventario?.nombre || item.descripcion || "Sin nombre",
            sku: item.inventario?.sku,
            ofertas: new Map(),
          });
        }
        itemsMap.get(inventarioId)!.ofertas.set(oferta.id!, item);
      });
    });

    return Array.from(itemsMap.values());
  }, [ofertas]);

  const { totales, menorTotalGeneral, mejorOfertaId } = React.useMemo(() => {
    const totalesCalc = ofertas.map((oferta) => ({
      ofertaId: oferta.id!,
      total:
        oferta.items?.reduce((sum, item) => {
          const precio = Number.parseFloat(item.precio || "0");
          const cantidad = Number.parseFloat(item.cantidad || "0");
          return sum + precio * cantidad;
        }, 0) || 0,
      esFavorito: oferta.favorito,
    }));

    const menorTotal = Math.min(
      ...totalesCalc.map((t) => t.total).filter((t) => t > 0)
    );
    const mejorOferta =
      totalesCalc.find((t) => t.total === menorTotal && t.total > 0)
        ?.ofertaId || null;

    return {
      totales: totalesCalc,
      menorTotalGeneral: menorTotal,
      mejorOfertaId: mejorOferta,
    };
  }, [ofertas]);

  const getMenorPrecioUnitario = (itemComparativo: ItemComparativo) => {
    let menorPrecio = Number.POSITIVE_INFINITY;
    let ofertaIdMenorPrecio: number | null = null;

    itemComparativo.ofertas.forEach((item, ofertaId) => {
      const precio = Number.parseFloat(item.precio || "0");
      if (precio > 0 && precio < menorPrecio) {
        menorPrecio = precio;
        ofertaIdMenorPrecio = ofertaId;
      }
    });

    return ofertaIdMenorPrecio;
  };

  const getMenorPrecioTotal = (itemComparativo: ItemComparativo) => {
    let menorTotal = Number.POSITIVE_INFINITY;
    let ofertaIdMenorTotal: number | null = null;

    itemComparativo.ofertas.forEach((item, ofertaId) => {
      const precio = Number.parseFloat(item.precio || "0");
      const cantidad = Number.parseFloat(item.cantidad || "0");
      const total = precio * cantidad;

      if (total > 0 && total < menorTotal) {
        menorTotal = total;
        ofertaIdMenorTotal = ofertaId;
      }
    });

    return ofertaIdMenorTotal;
  };


  if (ofertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-dashed border-border bg-muted/30 p-12">
        <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-lg font-medium text-foreground mb-1">
          Sin ofertas para comparar
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecciona ofertas para comenzar la comparación
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Comparar Ofertas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analiza y compara {ofertas.length}{" "}
            {ofertas.length === 1 ? "oferta" : "ofertas"} lado a lado
          </p>
        </div>
        {tienePermisoAprobacion && hayOfertasEnValidacion && (
          <Button onClick={() => setOpenAprobacionDialog(true)}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Aprobar / Rechazar
          </Button>
        )}
      </div>

      {/* Diálogo de aprobación masiva */}
      <AprobacionMasivaOfertasDialog
        open={openAprobacionDialog}
        onOpenChange={setOpenAprobacionDialog}
        ofertas={ofertas}
      />


      {/* Cards de resumen por proveedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ofertas.map((oferta) => {
          const totalOferta =
            totales.find((t) => t.ofertaId === oferta.id)?.total || 0;
          const esMejorOferta = oferta.id === mejorOfertaId;
          const isExpanded = expandedOfertas.has(oferta.id!);

          return (
            <div
              key={oferta.id}
              className={`relative rounded-xl border p-5 space-y-4 transition-all ${
                esMejorOferta
                  ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20 dark:border-primary/70 dark:bg-primary/10"
                  : oferta.favorito
                    ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-500/30"
                    : "border-border bg-card hover:border-muted-foreground/20"
              }`}
            >
              {/* Badges flotantes */}
              <div className="absolute -top-2.5 right-3 flex gap-1.5">
                {esMejorOferta && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    <Trophy className="w-3 h-3" />
                    Mejor oferta
                  </span>
                )}
                {oferta.favorito && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white dark:bg-amber-600">
                    <Star className="w-3 h-3 fill-white" />
                    Favorita
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-muted-foreground">
                    Oferta #{oferta.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {oferta.proveedor?.razonSocial}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(oferta.id!)}
                  className="h-8 w-8 p-0 shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Total General
                </p>
                <p
                  className={`text-2xl font-semibold tracking-tight ${esMejorOferta ? "text-primary" : "text-foreground"}`}
                >
                  {formatMoney(totalOferta)}
                </p>
              </div>

              <div className="space-y-3 text-sm border-t border-border/50 pt-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span className="flex-1">Método de pago</span>
                  <span className="font-medium text-foreground">
                    {oferta.metodoPago?.nombre || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="flex-1">Plazo de pago</span>
                  <span className="font-medium text-foreground">
                    {oferta.plazoPago?.descripcion || "—"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Validez</span>
                      <span className="font-medium text-foreground">
                        {oferta.validez || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span className="flex-1">Disponibilidad</span>
                      <span className="font-medium text-foreground">
                        {oferta.fechaDisponibilidad || "—"}
                      </span>
                    </div>
                    {oferta.moneda && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex-1">Moneda</span>
                        <Badge variant="outline" className="font-medium">
                          {oferta.moneda}
                        </Badge>
                      </div>
                    )}
                    {oferta.observaciones && (
                      <div className="pt-3 border-t border-border/50">
                        <span className="text-muted-foreground font-medium block mb-1">
                          Observaciones:
                        </span>
                        <p className="text-sm text-foreground">
                          {oferta.observaciones}
                        </p>
                      </div>
                    )}
                    {oferta.anotacionesInternas && (
                      <div>
                        <span className="text-muted-foreground font-medium block mb-1">
                          Anotaciones Internas:
                        </span>
                        <p className="text-sm text-foreground">
                          {oferta.anotacionesInternas}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla comparativa */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[280px]">
                  Producto
                </th>
                {ofertas.map((oferta) => {
                  const esMejorOferta = oferta.id === mejorOfertaId;
                  return (
                    <th
                      key={oferta.id}
                      className={`p-4 text-center text-xs font-medium uppercase tracking-wider min-w-[200px] ${
                        esMejorOferta
                          ? "text-primary bg-primary/5 dark:bg-primary/10"
                          : oferta.favorito
                            ? "text-amber-700 bg-amber-50/50 dark:text-amber-400 dark:bg-amber-950/20"
                            : "text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {esMejorOferta && (
                          <Trophy className="w-3.5 h-3.5 text-primary" />
                        )}
                        {oferta.favorito && !esMejorOferta && (
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                        )}
                        <span className="truncate max-w-[140px]">
                          {oferta.proveedor?.razonSocial ||
                            `Oferta #${oferta.id}`}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {itemsComparativos.map((itemComp) => {
                const ofertaMenorPrecioUnitario =
                  getMenorPrecioUnitario(itemComp);
                const ofertaMenorPrecioTotal = getMenorPrecioTotal(itemComp);

                return (
                  <tr
                    key={itemComp.inventarioId}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {itemComp.nombre}
                        </p>
                        {itemComp.sku && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            SKU: {itemComp.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    {ofertas.map((oferta) => {
                      const item = itemComp.ofertas.get(oferta.id!);
                      const esMenorPrecioUnitario =
                        oferta.id === ofertaMenorPrecioUnitario;
                      const esMenorPrecioTotal =
                        oferta.id === ofertaMenorPrecioTotal;
                      const esMejorOferta = oferta.id === mejorOfertaId;

                      if (!item) {
                        return (
                          <td
                            key={oferta.id}
                            className={`p-4 text-center ${esMejorOferta ? "bg-primary/5 dark:bg-primary/10" : oferta.favorito ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}
                          >
                            <span className="text-xs text-muted-foreground italic">
                              No cotizado
                            </span>
                          </td>
                        );
                      }

                      const precio = Number.parseFloat(item.precio || "0");
                      const cantidad = Number.parseFloat(item.cantidad || "0");
                      const total = precio * cantidad;

                      return (
                        <td
                          key={oferta.id}
                          className={`p-4 ${esMejorOferta ? "bg-primary/5 dark:bg-primary/10" : oferta.favorito ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Cant.
                              </span>
                              <span className="font-medium text-foreground">
                                {cantidad}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Unit.
                              </span>
                              <span
                                className={`font-medium ${esMenorPrecioUnitario ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}
                              >
                                {formatMoney(precio)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                              <span className="text-muted-foreground font-medium">
                                Total
                              </span>
                              <span
                                className={`font-semibold ${esMenorPrecioTotal ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}
                              >
                                {formatMoney(total)}
                              </span>
                            </div>
                            {item.alicuota && (
                              <p className="text-xs text-muted-foreground">
                                IVA: {item.alicuota}%
                              </p>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

            </tbody>
            <tfoot>
              <tr className="bg-muted/70 border-t-2 border-border">
                <td className="p-4">
                  <span className="font-semibold text-sm text-foreground">
                    Total General
                  </span>
                </td>
                {totales.map(({ ofertaId, total, esFavorito }) => {
                  const esMejorOfertaGeneral = ofertaId === mejorOfertaId;

                  return (
                    <td
                      key={ofertaId}
                      className={`p-4 text-center ${
                        esMejorOfertaGeneral
                          ? "bg-primary/10 dark:bg-primary/20"
                          : esFavorito
                            ? "bg-amber-50/50 dark:bg-amber-950/20"
                            : ""
                      }`}
                    >
                      <p
                        className={`text-xl font-bold ${esMejorOfertaGeneral ? "text-primary" : "text-foreground"}`}
                      >
                        {formatMoney(total)}
                      </p>
                      {esMejorOfertaGeneral && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
                          <Trophy className="w-3.5 h-3.5" /> Mejor oferta
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
