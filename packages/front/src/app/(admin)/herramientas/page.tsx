"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HerramientaTable } from "@/components/tables/herramienta-table";
import { PrestamoActivoTable } from "@/components/tables/prestamo-activo-table";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { useHerramientas, usePrestamosActivos } from "@/hooks/herramienta";
import { Wrench, HandHelping, PackageCheck, AlertTriangle } from "lucide-react";

function StatsBar() {
    const { data: herramientas = [] } = useHerramientas({
        pagination: { pageIndex: 0, pageSize: 1000 },
        columnFilters: [],
        sorting: [],
        globalFilter: "",
    });
    const { data: prestamos = [] } = usePrestamosActivos();

    const totalHerramientas = (herramientas as any[]).length;
    const totalPrestadas = (prestamos as any[]).reduce((acc: number, p: any) => acc + Number(p.cantidad), 0);
    const personasConPrestamo = new Set((prestamos as any[]).map((p: any) => p.persona?.id).filter(Boolean)).size;
    const sinStock = (herramientas as any[]).filter((h: any) => Number(h.stock) - Number(h.prestadas ?? 0) <= 0).length;

    const stats = [
        {
            label: "Total herramientas",
            value: totalHerramientas,
            icon: Wrench,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Unidades prestadas",
            value: totalPrestadas,
            icon: HandHelping,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            label: "Personas con préstamo",
            value: personasConPrestamo,
            icon: PackageCheck,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Sin disponibilidad",
            value: sinStock,
            icon: AlertTriangle,
            color: sinStock > 0 ? "text-red-600" : "text-gray-400",
            bg: sinStock > 0 ? "bg-red-50" : "bg-gray-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.label} className="rounded-lg border bg-card p-4 flex items-center gap-4">
                        <div className={`rounded-full p-2 ${stat.bg}`}>
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function HerramientasContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("vista") || "herramientas";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("vista", value);
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <div className="mb-6">
                <PageTitle title="Herramientas" />
            </div>

            <StatsBar />

            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="herramientas" className="flex gap-2">
                        <Wrench className="w-4 h-4" />
                        <span>Herramientas</span>
                    </TabsTrigger>
                    <TabsTrigger value="prestamos" className="flex gap-2">
                        <HandHelping className="w-4 h-4" />
                        <span>Préstamos activos</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="herramientas">
                    <HerramientaTable />
                </TabsContent>

                <TabsContent value="prestamos">
                    <PrestamoActivoTable />
                </TabsContent>
            </Tabs>
        </>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<SkeletonTable />}>
            <HerramientasContent />
        </Suspense>
    );
}
