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
import { Presupuesto } from "@/types"
const formSchema = z.object({
    id: z.number().optional(),
    disenoEstatus: z.string({ message: 'Requerido' }).min(2),
    disenoUbicacion: z.string({ message: 'Requerido' }).optional(2),
});
import { useEditPresupuestoMutation } from '@/hooks/presupuestos'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'  // Usage: App router
import { LoadingButton } from "@/components/ui/loading-button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'

import { PRESUPUESTO_DISEÑO_ESTADO } from '@/constants/presupuesto'
type MyFormProps = {
    data?: Presupuesto;
}
export default function MyForm({ data }: MyFormProps) {
    const { toast } = useToast()
    const router = useRouter()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            disenoEstatus: data?.disenoEstatus || "",
            disenoUbicacion: data?.disenoUbicacion || "",
        }
    })
    const { mutateAsync: edit, isPending: isPendingEdit } = useEditPresupuestoMutation()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            await edit({ id: values.id, data: values })
            toast({ description: 'Exito al realizar la operación', variant: 'default' })
            // router.back()

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
                    name="disenoEstatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(PRESUPUESTO_DISEÑO_ESTADO).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            <FormDescription>Estado del rental.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="disenoUbicacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ubicación</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""

                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Ruta del archivo dentro de los servidores de pintegralco</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <LoadingButton loading={isPendingEdit} type="submit">Guardar</LoadingButton>
                    {/* <Button type="button" onClick={() => router.back()} variant={"link"}>Volver</Button> */}

                </div>
            </form>
        </Form>
    )
}