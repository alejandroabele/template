"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CashflowTable from "@/components/tables/cashflow-table";
import BancoChart from "@/components/charts/cashflow/banco-chart";
import { TrendingUp, BarChart3 } from "lucide-react";
import CashflowSimulacionBanner from "@/components/cashflow-simulacion-banner";

interface CashflowPageProps {
  simulacionId?: number;
}

export default function CashflowPage({ simulacionId }: CashflowPageProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "flujo";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {simulacionId && <CashflowSimulacionBanner simulacionId={simulacionId} />}

      <Tabs
        value={tabParam}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className={simulacionId ? "grid w-full grid-cols-1" : "grid w-full grid-cols-2"}>
          <TabsTrigger value="flujo" className="text-center flex gap-2">
            <span className="hidden sm:inline">Flujo de Caja</span>
            <TrendingUp className="w-5 h-5" />
          </TabsTrigger>
          {!simulacionId && (
            <TabsTrigger value="saldos" className="text-center flex gap-2">
              <span className="hidden sm:inline">Saldos</span>
              <BarChart3 className="w-5 h-5" />
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="flujo">
          <CashflowTable simulacionId={simulacionId} />
        </TabsContent>
        {!simulacionId && (
          <TabsContent value="saldos">
            <BancoChart />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
