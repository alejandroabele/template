"use client";

import { Suspense } from "react";
import CashflowDashboard from "@/components/dashboards/cashflow";
import CashflowVisionGeneral from "@/components/dashboards/cashflow-vision-general";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LayoutDashboard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("vista") || "general";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vista", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general" className="flex gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span>Visión General</span>
        </TabsTrigger>
        <TabsTrigger value="avanzado" className="flex gap-2">
          <BarChart2 className="w-4 h-4" />
          <span>Estadísticas Avanzadas</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <CashflowVisionGeneral />
      </TabsContent>

      <TabsContent value="avanzado">
        <CashflowDashboard />
      </TabsContent>
    </Tabs>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
