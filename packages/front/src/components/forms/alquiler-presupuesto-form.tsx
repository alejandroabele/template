"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { format } from 'date-fns'
import { useCreatePresupuestoMutation } from '@/hooks/presupuestos'
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { useFileUploadHandler } from '@/hooks/file-upload'
import { LoadingButton } from "@/components/ui/loading-button"
import { PROCESO_GENERAL, AREAS } from "@/constants/presupuesto"
import { ArchivosInput } from "@/components/form-helpers/archivos-input"
import { Textarea } from "@/components/ui/textarea"
import { Alquiler } from "@/types"
import ImagenesInput from "../form-helpers/imagenes-input"
import { useStore as useGlobalStore } from "@/lib/store"
import { useCreateMensajeMutation, } from "@/hooks/mensaje"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { CLIENTES, COMPRADORES } from "@/constants/globales"

const formSchema = z.object({
    fecha: z.unknown({ message: 'Requerido' }),
    alquilerRecursoId: z.unknown().optional(),
    procesoGeneralId: z.unknown().optional(),
    clienteId: z.number().min(1, "Cliente requerido"),
    comprador: z.string({ message: 'Descripcion  requerido' }).optional(),
    descripcionCorta: z.string({ message: 'Descripcion  requerido' }).optional(),
    produccionEstatus: z.string({ message: 'Descripcion  requerido' }).optional(),
    vendedorId: z.unknown({ message: 'Vendedor requerido' }),
    items: z.array(z.object({
        descripcion: z.string().min(1, "Descripción requerida"),
        cantidad: z.number().min(1, "Cantidad debe ser mayor a 0"),
        archivos: z.array(z.any()).optional(),
        detalles: z.string().optional(),
        observaciones: z.string().optional(),

    })).min(1, "Debe haber al menos un ítem"),
    esParaCliente: z.enum(["cliente", "propio"], {
        required_error: "Seleccioná una opción"
    }),
});

type MyFormProps = {
    data: Alquiler
    setOpen: (open: boolean) => void;
};

export default function MyForm({ data, setOpen }: MyFormProps) {
    const { toast } = useToast()
    const [items, setItems] = React.useState([
        {
            descripcion: `MANTENIMIENTO DE ${data.alquilerRecurso.tipo} - ${data.alquilerRecurso.codigo}`,
            cantidad: 1,
            archivos: [],
            detalles: '',
            observaciones: ''
        }
    ]);
    const [checklist, setChecklist] = React.useState<File[]>([]);
    const [imagenes, setImagenes] = React.useState<File[]>([]);
    const user = useGlobalStore((state) => state.user)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fecha: format(new Date(), 'yyyy-MM-dd'),
            procesoGeneralId: PROCESO_GENERAL.COSTEO_TECNICO,
            clienteId: data?.cliente?.id || 0,
            comprador: data.cliente?.contacto,
            alquilerRecursoId: data?.alquilerRecursoId,
            items: items,
            descripcionCorta: `MANTENIMIENTO DE ${data.alquilerRecurso.tipo} - ${data.alquilerRecurso.codigo}`,
            esParaCliente: "cliente",
            produccionEstatus: 'pendiente'
        }
    });

    const { mutateAsync: create, isPending } = useCreatePresupuestoMutation()
    const { handleFileUpload } = useFileUploadHandler();
    const { mutateAsync: createMensaje } = useCreateMensajeMutation()


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let clienteId
            let comprador
            if (values.esParaCliente === "cliente") {
                // lógica para presupuesto al cliente
                clienteId = data.clienteId
                comprador = data.cliente.contacto
            } else {
                clienteId = CLIENTES.PINTEGRALCO
                comprador = COMPRADORES.PINTEGRALCO
            }
            const payload = {
                ...values,
                areaId: data.alquilerRecurso.tipo === 'CARTELES' ? AREAS.MANTENIMIENTO_DE_CARTELES : AREAS.MANTENIMIENTO_DE_TRAILER, // Valor fijo oculto
                vendedorId: user?.userId,
                clienteId,
                comprador,
                items: values.items.map(item => ({
                    ...item,
                    archivos: undefined,
                })),
            };

            const response = await create(payload);

            if (response.id && checklist?.length && checklist[0].name) {

                await handleFileUpload({
                    fileArray: checklist,
                    modelo: 'presupuesto_item',
                    modeloId: response.items[0].id,
                    tipo: 'checklist',
                });

            }
            if (imagenes.length > 0) {
                for (const imagen of imagenes) {
                    const mensaje = await createMensaje({
                        tipoId: response.id,
                        tipo: 'presupuesto',
                        mensaje: `Imagen de mantenimiento generada automaticamente`,
                        usuarioOrigenId: user?.userId ?? 0,
                        usuarioOrigenNombre: user?.nombre,
                        fecha: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    });

                    await handleFileUpload({
                        fileArray: [imagen],
                        modelo: "mensaje",
                        modeloId: mensaje.id,
                        tipo: "adjunto",
                    });
                }
            }

            toast({ description: 'Presupuesto creado con éxito', variant: 'default' });
            setOpen(false);
        } catch (error) {
            console.error("Error al crear presupuesto:", error);
            toast({ description: 'Error al crear el presupuesto', variant: 'destructive' });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">


                <div className="col-span-12 md:col-span-6">
                    <ArchivosInput label="Checklist" value={checklist} setValue={setChecklist} />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <ImagenesInput label="Imagenes" value={imagenes} setValue={setImagenes} />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <FormField
                        control={form.control}
                        name="esParaCliente"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>¿A quién va dirigido el presupuesto?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex gap-4"
                                    >
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <RadioGroupItem value="cliente" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Cliente</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <RadioGroupItem value="propio" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Asumido por nosotros</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-3">
                    <FormField
                        control={form.control}
                        name="items.0.detalles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detalles</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Se ve en el presupuesto"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="col-span-12 md:col-span-3">
                    <FormField
                        control={form.control}
                        name="items.0.observaciones"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="No se ven en el presupuesto"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-2">
                    <LoadingButton loading={isPending} type="submit">
                        Guardar
                    </LoadingButton>
                    <Button type="button" onClick={() => setOpen(false)} variant="link">
                        Volver
                    </Button>
                </div>
            </form>
        </Form>
    );
}