"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { ALQUILER_FORMATO } from '@/constants/alquiler'
import { useCreateTrailerMutation, useEditTrailerMutation } from '@/hooks/trailer'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { LoadingButton } from "@/components/ui/loading-button"

const formSchema = z.object({
    id: z.number().optional(),
    codigo: z.string({ message: 'Codigo es requerido' }).min(1, { message: 'Codigo es requerido' }),
    proveedor: z.string({ message: 'Proveedor es requerido' }).min(1, { message: 'Proveedor es requerido' }),
    formato: z.string().optional(),
    alto: z.string().optional(),
    largo: z.string().optional(),
})

type TrailerFormProps = {
    data?: any
}

export default function TrailerForm({ data }: TrailerFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            codigo: data?.recurso?.codigo || "",
            proveedor: data?.recurso?.proveedor || "",
            formato: data?.formato || "",
            alto: data?.alto || "",
            largo: data?.largo || "",
        },
    })

    const { toast } = useToast()
    const router = useRouter()
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateTrailerMutation()
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditTrailerMutation()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (values.id) {
                await edit({ id: values.id, data: values })
            } else {
                await create(values)
            }
            toast({ description: 'Exito al realizar la operación', variant: 'default' })
            router.back()
        } catch (error) {
            console.error("Form submission error", error)
            toast({ description: 'Error al realizar la operación', variant: 'destructive' })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <FormField
                            control={form.control}
                            name="codigo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <FormField
                            control={form.control}
                            name="proveedor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proveedor</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <FormField
                            control={form.control}
                            name="formato"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Formato</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar Formato" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ALQUILER_FORMATO.map((e) => (
                                                <SelectItem key={e} value={e}>{e}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                        <FormField
                            control={form.control}
                            name="alto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alto</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                        <FormField
                            control={form.control}
                            name="largo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Largo</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <LoadingButton loading={isPendingCreate || isPendingEdit} type="submit">Guardar</LoadingButton>
                    <Button type="button" onClick={() => router.back()} variant="link">Volver</Button>
                </div>
            </form>
        </Form>
    )
}
