"use client";

import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { type TotalesPeriodo } from "@/services/cashflow-transaccion";

interface CashflowTotalesCardsProps {
  totales?: TotalesPeriodo;
  isLoading: boolean;
}

export function CashflowTotalesCards({
  totales,
  isLoading,
}: CashflowTotalesCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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

  const cards = [
    {
      title: "Total Ingresos",
      value: totales?.totalIngresos || 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Egresos",
      value: totales?.totalEgresos || 0,
      icon: TrendingDown,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      title: "Saldo del Período",
      value: totales?.saldoActual || 0,
      icon: Wallet,
      color:
        totales?.saldoActual && totales.saldoActual >= 0
          ? "text-emerald-600"
          : "text-rose-600",
      bgColor:
        totales?.saldoActual && totales.saldoActual >= 0
          ? "bg-emerald-100"
          : "bg-rose-100",
    },
    {
      title: "Saldo Acumulado",
      value: totales?.saldoAcumulado || 0,
      icon: DollarSign,
      color:
        totales?.saldoAcumulado && totales.saldoAcumulado >= 0
          ? "text-sky-600"
          : "text-rose-600",
      bgColor:
        totales?.saldoAcumulado && totales.saldoAcumulado >= 0
          ? "bg-sky-100"
          : "bg-rose-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`${card.bgColor} p-2 rounded-md`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                <Currency>{card.value}</Currency>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
