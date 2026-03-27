"use client";

import {
  DollarSign,
  Clock,
  AlertTriangle,
  AlertCircle,
  Eye,
  Bell,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Factura } from "@/types";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  format,
  subDays,
  addYears,
} from "date-fns";
import { FACTURA_ESTADO } from "@/constants/factura";

import type { ColumnFiltersState } from "@tanstack/react-table";

interface FacturacionMetricasCardsProps {
  facturas: Factura[];
  isLoading: boolean;
  onApplyFilter: (filtros: ColumnFiltersState) => void;
  filtrosActivos: ColumnFiltersState;
  onNotificar: (filtros: ColumnFiltersState) => void;
}
export function FacturacionMetricasCards({
  facturas,
  isLoading,
  onApplyFilter,
  filtrosActivos,
  onNotificar,
}: FacturacionMetricasCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hoy = new Date();
  const inicioMes = startOfMonth(hoy);
  const finMes = endOfMonth(hoy);

  let cobradoMes = 0;
  let totalACobrar = 0;
  let pendientes = 0;
  let atrasado = 0;
  let muyAtrasado = 0;

  facturas.forEach((factura) => {
    const facturaCobros = factura.cobros || [];
    const montoCobrado = facturaCobros.reduce(
      (sum, cobro) => sum + (Number(cobro.monto) || 0),
      0
    );
    // Usar importeBruto si existe, sino usar monto
    const montoFactura = Number(factura.importeBruto || factura.monto) || 0;

    // Cobrado este mes
    facturaCobros.forEach((cobro) => {
      if (cobro.fecha) {
        const fechaCobro = parseISO(cobro.fecha);
        if (fechaCobro >= inicioMes && fechaCobro <= finMes) {
          cobradoMes += Number(cobro.monto) || 0;
        }
      }
    });

    // Total a cobrar: facturas con estado "parcial" o "pendiente"
    if (
      factura.estado === FACTURA_ESTADO.PARCIAL ||
      factura.estado === FACTURA_ESTADO.PENDIENTE
    ) {
      const montoPendiente = montoFactura - montoCobrado;
      totalACobrar += montoPendiente;

      // Métricas basadas en estado + fecha de vencimiento
      if (factura.fechaVencimiento) {
        const fechaVenc = parseISO(factura.fechaVencimiento);
        const diasVencido = differenceInDays(hoy, fechaVenc);

        if (diasVencido > 45) {
          muyAtrasado += montoPendiente;
        } else if (diasVencido > 0) {
          atrasado += montoPendiente;
        } else {
          pendientes += montoPendiente;
        }
      } else {
        pendientes += montoPendiente;
      }
    }
  });

  const cards = [
    {
      title: "Cobrado Mensual",
      value: cobradoMes,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: "Total cobrado en el mes actual",
      buildFilter: (): ColumnFiltersState => {
        const inicioMes = format(
          new Date(hoy.getFullYear(), hoy.getMonth(), 1),
          "yyyy-MM-dd"
        );
        const finMes = format(
          new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0),
          "yyyy-MM-dd"
        );
        return [
          {
            id: "cobros.fecha",
            value: { from: inicioMes, to: finMes },
          },
        ];
      },
    },
    {
      title: "Total a Cobrar",
      value: totalACobrar,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Facturas pendientes o parciales",
      buildFilter: (): ColumnFiltersState => [
        {
          id: "estado",
          value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE],
        },
      ],
    },
    {
      title: "Pendientes",
      value: pendientes,
      icon: Clock,
      color: "text-sky-600",
      bgColor: "bg-sky-100",
      description: "Facturas sin vencer y sin cobro",
      buildFilter: (): ColumnFiltersState => [
        {
          id: "estado",
          value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE],
        },
        {
          id: "fechaVencimiento",
          value: {
            from: format(hoy, "yyyy-MM-dd"),
            to: format(addYears(hoy, 100), "yyyy-MM-dd"),
          },
        },
      ],
    },
    {
      title: "Atrasado",
      value: atrasado,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Vencidas ≤45 días sin cobro",
      buildFilter: (): ColumnFiltersState => [
        {
          id: "estado",
          value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE],
        },
        {
          id: "fechaVencimiento",
          value: {
            from: format(subDays(hoy, 45), "yyyy-MM-dd"),
            to: format(subDays(hoy, 1), "yyyy-MM-dd"),
          },
        },
      ],
    },
    {
      title: "Muy Atrasado",
      value: muyAtrasado,
      icon: AlertCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      description: "Vencidas >45 días sin cobro",
      buildFilter: (): ColumnFiltersState => [
        {
          id: "estado",
          value: [FACTURA_ESTADO.PARCIAL, FACTURA_ESTADO.PENDIENTE],
        },
        {
          id: "fechaVencimiento",
          value: {
            from: "1900-01-01",
            to: format(subDays(hoy, 46), "yyyy-MM-dd"),
          },
        },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;

        // Determinar si esta card está activa comparando filtros
        const filtrosCard = card.buildFilter();
        const estaActivo =
          filtrosActivos.length === filtrosCard.length &&
          filtrosActivos.every((filtroActivo) => {
            const filtroCard = filtrosCard.find(
              (f) => f.id === filtroActivo.id
            );
            if (!filtroCard) return false;
            return (
              JSON.stringify(filtroActivo.value) ===
              JSON.stringify(filtroCard.value)
            );
          });

        return (
          <Card
            key={index}
            className={`hover:shadow-md transition-shadow ${
              estaActivo ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`${card.bgColor} p-2 rounded-md`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color} mb-2`}>
                <Currency>{card.value}</Currency>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant={estaActivo ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={() => onApplyFilter(card.buildFilter())}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {estaActivo ? "Ocultar" : "Ver"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={() => onNotificar(card.buildFilter())}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Notificar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
