"use client"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"

import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
    FormDescription
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { InputMoney } from '@/components/input-money'
import { AlquilerPrecio } from "@/types"
const formSchema = z.object({
    id: z.number().optional(),
    fechaDesde: z.unknown({ message: 'Requerido' }),
    fechaFin: z.unknown({ message: 'Requerido' }),
    clienteId: z.unknown({ message: 'Precio requerido' }),
    precio: z.unknown({ message: 'Precio requerido' }),
    localidad: z.string({ message: 'localidad requerido' }),
    zona: z.string({ message: 'zona requerido' }),

});
import { useCreateAlquilerPrecioMutation, useEditAlquilerPrecioMutation } from '@/hooks/alquiler-precio'
import { useToast } from "@/hooks/use-toast"
import { ClienteSelector } from "@/components/selectors/cliente-selector"
import { DatePicker } from "@/components/form-helpers/date-picker"
import { LoadingButton } from "@/components/ui/loading-button"
import { Dispatch, SetStateAction } from 'react';

type MyFormProps = {
    data?: AlquilerPrecio;
    setOpen: Dispatch<SetStateAction<boolean>>;

}
export default function MyForm({ data, setOpen }: MyFormProps) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            clienteId: data?.clienteId || null,
            fechaDesde: data?.fechaDesde || null,
            fechaFin: data?.fechaFin || null,
            localidad: data?.localidad || "",
            zona: data?.zona || "",
            precio: data?.precio || 0,

        }
    })
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateAlquilerPrecioMutation()
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditAlquilerPrecioMutation()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (values.id) {
                await edit({ id: values.id, data: values })
            }
            else {
                await create(values)

            }
            toast({ description: 'Exito al realizar la operación', variant: 'default' })

        } catch (error) {
            console.error("Form submission error", error);
            toast({ description: 'Error al realizar la operación', variant: 'destructive' })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  mx-auto py-10">
                <div className="col-span-12 md:col-span-3">

                    <DatePicker
                        label="Fecha inicio del precio"
                        form={form}
                        name="fechaDesde"
                        fromYear={2020}
                    />
                </div>
                <div className="col-span-12 md:col-span-3">

                    <DatePicker
                        label="Fecha fin del precio"
                        form={form}
                        name="fechaFin"
                        disabled={data?.fechaFin === null}
                        fromYear={2025}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">

                    <FormField
                        control={form.control}
                        name="clienteId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="pb-2">Cliente</FormLabel>
                                <ClienteSelector value={data?.cliente} onChange={(v) => form.setValue('clienteId', v.id)} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">

                    <FormField
                        control={form.control}
                        name="localidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localidad</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Este es el nombre del area</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <FormField
                        control={form.control}
                        name="zona"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Zona</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""

                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Este es el nombre del area</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-3">

                    <FormField
                        control={form.control}
                        name="precio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <InputMoney
                                        disabled={data?.fechaFin === null}

                                        {...field} />

                                </FormControl>
                                <FormDescription>Precio de alquiler mensual $</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <LoadingButton loading={isPendingCreate || isPendingEdit} type="submit">Guardar</LoadingButton>
                    <Button type="button" onClick={() => setOpen(false)} variant={"link"}>Volver</Button>

                </div>
            </form>
        </Form>
    )
}