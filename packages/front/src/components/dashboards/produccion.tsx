"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Layers, PaintBucket, Printer, Box, Wrench, BarChart3, HardHat } from "lucide-react"
import { useGetProduccionTrabajosQuery } from '@/hooks/produccion-trabajos'
import { MAX_LIMIT } from "@/constants/query"
import { Skeleton } from "@/components/ui/skeleton"

// Tipos
interface CategoryItem {
    id: number
    name: string
    color: string
    icon: ReactNode
}

interface CategoriesDashboardProps {
    showProduccion?: boolean
    showServicio?: boolean
    className?: string
}

// Mapeo de iconos por nombre de categoría
const iconMap: Record<string, ReactNode> = {
    "METALURGICA": <Activity className="h-5 w-5" />,
    "PINTURA": <PaintBucket className="h-5 w-5" />,
    "GRAFICA": <Layers className="h-5 w-5" />,
    "PLOTEO": <Printer className="h-5 w-5" />,
    "TERMINACIONES": <Box className="h-5 w-5" />,
    "MONTAJE": <Wrench className="h-5 w-5" />,
    "SERVICIO PETROLERO": <BarChart3 className="h-5 w-5" />,
    "OBRA": <HardHat className="h-5 w-5" />,
}

export default function ProduccionDashboard({
    showProduccion = true,
    showServicio = true,
    className = "",
}: CategoriesDashboardProps) {
    const { data, isLoading } = useGetProduccionTrabajosQuery({
        pagination: {
            pageIndex: 0,
            pageSize: MAX_LIMIT,
        },
        globalFilter: 'menu'
    });

    // Función para renderizar una tarjeta de categoría
    const renderCategoryCard = (item: CategoryItem) => (
        <Link key={item.id} href={`/presupuestos/produccion?trabajoId=${item.id}`}>
            <Card className="border-l-4 h-full" style={{ borderLeftColor: item.color }}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                            <div className="text-foreground">{item.icon}</div>
                        </div>
                        <h3 className="font-medium">{item.name}</h3>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )

    if (isLoading) {
        return (
            <div className={`space-y-6 ${className}`}>
                {showProduccion && (
                    <div>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle>Órdenes en producción</CardTitle>
                        </CardHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </div>
                )}
                {showServicio && (
                    <div>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle>Órdenes en servicio</CardTitle>
                        </CardHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Transformar los datos del servicio al formato esperado
    const produccionData: CategoryItem[] = data?.producto?.map(item => ({
        id: item.id,
        name: item.nombre,
        color: item.color,
        icon: iconMap[item.nombre] || <Activity className="h-5 w-5" />
    })) || []

    const servicioData: CategoryItem[] = data?.servicio?.map(item => ({
        id: item.id,
        name: item.nombre,
        color: item.color,
        icon: iconMap[item.nombre] || <Wrench className="h-5 w-5" />
    })) || []

    return (
        <div className={`space-y-6 ${className}`}>
            {showProduccion && (
                <div>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Órdenes en producción</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {produccionData.map((item) => renderCategoryCard(item))}
                    </div>
                </div>
            )}

            {showServicio && (
                <div>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Órdenes en servicio</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {servicioData.map((item) => renderCategoryCard(item))}
                    </div>
                </div>
            )}
        </div>
    )
}