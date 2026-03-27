import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MonedaSelector } from '@/components/selectors/moneda-selector'

type DescripcionProps = {
    form: any
}

export const Descripcion = ({ form }: DescripcionProps) => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <Card className=''>
            <CardHeader className="py-3 px-4 bg-muted/50">
                <div className='flex justify-between cursor-pointer' onClick={() => setIsVisible(!isVisible)}>
                    <h2 className="font-medium ">Descripción</h2>
                </div>
            </CardHeader>
            <CardContent className={`${isVisible ? '' : 'hidden'} p-4 space-y-2`}>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Los valores expresados:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="condicionIva"
                                render={({ field }) => (
                                    <Input
                                        placeholder=""
                                        className={`w-full  h-8`}
                                        type="text"
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Condición de pago:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="condicionPago"
                                render={({ field }) => (
                                    <Input
                                        placeholder=""
                                        className={`w-full  h-8`}
                                        type="text"
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Tiempo de entrega::</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="tiempoEntrega"
                                render={({ field }) => (
                                    <Input
                                        placeholder=""
                                        className={`w-full  h-8`}
                                        type="text"
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Lugar de entrega:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="lugarEntrega"
                                render={({ field }) => (
                                    <Input
                                        placeholder=""
                                        className={`w-full  h-8`}
                                        type="text"
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Mantenimiento de oferta:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="mantOferta"
                                render={({ field }) => (
                                    <Input
                                        placeholder=""
                                        className={`w-full  h-8`}
                                        type="text"
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Moneda:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="moneda"
                                render={({ field }) => (
                                    <MonedaSelector value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">Descripción general:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                        <div className="flex justify-end">
                            <FormField
                                control={form.control}
                                name="descripcionGlobal"
                                render={({ field }) => (
                                    <Textarea
                                        placeholder=""
                                        className={`w-full`}
                                        {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>



            </CardContent>
        </Card>
    )
}
