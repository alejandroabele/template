import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { Presupuesto } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { DataTableRowActions } from "./data-table-row-actions";
import { hasPermission } from "@/hooks/use-access";
import React from "react";
const baseUrl = "presupuestos";
import { differenceInDays } from "date-fns";
import { formatDate } from "@/utils/date";
import { formatMoney, formatCurrency } from "@/utils/number";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SelectFilter } from "@/components/select-filter";
import { MultiSelectFilter } from "@/components/multi-select-filter";
import { PERMISOS } from "@/constants/permisos";
import { PRESUPUESTO_ITEM_TIPO } from "@/constants/presupuesto";

export const useColumns = (): ColumnDef<Presupuesto>[] => {
  return [
    {
      id: "acciones",
      cell: ({ row }) => {
        // Verificación segura para TypeScript
        const isLeido =
          "presupuestoLeido" in row.original
            ? (row.original as { presupuestoLeido?: boolean }).presupuestoLeido
            : true; // Asume "leído" si el campo no existe

        return (
          <div
            className={cn(
              "h-full flex items-center",
              !isLeido && "border-l-8 border-l-gray-400 " // Borde rojo si NO está leído
            )}
          >
            <DataTableRowActions data={row.original} />
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      id: "id",
      header: "N°",
      enableGrouping: true,
      cell: ({ row }) => (
        <Link className="" href={`/${baseUrl}/${row.getValue("id")}`}>
          <CellColumn>{row.getValue("id")}</CellColumn>
        </Link>
      ),
    },
    {
      accessorFn: (row) => row.fecha,
      id: "fecha",
      accessorKey: "fecha",
      meta: {
        filterVariant: "date",
      },
      header: "Fecha inicio",
      cell: ({ row }) => (
        <CellColumn>{formatDate(row.original.fecha) || "-"}</CellColumn>
      ),
    },

    {
      accessorFn: (row) => row.vendedor?.nombre,
      id: "vendedor.nombre",
      header: "Vendedor",
      cell: ({ row }) => (
        <CellColumn>{row.original.vendedor?.nombre || "-"}</CellColumn>
      ),
    },

    {
      accessorFn: (row) => row.comprador,
      id: "comprador",
      header: "Comprador",
      cell: ({ row }) => (
        <CellColumn>{row.original.comprador || "-"}</CellColumn>
      ),
    },
    {
      accessorFn: (row) => row.cliente?.nombre,
      id: "cliente.nombre",
      header: "Cliente",
      cell: ({ row }) => (
        <CellColumn>{row.original.cliente?.nombre || "-"}</CellColumn>
      ),
    },
    {
      accessorKey: "descripcionCorta",
      header: "Descripción corta",
      id: "descripcionCorta",
    },
    {
      accessorFn: (row) => row.procesoGeneral?.nombre,
      id: "procesoGeneral.nombre",
      header: "Proceso",
      meta: {
        customFilter: (table: TableType<Presupuesto>) => (
          <MultiSelectFilter table={table} columnId="procesoGeneral.nombre" />
        ),
      },
      cell: ({ row }) => (
        <CellColumn>
          <Badge
            style={{
              backgroundColor: row.original.procesoGeneral?.color,
              color: "white",
            }}
            className="w-full justify-center text-center"
            variant={"secondary"}
          >
            {row.original.procesoGeneral?.nombre || "-"}
          </Badge>
        </CellColumn>
      ),
    },

    {
      accessorFn: (row) => row.area?.nombre,
      id: "area.nombre",
      meta: {
        customFilter: (table: TableType<Presupuesto>) => (
          <SelectFilter table={table} columnId="area.nombre" />
        ),
      },
      header: "Area",
      cell: ({ row }) => (
        <CellColumn>{row.original.area?.nombre || "-"}</CellColumn>
      ),
    },
    {
      id: "items.tipo",
      header: "Tipo ",
      accessorKey: "tipo",

      enableColumnFilter: true,
      meta: {
        customFilter: (table: TableType<Presupuesto>) => (
          <SelectFilter table={table} columnId="items.tipo" />
        ),
      },
      cell: ({ row }) => {
        const items: Array<{ tipo?: string }> =
          (row.original as Presupuesto & { items?: Array<{ tipo?: string }> })
            .items ?? [];
        const tiposUnicos = [
          ...new Set(items.map((i) => i.tipo).filter((t): t is string => !!t)),
        ];
        if (tiposUnicos.length === 0) return <CellColumn>-</CellColumn>;
        return (
          <CellColumn className="flex flex-wrap gap-1">
            {tiposUnicos.map((tipo) => {
              const tipoInfo = Object.values(PRESUPUESTO_ITEM_TIPO).find(
                (t) => t.valor === tipo
              );
              return tipoInfo ? (
                <Badge
                  key={tipo}
                  variant="outline"
                  className={`text-xs ${tipoInfo.color}`}
                >
                  {tipoInfo.label[0]}
                </Badge>
              ) : null;
            })}
          </CellColumn>
        );
      },
    },
    // Estado
    // Prioridad
    {
      accessorFn: (row) => row.fechaFabricacionEstimada,
      id: "fechaFabricacionEstimada",
      header: "Fecha fabricación",
      meta: {
        filterVariant: "date-range",
      },
      cell: ({ row }) => {
        const fechaEstimada = row.original.fechaFabricacionEstimada;
        const fechaReal = row.original.fechaFabricacion;

        const hoy = new Date();
        const fechaEstimadaDate = fechaEstimada
          ? new Date(fechaEstimada)
          : null;
        const fechaRealDate = fechaReal ? new Date(fechaReal) : null;

        let className = "bg-gray-300 text-black hover:bg-gray-400";

        if (fechaRealDate && fechaEstimadaDate) {
          if (fechaRealDate < fechaEstimadaDate) {
            className = "bg-green-500 text-black hover:bg-green-400";
          } else if (fechaEstimadaDate < fechaRealDate) {
            className = "bg-red-500 text-white hover:bg-red-400";
          }
        } else if (
          !fechaRealDate &&
          fechaEstimadaDate &&
          fechaEstimadaDate < hoy
        ) {
          className = "bg-red-500 text-white hover:bg-red-400";
        }

        return (
          <CellColumn className="space-y-1 flex flex-col items-start">
            <Badge className={className}>P {formatDate(fechaEstimada)}</Badge>
            <Badge className={className}>R {formatDate(fechaReal)}</Badge>
          </CellColumn>
        );
      },
    },
    {
      accessorFn: (row) => row.fechaEntregaEstimada,
      id: "fechaEntregaEstimada",
      header: "Fecha entrega",
      meta: {
        filterVariant: "date-range",
      },
      cell: ({ row }) => {
        const rawFechaEntregaEstimada = row.original.fechaEntregaEstimada;
        const rawFechaEntregaReal = row.original.fechaEntregado;
        if (!rawFechaEntregaEstimada || rawFechaEntregaReal) {
          return (
            <CellColumn className="space-y-1">
              <Badge className="bg-gray-300 text-black hover:bg-gray-400  ">
                P {formatDate(rawFechaEntregaEstimada)}
              </Badge>
              <Badge className="bg-gray-300 text-black hover:bg-gray-400  ">
                R {formatDate(rawFechaEntregaReal)}
              </Badge>
            </CellColumn>
          );
        }

        const fecha = new Date(rawFechaEntregaEstimada);
        const hoy = new Date();
        const diff = Math.ceil(
          (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        let className = "bg-green-500 text-black hover:bg-green-400  ";
        if (diff <= 0) className = "bg-red-500 text-white hover:bg-red-400 ";
        else if (diff <= 7)
          className = "bg-orange-400 text-black hover:bg-orange-400 ";
        else if (diff <= 15)
          className = "bg-yellow-300 text-black hover:bg-yellow-400 ";

        return (
          <CellColumn className="space-y-1 flex flex-col items-start">
            <Badge className={className}>
              P {formatDate(rawFechaEntregaEstimada)}
            </Badge>
            <Badge className={className}>
              R {formatDate(rawFechaEntregaReal)}
            </Badge>
          </CellColumn>
        );
      },
    },

    {
      id: "progreso",
      accessorKey: "progreso",
      header: "Progreso",
      cell: ({ row }) => {
        const progreso = row.original.progreso || 0;
        return (
          <CellColumn className="w-full">
            <div className="flex items-center gap-2">
              <Progress
                value={progreso}
                max={100}
                className="h-2 w-[80px]"
                style={
                  {
                    backgroundColor: "#e2e8f0",
                    "--progress-background":
                      progreso === 100 ? "#10b981" : "#f59e0b",
                  } as React.CSSProperties
                }
              />
              <span className="text-xs font-medium">{progreso}%</span>
            </div>
          </CellColumn>
        );
      },
    },

    ...(hasPermission(PERMISOS.PRESUPUESTOS_COSTOS_MATERIALES_VER)
      ? [
          {
            accessorFn: (row) => row.costoTotal,
            id: "costoTotal",
            header: "Total c/ estimado",
            cell: ({ row }) => (
              <CellColumn>{formatMoney(row.original.costoTotal)}</CellColumn>
            ),
          },
        ]
      : []),

    ...(hasPermission(PERMISOS.PRESUPUESTOS_PRECIO_VENTA_VER)
      ? [
          {
            accessorFn: (row) => row.ventaTotal,
            id: "ventaTotal",
            header: "Venta",
            cell: ({ row }) => (
              <CellColumn>{formatMoney(row.original.ventaTotal)}</CellColumn>
            ),
          },
        ]
      : []),

    ...(hasPermission(PERMISOS.PRESUPUESTOS_PRECIO_VENTA_VER)
      ? [
          {
            accessorFn: (row) => row.bab,
            id: "bab",
            header: "Rentabilidad",
            cell: ({ row }) => (
              <CellColumn>{formatMoney(row.original.bab)}</CellColumn>
            ),
          },
        ]
      : []),

    ...(hasPermission(PERMISOS.PRESUPUESTOS_PRECIO_VENTA_VER)
      ? [
          {
            accessorFn: (row) => row.ventaTotal,
            id: "%",
            accessorKey: "Rentabilidad",
            enableColumnFilter: false,
            enableSorting: false,
            header: "Rentabilidad %",
            cell: ({ row }) => {
              const venta = row.original.ventaTotal || 0;
              const bab = row.original.bab || 0;
              const porcentaje = venta > 0 ? (bab / venta) * 100 : 0;
              const color =
                porcentaje < 20 && porcentaje !== 0 ? "text-red-500" : "";
              return (
                <CellColumn
                  className={`${color} font-bold`}
                >{`% ${formatCurrency(porcentaje)}`}</CellColumn>
              );
            },
          },
        ]
      : []),
    ...(hasPermission(PERMISOS.PRESUPUESTO_COBRO_VER)
      ? [
          {
            accessorFn: (row) => row.montoCobrado,
            id: "montoCobrado",
            header: "Monto Cobrado",
            cell: ({ row }) => {
              const montoCobrado = row.original.montoCobrado || 0;
              const ventaTotal = row.original.ventaTotal || 0;
              const isValid = montoCobrado >= ventaTotal && ventaTotal > 0;

              return (
                <CellColumn className="flex items-center gap-2">
                  {formatMoney(montoCobrado)}
                  {isValid && (
                    <CheckCircle2Icon className="text-green-500 w-4 h-4" />
                  )}
                </CellColumn>
              );
            },
          },
        ]
      : []),

    ...(hasPermission(PERMISOS.PRESUPUESTO_FACTURACION_VER)
      ? [
          {
            accessorFn: (row) => row.montoFacturado,
            id: "montoFacturado",
            header: "Monto Facturado",
            cell: ({ row }) => {
              const montoFacturado = row.original.montoFacturado || 0;
              const ventaTotal = row.original.ventaTotal || 0;
              const isValid = montoFacturado >= ventaTotal && ventaTotal > 0;

              return (
                <CellColumn className="flex items-center gap-2">
                  {formatMoney(montoFacturado)}
                  {isValid && (
                    <CheckCircle2Icon className="text-green-500 w-4 h-4" />
                  )}
                </CellColumn>
              );
            },
          },
        ]
      : []),

    {
      id: "diasProgreso",
      header: "Días Progreso",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const diffDays = differenceInDays(
          new Date(),
          new Date(row.original.fecha)
        );
        return <CellColumn>{diffDays}</CellColumn>;
      },
    },

    {
      accessorFn: (row) => row.fechaEntregado,
      id: "fechaEntregado",
      header: "Fecha entregado",
      cell: ({ row }) => (
        <CellColumn>
          {formatDate(row.original.fechaEntregado) || "-"}
        </CellColumn>
      ),
    },
    {
      id: "disenoEstatus",
      accessorKey: "disenoEstatus",
      header: "Estatus de diseño",
      cell: ({ row }) => {
        const value = row.getValue("disenoEstatus");
        const isCompleto = value === "completo";
        return (
          <Badge
            variant={isCompleto ? "success" : "warning"}
            role="status"
            aria-label={isCompleto ? "Diseño completo" : "Diseño pendiente"}
          >
            {isCompleto ? "Completo" : "Pendiente"}
          </Badge>
        );
      },
    },
    ...(hasPermission(PERMISOS.PRESUPUESTOS_FILTRO_VER_COSTEO_COMPLETO)
      ? [
          {
            accessorKey: "costeoEstatus",
            id: "costeoEstatus",
            header: "Estatus costeo técnico",
            meta: {
              customFilter: (table: TableType<Presupuesto>) => (
                <SelectFilter table={table} columnId="costeoEstatus" />
              ),
            },
            cell: ({ row }) => {
              const value = row.getValue("costeoEstatus");
              const isCompleto = value === "completo";
              return (
                <Badge
                  variant={isCompleto ? "success" : "warning"}
                  role="status"
                  aria-label={
                    isCompleto ? "Costeo completo" : "Costeo pendiente"
                  }
                >
                  {isCompleto ? "Completo" : "Pendiente"}
                </Badge>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: "fechaVerificacionAlmacen",
      id: "fechaVerificacionAlmacen",
      header: "Verificado por almacen",
      meta: {
        filterVariant: "date",
      },
      cell: ({ row }) => (
        <CellColumn>
          {formatDate(row.original.fechaVerificacionAlmacen)}
        </CellColumn>
      ),
    },

    {
      accessorKey: "fechaVerificacionServicio",
      id: "fechaVerificacionServicio",
      header: "Verificado por Servicio",
      meta: {
        filterVariant: "date",
      },
      cell: ({ row }) => (
        <CellColumn>
          {formatDate(row.original.fechaVerificacionServicio)}
        </CellColumn>
      ),
    },
    {
      accessorKey: "fechaRecepcionAlmacen",
      id: "fechaRecepcionAlmacen",
      header: "Recibido por almacen",
      meta: {
        filterVariant: "date",
      },
      cell: ({ row }) => (
        <CellColumn>
          {formatDate(row.original.fechaRecepcionAlmacen)}
        </CellColumn>
      ),
    },
    ...(hasPermission(
      PERMISOS.PRESUPUESTOS_FILTRO_VER_COSTEO_COMERCIAL_COMPLETO
    )
      ? [
          {
            accessorKey: "costeoComercialEstatus",
            id: "costeoComercialEstatus",
            header: "Estatus costeo comercial",
            meta: {
              customFilter: (table: TableType<Presupuesto>) => (
                <SelectFilter table={table} columnId="costeoComercialEstatus" />
              ),
            },
            cell: ({ row }) => {
              const value = row.getValue("costeoComercialEstatus");
              const isCompleto = value === "completo";
              return (
                <Badge
                  variant={isCompleto ? "success" : "warning"}
                  role="status"
                  aria-label={
                    isCompleto
                      ? "Costeo comercial completo"
                      : "Costeo comercial pendiente"
                  }
                >
                  {isCompleto ? "Completo" : "Pendiente"}
                </Badge>
              );
            },
          },
        ]
      : []),

    ...(hasPermission(PERMISOS.PRESUPUESTO_FACTURACION_VER)
      ? [
          {
            accessorKey: "facturacionEstatus",
            id: "facturacionEstatus",
            header: "Estatus facturación",
            meta: {
              customFilter: (table: TableType<Presupuesto>) => (
                <SelectFilter table={table} columnId="facturacionEstatus" />
              ),
            },
            cell: ({ row }) => {
              const value = row.getValue("facturacionEstatus");

              let variant: "success" | "warning" | "destructive" = "warning";
              let label = "Pendiente";

              if (value === "total") {
                variant = "success";
                label = "Completo";
              } else if (value === "parcial") {
                variant = "destructive";
                label = "Parcial";
              }

              return (
                <Badge
                  variant={variant}
                  role="status"
                  aria-label={`Estado de facturación: ${label}`}
                >
                  {label}
                </Badge>
              );
            },
          },
        ]
      : []),
    ...(hasPermission(PERMISOS.PRESUPUESTO_COBRO_VER)
      ? [
          {
            accessorKey: "cobranzaEstatus",
            id: "cobranzaEstatus",
            header: "Estatus cobranza",
            meta: {
              customFilter: (table: TableType<Presupuesto>) => (
                <SelectFilter table={table} columnId="cobranzaEstatus" />
              ),
            },
            cell: ({ row }) => {
              const value = row.getValue("cobranzaEstatus");

              let variant: "success" | "warning" | "destructive" = "warning";
              let label = "Pendiente";

              if (value === "total") {
                variant = "success";
                label = "Completo";
              } else if (value === "parcial") {
                variant = "destructive";
                label = "Parcial";
              }

              return (
                <Badge
                  variant={variant}
                  role="status"
                  aria-label={`Estado de cobranza: ${label}`}
                >
                  {label}
                </Badge>
              );
            },
          },
        ]
      : []),

    {
      accessorKey: "produccionEstatus",
      id: "produccionEstatus",
      header: "Estatus trabajos",
      meta: {
        customFilter: (table: TableType<Presupuesto>) => (
          <SelectFilter table={table} columnId="produccionEstatus" />
        ),
      },
      cell: ({ row }) => {
        const value = row.getValue("produccionEstatus");

        let variant: "success" | "warning" | "destructive" = "warning";
        let label = "Pendiente";

        if (value === "completo") {
          variant = "success";
          label = "Completo";
        }

        return (
          <Badge
            variant={variant}
            role="status"
            aria-label={`Estado de producción: ${label}`}
          >
            {label}
          </Badge>
        );
      },
    },
  ];
};
