import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrency } from '@/utils/number'
import {
    FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type RentabilidadProps = {
    form: any
}

export const Rentabilidad = ({ form }: RentabilidadProps) => {
    const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad

    useEffect(() => {
        const contribucionMarginal = (form.watch("ventaTotal") || 0) - (form.watch("costoTotal") || 0);
        form.setValue("contribucionMarginal", contribucionMarginal);

        const margenTotal = (form.watch("contribucionMarginal") || 0) - (form.watch("costoAdminTotal") || 0);
        form.setValue("margenTotal", margenTotal);
    }, [form]);

    return (
        <Card>
            <CardHeader className="py-3 px-4 bg-muted/50">
                <div className='flex justify-between cursor-pointer' onClick={() => setIsVisible(!isVisible)}>
                    <h2 className="font-medium">Rentabilidad</h2>
                    <span className={`text-sm font-semibold text-right ${form.watch("margenTotal") < 0 ? 'text-red-500' : 'text-black'}`}
                    >
                        $ {formatCurrency(form.watch("margenTotal") || 0)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className={`${isVisible ? '' : 'hidden'} p-4 space-y-2`}>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Venta total de obra</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="ventaTotal"
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

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Costos totales</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="costoTotal"
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

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Contribución marginal</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="contribucionMarginal"
                                render={({ field }) => {
                                    const contribucionMarginal = (form.watch("ventaTotal") || 0) - (form.watch("costoTotal") || 0);
                                    React.useEffect(() => {
                                        form.setValue("contribucionMarginal", contribucionMarginal);
                                    }, [contribucionMarginal, form.setValue]);
                                    return (
                                        <Input
                                            className="w-full text-right bg-muted h-8"
                                            readOnly
                                            {...field}
                                            value={formatCurrency(contribucionMarginal)}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Costos administrativos totales</div>
                    <div className="col-span-1"></div>
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

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Margen total</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="margenTotal"
                                render={({ field }) => {
                                    const margenTotal = (form.watch("contribucionMarginal") || 0) - (form.watch("costoAdminTotal") || 0);
                                    React.useEffect(() => {
                                        form.setValue("margenTotal", margenTotal);
                                    }, [margenTotal, form.setValue]);
                                    return (
                                        <Input
                                            className={`w-full text-right bg-muted h-8 ${field.value < 0 ? 'text-red-600' : ''}`}
                                            readOnly
                                            {...field}
                                            value={formatCurrency(margenTotal)}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Total de impuestos</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="taxTotal"
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
    );
}
