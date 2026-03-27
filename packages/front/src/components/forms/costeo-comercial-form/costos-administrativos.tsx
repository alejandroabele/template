import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrency } from '@/utils/number'
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type CostosAdministrativosProps = {
    form: any
}

export const CostosAdministrativos = ({ form }: CostosAdministrativosProps) => {
    const [isVisible, setIsVisible] = useState(true)

    const updateCostos = () => {
        const venta = form.getValues("ventaTotal") || 0
        const estructura = (venta * (form.getValues("estructuraComision") || 0)) / 100
        const vendedor = (venta * (form.getValues("vendedorComision") || 0)) / 100
        const director = (venta * (form.getValues("directorComision") || 0)) / 100
        const total = estructura + vendedor + director
        form.setValue("estructuraCosto", estructura)
        form.setValue("vendedorCosto", vendedor)
        form.setValue("directorCosto", director)
        form.setValue("costoAdminTotal", total)
    }

    useEffect(() => {
        const sub = form.watch((_, { name }) => {
            if (
                name === "ventaTotal" ||
                name === "estructuraComision" ||
                name === "vendedorComision" ||
                name === "directorComision"
            ) updateCostos()
        })
        return () => sub.unsubscribe()
    }, [form])

    const renderLinea = (label: string, comisionName: string, costoName: string) => (
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">{label}</div>
            <div className="col-span-1">
                <div className="flex justify-end">
                    <FormField
                        control={form.control}
                        name={comisionName}
                        render={({ field }) => (
                            <Input
                                onInput={(e) => {
                                    const clean = e.currentTarget.value.replace(/[^0-9.]/g, "")
                                    e.currentTarget.value = clean
                                }}
                                className="h-8 text-right"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e)
                                    updateCostos()
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex justify-end">
                    <FormField
                        control={form.control}
                        name={costoName}
                        render={({ field }) => (
                            <Input
                                className="w-full text-right bg-muted h-8"
                                readOnly
                                {...field}
                                value={formatCurrency(field.value || 0)}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <Card>
            <CardHeader className="py-3 px-4 bg-muted/50">
                <div className="flex justify-between cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
                    <h2 className="font-medium">Costos Administrativos</h2>
                    <span className="text-sm font-semibold text-right">
                        $ {formatCurrency(form.watch("costoAdminTotal") || 0)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className={`${isVisible ? '' : 'hidden'} p-4 space-y-2`}>
                {renderLinea("Costos de estructura", "estructuraComision", "estructuraCosto")}
                {renderLinea("Comisión vendedor", "vendedorComision", "vendedorCosto")}
                {renderLinea("Otras comisiones", "directorComision", "directorCosto")}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t mt-2">
                    <div className="col-span-1 font-medium">Total costos administrativos</div>
                    <div className="flex justify-end"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="costoAdminTotal"
                                render={({ field }) => (
                                    <Input
                                        className="w-full text-right bg-muted h-8"
                                        readOnly
                                        {...field}
                                        value={formatCurrency(field.value || 0)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
