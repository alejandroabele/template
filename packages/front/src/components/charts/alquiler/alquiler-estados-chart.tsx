"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetCantidadRecursosEstadoQuery } from '@/hooks/reportes-alquileres'
import { SkeletonChart } from '@/components/skeletons/skeleton-chart'
const chartData = [
    { estado: "Libre", cantidad: 90 },
    { estado: "Arrendado", cantidad: 150 },
    { estado: "Negociacion", cantidad: 80 },

]

const chartConfig = {
    cantidad: {
        label: "Cantidad",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function AlquilerEstadosChart() {
    const { data: chartData, isLoading } = useGetCantidadRecursosEstadoQuery()
    if (isLoading) return <SkeletonChart />
    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>Estados de Alquileres</CardTitle>
                <CardDescription>
                    Libres, Arrendados y En Negociación
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="estado" />
                        <PolarGrid />
                        <Radar
                            dataKey="cantidad"
                            fill="var(--color-cantidad)"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Año 2025
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Se muestra la cantidad de recursos divida por estados <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}
