"use client";
import { SolcomTable } from "@/components/tables/solcom-table";
import { SolcomItemsTable } from "@/components/tables/solcom-items-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Package } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";

function SolcomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "solcoms";
  const [tabValue, setTabValue] = React.useState(initialTab);

  const handleTabChange = (newTab: string) => {
    setTabValue(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="solcoms" className="flex gap-2">
          <List className="w-4 h-4" />
          <span>SOLCOMs</span>
        </TabsTrigger>
        <TabsTrigger value="items" className="flex gap-2">
          <Package className="w-4 h-4" />
          <span>Items</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="solcoms">
        <SolcomTable />
      </TabsContent>

      <TabsContent value="items">
        <SolcomItemsTable />
      </TabsContent>
    </Tabs>
  );
}

export default function Solcom() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SolcomContent />
    </Suspense>
  );
}
