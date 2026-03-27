"use client";

import { Suspense } from "react";
import { OfertasActivasTable } from "@/components/tables/ofertas-activas-table";
import { SolcomOfertasTable } from "@/components/tables/solcom-ofertas-table";
import { PageTitle } from "@/components/ui/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

function OfertasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("vista") || "solcoms";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vista", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="solcoms" className="flex gap-2">
          <Layers className="w-4 h-4" />
          <span>Por SOLCOM</span>
        </TabsTrigger>
        <TabsTrigger value="ofertas" className="flex gap-2">
          <List className="w-4 h-4" />
          <span>Ofertas</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="solcoms">
        <SolcomOfertasTable />
      </TabsContent>

      <TabsContent value="ofertas">
        <OfertasActivasTable />
      </TabsContent>
    </Tabs>
  );
}

export default function Ofertas() {
  return (
    <>
      <PageTitle title="Presupuestos activos" />
      <Suspense fallback={<SkeletonTable />}>
        <OfertasContent />
      </Suspense>
    </>
  );
}
