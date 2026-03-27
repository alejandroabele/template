"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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
import { useGetCantidadRecursosTipoQuery } from '@/hooks/reportes-alquileres'
import { SkeletonChart } from '@/components/skeletons/skeleton-chart'
const chartData = [
    { tipo: "Trailers", alquileres: 40, fill: "var(--color-TRAILERS)" },
    { tipo: "Carteles", alquileres: 22, fill: "var(--color-CARTELES)" },
    { tipo: "Camiones", alquileres: 10, fill: "var(--color-CAMIONES)" },
]

const chartConfig = {
    Alquileres: {
        label: "Alquileres",
    },
    TRAILERS: {
        label: "Trailers",
        color: "hsl(var(--chart-1))",
    },
    CARTELES: {
        label: "Carteles",
        color: "hsl(var(--chart-2))",
    },
    CAMIONES: {
        label: "Camiones",
        color: "hsl(var(--chart-3))",
    },

} satisfies ChartConfig

export function AlquilerCantidadTiposChart() {

    const { data: chartData, isLoading } = useGetCantidadRecursosTipoQuery()
    if (isLoading) return <SkeletonChart />

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Tipos de recursos</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="Alquileres" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="alquileres">
                            <LabelList
                                dataKey="tipo"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">

                <div className="leading-none text-muted-foreground">
                    Se muestra el total de alquileres divido por tipos
                </div>
            </CardFooter>
        </Card>
    )
}
