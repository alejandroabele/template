"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import { SkeletonChart } from "@/components/skeletons/skeleton-chart"

import { useGetFacturacionCobranzaQuery } from '@/hooks/reportes-alquileres'
// const chartData = [
//     { month: "Enero", facturados: 186, cobrados: 80 },
//     { month: "Febrero", facturados: 305, cobrados: 200 },
//     { month: "Marzo", facturados: 237, cobrados: 120 },
//     { month: "Abril", facturados: 73, cobrados: 190 },
//     { month: "Mayo", facturados: 209, cobrados: 130 },
//     { month: "Junio", facturados: 214, cobrados: 140 },
// ]

const chartConfig = {
    facturados: {
        label: "Facturados",
        color: "hsl(var(--chart-1))",
    },
    cobrados: {
        label: "Cobrados",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function AlquilerCobrosFacturacionMensualChart() {
    const { data: chartData, isLoading } = useGetFacturacionCobranzaQuery()
    if (isLoading) return <SkeletonChart />
    return (
        <Card>
            <CardHeader>
                <CardTitle>Facturacion y cobranza</CardTitle>
                <CardDescription>Enero - Junio 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="facturados" fill="var(--color-facturados)" radius={4} />
                        <Bar dataKey="cobrados" fill="var(--color-cobrados)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">

                <div className="leading-none text-muted-foreground">
                    Se muestra la cantidad de facturas y cobros realizados
                </div>
            </CardFooter>
        </Card>
    )
}
