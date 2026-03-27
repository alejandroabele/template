"use client";

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
import { HerramientaSelector } from "@/components/selectors/herramienta-selector";
import type { Dispatch, SetStateAction } from "react";

type FormValues = {
  herramientaId?: number;
  personaId: number;
  cantidad: number;
  observaciones?: string;
};

type Props = {
  herramienta?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function HerramientaPrestamoForm({ herramienta, setOpen }: Props) {
  const { mutate, isPending } = useMovimientoHerramienta();

  const disponible = herramienta
    ? Math.max(0, Number(herramienta.stock ?? 0) - Number(herramienta.prestadas ?? 0))
    : undefined;

  const schema = z.object({
    herramientaId: z.number().optional(),
    personaId: z.number({ required_error: "Seleccione una persona" }),
    cantidad: z.coerce
      .number()
      .positive("La cantidad debe ser mayor a 0")
      .refine(
        (val) => disponible === undefined || val <= disponible,
        { message: `Stock insuficiente. Disponibles: ${disponible}` }
      ),
    observaciones: z.string().optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      herramientaId: herramienta?.id,
      cantidad: 1,
    },
  });

  const onSubmit = (values: FormValues) => {
    const id = herramienta?.id ?? values.herramientaId;
    mutate(
      { id, data: { tipo: 'PRESTAMO', ...values } },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!herramienta && (
          <FormField
            control={form.control}
            name="herramientaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Herramienta</FormLabel>
                <FormControl>
                  <HerramientaSelector
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="personaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona</FormLabel>
              <PersonaSelector
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cantidad"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Cantidad</FormLabel>
                {disponible !== undefined && (
                  <span className={`text-xs font-medium ${disponible <= 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {disponible <= 0 ? "Sin stock disponible" : `Disponibles: ${disponible}`}
                  </span>
                )}
              </div>
              <FormControl>
                <InputNumber min={1} max={disponible ?? undefined} {...field} />
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
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || disponible === 0}>
            {isPending ? "Prestando..." : "Prestar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
