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
import { InputMoney } from "@/components/input-money"
import { AlquilerMantenimiento } from "@/types"
import { format } from 'date-fns';
import { ArchivosInput } from "@/components/form-helpers/archivos-input"
import { useCreateAlquilerMantenimientoMutation, useEditAlquilerMantenimientoMutation } from '@/hooks/alquiler-mantenimiento'
import { useToast } from "@/hooks/use-toast"
import { DatePicker } from "@/components/form-helpers/date-picker"
import React from "react"
import { useFileUploadHandler } from '@/hooks/file-upload'
import { Textarea } from "@/components/ui/textarea"
import ImagenesInput from "../form-helpers/imagenes-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { Dispatch, SetStateAction } from 'react';



const formSchema = z.object({
    id: z.number().optional(),
    fecha: z.unknown({ message: 'Requerido' }),
    costo: z.unknown({ message: 'Precio requerido' }),
    detalle: z.string({ message: 'Requerido' }),
    alquilerRecursoId: z.unknown().optional()

});

type MyFormProps = {
    data?: AlquilerMantenimiento;
    setOpen: Dispatch<SetStateAction<boolean>>;

}
export default function MyForm({ data, setOpen }: MyFormProps) {
    const { toast } = useToast()
    const [checklist, setChecklist] = React.useState<File[]>([]);
    const [imagenes, setImagenes] = React.useState<File[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            fecha: data?.fecha || format(new Date(), 'yyyy-MM-dd'), // Primer día del mes en formato 'yyyy-MM-dd'
            costo: data?.costo || 0,
            detalle: data?.detalle || "",
            alquilerRecursoId: data?.alquilerRecursoId || null
        }
    })
    const { mutateAsync: create, isPendingCreate } = useCreateAlquilerMantenimientoMutation()
    const { mutateAsync: edit, isPendingEdit } = useEditAlquilerMantenimientoMutation()
    const { handleFileUpload, handleMultipleFileUpload } = useFileUploadHandler();
    const uploadFiles = async (
        id: number,
    ) => {

        await handleFileUpload({
            fileId: data?.checklistArchivo?.id,
            fileArray: checklist,
            modelo: 'alquiler_mantenimiento',
            modeloId: id,
            tipo: 'checklist',
        });

        await handleMultipleFileUpload({
            data: data,
            fileArray: imagenes,
            modelo: 'alquiler_mantenimiento',
            modeloId: id,
            tipo: 'adjuntos'
        })


    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let response
        try {
            if (values.id) {
                await edit({ id: values.id, data: values })
                await uploadFiles(values.id)


            }
            else {

                response = await create(values)
                if (response.id) {
                    form.setValue('id', response.id)
                    await uploadFiles(response.id)

                }
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
                        label="Fecha de mantenimiento"
                        form={form}
                        name="fecha"
                        fromYear={2020}
                    />
                </div>

                <div className="col-span-12 md:col-span-3">

                    <FormField
                        control={form.control}
                        name="costo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Costo</FormLabel>
                                <FormControl>
                                    <InputMoney {...field} />
                                </FormControl>
                                <FormDescription>Costo del mantenimiento $</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <ArchivosInput label="Checklist" value={checklist} setValue={setChecklist} defaultValue={data?.checklistArchivo} />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <ImagenesInput label="Checklist" value={imagenes} setValue={setImagenes} defaultValue={data?.adjuntos} />
                </div>
                <div className="col-span-12 md:col-span-3">

                    <FormField
                        control={form.control}
                        name="detalle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detalle</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Podes usar este espacio para almacenar informacion adicional del servicio
                                </FormDescription>
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