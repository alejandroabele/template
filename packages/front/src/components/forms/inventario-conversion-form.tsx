"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight } from "lucide-react"
import type { InventarioConversion } from "@/types"

// Improved validation schema
const formSchema = z
    .object({
        id: z.number().optional(),
        cantidad: z
            .string()
            .min(1, "La cantidad es requerida")
            .refine((val) => {
                const num = Number.parseFloat(val.replace(",", "."))
                return !isNaN(num) && num > 0
            }, "Debe ser un número válido mayor a 0"),
        unidadOrigen: z.string().min(1, "La unidad de origen es requerida"),
        unidadDestino: z.string().min(1, "La unidad de destino es requerida"),
        descripcion: z.string().optional(),
        inventarioId: z.unknown(),
    })
    .refine((data) => data.unidadOrigen !== data.unidadDestino, {
        message: "Las unidades de origen y destino deben ser diferentes",
        path: ["unidadDestino"],
    })

import {
    useCreateInventarioConversionMutation,
    useEditInventarioConversionMutation,
} from "@/hooks/inventario-conversion"
import { useToast } from "@/hooks/use-toast"
import { LoadingButton } from "@/components/ui/loading-button"
import { UnidadMedidaSelector } from "../selectors/unidad-medida-selector"

// Mock type for demonstration - replace with your actual type
type UnidadMedidaType = string

type MyFormProps = {
    data?: InventarioConversion
    setOpen: (open: boolean) => void
}

export default function InventoryConversionForm({ data, setOpen }: MyFormProps) {
    const { toast } = useToast()
    const isEditing = !!data?.id

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            cantidad: data?.cantidad || "",
            unidadOrigen: data?.unidadOrigen || "",
            unidadDestino: data?.inventario?.unidadMedida || "",
            descripcion: data?.descripcion || "",
            inventarioId: data?.inventario?.id,
        },
    })

    const { mutateAsync: create, isPending: isPendingCreate } = useCreateInventarioConversionMutation()
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditInventarioConversionMutation()

    const isLoading = isPendingCreate || isPendingEdit

    // Calcular previsualización de conversiones
    const cantidad = form.watch("cantidad")
    const unidadOrigen = form.watch("unidadOrigen")
    const unidadDestino = form.watch("unidadDestino")

    const cantidadNum = Number.parseFloat(cantidad?.replace(",", ".") || "0")

    // Función para formatear números: enteros sin decimales, decimales solo si es necesario
    const formatNumber = (num: number): string => {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        // Eliminar ceros innecesarios al final
        return parseFloat(num.toFixed(4)).toString();
    }

    const conversionInversa = cantidadNum > 0 ? formatNumber(1 / cantidadNum) : "0"

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (values.id) {
                await edit({ id: values.id, data: values })
            } else {
                await create(values)
            }

            toast({
                description: isEditing ? "Conversión actualizada exitosamente" : "Conversión creada exitosamente",
                variant: "default",
            })

            setOpen(false)
        } catch (error) {
            console.error("Form submission error", error)
            toast({
                description: "Error al procesar la conversión. Intente nuevamente.",
                variant: "destructive",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Descripción de la presentación */}
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción de la presentación</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ej: Caja de 12 unidades, Bolsa de 5kg, etc."
                                />
                            </FormControl>
                            <FormDescription>
                                Rotula la presentación o empaque de esta conversión
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Separator />

                {/* Conversion Setup Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="unidadOrigen"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidad de origen</FormLabel>
                                        <UnidadMedidaSelector value={field.value as UnidadMedidaType} onChange={field.onChange} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Quantity Section */}
                <FormField
                    control={form.control}
                    name="cantidad"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Factor de Conversión</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ej: 1.5, 2.25, 0.5"
                                    onInput={(e) => {
                                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                                    }}
                                    className="pr-12"
                                />
                            </FormControl>
                            <FormDescription>
                                Cantidad por la cual multiplicar para convertir de la unidad origen a la destino ({unidadDestino})
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Previsualización de conversiones */}
                {cantidadNum > 0 && unidadOrigen && unidadDestino && unidadOrigen !== unidadDestino && (
                    <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Previsualización</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">1 {unidadDestino}</span>
                                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                                <span className="font-medium">{cantidad} {unidadOrigen}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">1 {unidadOrigen}</span>
                                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                                <span className="font-medium text-muted-foreground">{conversionInversa} {unidadDestino}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <LoadingButton loading={isLoading} type="button" onClick={() => onSubmit(form.getValues())} className="w-full sm:w-auto">
                        Guardar
                    </LoadingButton>
                </div>
            </form>
        </Form>
    )
}
