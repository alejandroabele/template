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
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import { Indice } from "@/types"
const formSchema = z.object({
    id: z.number().optional(),
    nombre: z.string({ message: 'Requerido' }).min(2),
    notas: z.string().optional(),
    porcentaje: z.coerce.number({ message: 'Requerido' }).min(0.01, { message: "Debe ser mayor a 0" }),
});
import { useCreateIndiceMutation, useEditIndiceMutation } from '@/hooks/indice'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'  // Usage: App router
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button"

type MyFormProps = {
    data?: Indice;
}
export default function MyForm({ data }: MyFormProps) {
    const { toast } = useToast()
    const router = useRouter()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            nombre: data?.nombre || "",
            notas: data?.notas || "",
            porcentaje: data?.porcentaje || 0,
        }
    })
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateIndiceMutation()
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditIndiceMutation()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (values.id) {
                await edit({ id: values.id, data: values })
            }
            else {
                await create(values)
            }
            toast({ description: 'Exito al realizar la operación', variant: 'default' })
            router.back()

        } catch (error) {
            console.error("Form submission error", error);
            toast({ description: 'Error al realizar la operación', variant: 'destructive' })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  mx-auto py-10">
                <div className="col-span-12 md:col-span-6">

                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="IPC"

                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Este es el nombre del indice</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">

                    <FormField
                        control={form.control}
                        name="porcentaje"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Porcentaje</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="%1.00"
                                        onInput={(e) => {
                                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                                        }}
                                        {...field} />
                                </FormControl>
                                <FormDescription>Ingrese el porcentaje</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12">
                    <FormField
                        control={form.control}
                        name="notas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notas</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Podes usar este espacio para almacenar informacion adicional sobre el indice
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <div className="flex gap-2">
                    <LoadingButton loading={isPendingCreate
                        || isPendingEdit} type="submit">Guardar</LoadingButton>
                    <Button type="button" onClick={() => router.back()} variant={"link"}>Volver</Button>

                </div>
            </form>
        </Form >
    )
}