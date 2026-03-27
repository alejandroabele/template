import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from '@/utils/number'
import {
    FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type SubtotalProps = {
    form: any
}

export const Subtotal = ({ form }: SubtotalProps) => {
    // Estado para controlar la visibilidad
    const [isVisible, setIsVisible] = useState(true);

    return (
        <Card>
            <CardHeader className="py-3 px-4 bg-muted/50">
                <div className='flex justify-between cursor-pointer' onClick={() => setIsVisible(!isVisible)}>
                    <h2 className="font-medium ">Subtotal</h2>
                    <span
                        className={`text-sm font-semibold text-right ${form.watch("bab") < 0 ? 'text-red-500' : 'text-black'}`}
                    >
                        $ {formatCurrency(form.watch("bab") || 0)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className={`${isVisible ? '' : 'hidden'} p-4 space-y-2`}>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Rentabilidad estimada</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="bab"
                                render={({ field }) => {
                                    const bab = (form.watch("margenTotal") || 0) - (form.watch("taxTotal") || 0);
                                    React.useEffect(() => {
                                        form.setValue("bab", bab);
                                    }, [bab, form.setValue]);

                                    return (
                                        <Input
                                            className={`w-full text-right bg-muted h-8 ${field.value < 0 ? 'text-red-600' : ''}`}
                                            readOnly
                                            {...field}
                                            value={formatCurrency(bab)}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">%</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <Input
                                className={`w-full text-right bg-muted h-8 font-bold ${((form.watch("bab") || 0) / (form.watch("ventaTotal") || 0) * 100) < 20 ? "text-red-500" : ""}`}
                                readOnly
                                value={formatCurrency((form.watch("bab") || 0) / (form.watch("ventaTotal") || 0) * 100)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
