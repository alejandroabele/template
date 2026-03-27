"use client";
import { CartelTable } from "@/components/tables/cartel-table";
import { CartelesMapaWrapper } from "@/components/carteles-mapa";
import { useGetCartelesMapaQuery } from "@/hooks/alquiler-recurso";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutList, Map } from "lucide-react";
import { AlquilerRecurso } from "@/types";

const LEYENDA = [
  { label: "Libre", color: "#15803d" },
  { label: "Arrendado", color: "#4338ca" },
  { label: "En negociación", color: "#be185d" },
];

function MapaTab() {
  const { data: carteles = [], isLoading } = useGetCartelesMapaQuery();
  const conCoordenadas = carteles.filter((c) =>
    Boolean(c.cartel?.coordenadas)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          {LEYENDA.map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span
                className="inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              {label}
            </div>
          ))}
        </div>
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            {conCoordenadas} de {carteles.length} carteles con ubicación cargada
          </p>
        )}
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden w-fit">
        {isLoading ? (
          <div className="h-[80vh] w-[80vw] bg-muted animate-pulse flex items-center justify-center text-muted-foreground text-sm">
            Cargando mapa...
          </div>
        ) : (
          <CartelesMapaWrapper carteles={carteles as AlquilerRecurso[]} />
        )}
      </div>
    </div>
  );
}

export default function CartelesPage() {
  return (
    <>
      <Tabs defaultValue="lista">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista" className="flex gap-2">
            <LayoutList className="w-4 h-4" />
            <span>Lista</span>
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex gap-2">
            <Map className="w-4 h-4" />
            <span>Mapa de Carteles</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lista">
          <CartelTable />
        </TabsContent>
        <TabsContent value="mapa">
          <MapaTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
