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
import { Comision } from "@/types"
const formSchema = z.object({
    id: z.number().optional(),
    de: z.string({ message: 'Requerido' }).min(2),
    hasta: z.string({ message: 'Requerido' }).min(2),
    comision: z.string({ message: 'Requerido' }).min(2),
});
import { useCreateComisionMutation, useEditComisionMutation } from '@/hooks/comisiones'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'  // Usage: App router
import { LoadingButton } from "@/components/ui/loading-button"

type MyFormProps = {
    data?: Comision;
}
export default function MyForm({ data }: MyFormProps) {
    const { toast } = useToast()
    const router = useRouter()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            de: data?.de || "",
            hasta: data?.hasta || "",
            comision: data?.comision || "",
        }
    })
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateComisionMutation()
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditComisionMutation()

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
                <FormField
                    control={form.control}
                    name="de"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>De</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    type="number"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Desde donde empieza a calcular la comision</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="hasta"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hasta</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    type="number"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Hasta donde calcula la comision</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comision"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comisión</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    type="number"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Porcentaje comision</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <LoadingButton loading={isPendingCreate
                        || isPendingEdit} type="submit">Guardar</LoadingButton>
                    <Button type="button" onClick={() => router.back()} variant={"link"}>Volver</Button>

                </div>
            </form>
        </Form>
    )
}