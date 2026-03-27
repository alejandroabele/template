"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CashflowSimulacion } from "@/types";
import { useCreateSimulacion, useEditSimulacion } from "@/hooks/cashflow-simulacion";

const schema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    descripcion: z.string().optional(),
    tipo: z.enum(["desde_cero", "desde_actual"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    simulacion?: CashflowSimulacion;
}

export default function CashflowSimulacionDialog({ open, onOpenChange, simulacion }: Props) {
    const esEdicion = !!simulacion?.id;
    const createMutation = useCreateSimulacion();
    const editMutation = useEditSimulacion();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombre: "",
            descripcion: "",
            tipo: "desde_actual",
        },
    });

    useEffect(() => {
        if (simulacion) {
            form.reset({
                nombre: simulacion.nombre,
                descripcion: simulacion.descripcion ?? "",
                tipo: simulacion.tipo,
            });
        } else {
            form.reset({ nombre: "", descripcion: "", tipo: "desde_actual" });
        }
    }, [simulacion, open]);

    const onSubmit = async (values: FormValues) => {
        if (esEdicion) {
            await editMutation.mutateAsync({ id: simulacion!.id!, data: values });
        } else {
            await createMutation.mutateAsync(values);
        }
        onOpenChange(false);
    };

    const isPending = createMutation.isPending || editMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{esEdicion ? "Editar simulación" : "Nueva simulación"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Escenario pesimista" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción (opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Notas sobre esta simulación..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!esEdicion && (
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Punto de partida</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="space-y-2 mt-1"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <RadioGroupItem value="desde_actual" id="desde_actual" className="mt-0.5" />
                                                    <Label htmlFor="desde_actual" className="cursor-pointer">
                                                        <span className="font-medium">Desde estado actual</span>
                                                        <p className="text-sm text-muted-foreground">Copia todas las transacciones reales actuales</p>
                                                    </Label>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <RadioGroupItem value="desde_cero" id="desde_cero" className="mt-0.5" />
                                                    <Label htmlFor="desde_cero" className="cursor-pointer">
                                                        <span className="font-medium">Desde cero</span>
                                                        <p className="text-sm text-muted-foreground">Comienza sin transacciones</p>
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Guardando..." : esEdicion ? "Guardar" : "Crear simulación"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
