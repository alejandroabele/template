"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputNumber } from "@/components/ui/input-number";
import { Textarea } from "@/components/ui/textarea";
import { useMovimientoHerramienta } from "@/hooks/herramienta";
import { PersonaSelector } from "@/components/selectors/persona-selector";
import type { Dispatch, SetStateAction } from "react";

const schema = z.object({
    cantidad: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
    observaciones: z.string().optional(),
});

type Props = {
    herramienta: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    personaId?: number;
    personaNombre?: string;
    cantidadMaxima?: number;
};

export function HerramientaDevolucionForm({ herramienta, setOpen, personaId: personaIdProp, personaNombre, cantidadMaxima }: Props) {
    const { mutate, isPending } = useMovimientoHerramienta();
    const [personaId, setPersonaId] = useState<number | undefined>(personaIdProp);
    const [personaError, setPersonaError] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { cantidad: cantidadMaxima ?? 1 },
    });

    const onSubmit = (values: z.infer<typeof schema>) => {
        if (!personaId) {
            setPersonaError(true);
            return;
        }
        if (cantidadMaxima && values.cantidad > cantidadMaxima) return;
        mutate(
            { id: herramienta.id, data: { tipo: 'DEVOLUCION', ...values, personaId } },
            { onSuccess: () => setOpen(false) }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <FormLabel>Persona que devuelve</FormLabel>
                    {personaIdProp ? (
                        <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm">
                            {personaNombre}
                        </div>
                    ) : (
                        <PersonaSelector
                            value={personaId}
                            onValueChange={(v) => { setPersonaId(v); setPersonaError(false); }}
                            placeholder="Seleccionar persona..."
                        />
                    )}
                    {personaError && (
                        <p className="text-sm font-medium text-destructive">Seleccione una persona</p>
                    )}
                </div>
                <FormField
                    control={form.control}
                    name="cantidad"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Cantidad
                                {cantidadMaxima && (
                                    <span className="ml-1 text-muted-foreground font-normal">(máx. {cantidadMaxima})</span>
                                )}
                            </FormLabel>
                            <FormControl>
                                <InputNumber min={1} max={cantidadMaxima} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observaciones</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Registrando..." : "Registrar devolución"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
