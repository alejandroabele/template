"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BancoSaldo, Banco } from "@/types";
import {
  useCreateBancoSaldoMutation,
  useEditBancoSaldoMutation,
} from "@/hooks/banco-saldo";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { InputMoney } from "@/components/input-money";
import { DatePicker } from "@/components/form-helpers/date-picker";

const formSchema = z.object({
  id: z.number().optional(),
  monto: z.string({ message: "Monto requerido" }).min(1, {
    message: "El monto es requerido",
  }),
  fecha: z.string({ message: "Fecha requerida" }).min(1, {
    message: "La fecha es requerida",
  }),
  bancoId: z.number({ message: "Banco requerido" }).min(1, {
    message: "Debe seleccionar un banco",
  }),
});

type BancoSaldoFormProps = {
  data?: BancoSaldo;
  onSuccess?: () => void;
  defaultBancoId?: number;
};

export default function BancoSaldoForm({
  data,
  onSuccess,
  defaultBancoId,
}: BancoSaldoFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      monto: data?.monto?.toString() || "",
      fecha: data?.fecha || "",
      bancoId: data?.bancoId || defaultBancoId || 0,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateBancoSaldoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditBancoSaldoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const saldoData = {
        ...values,
        monto: parseFloat(values.monto.replace(",", ".")),
      };

      if (data?.id) {
        await edit({ id: data.id, data: saldoData });
        toast({
          title: "Saldo actualizado",
          description: "El saldo del banco se ha actualizado correctamente.",
        });
      } else {
        await create(saldoData);
        toast({
          title: "Saldo creado",
          description: "El saldo del banco se ha creado correctamente.",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Ha ocurrido un error inesperado.",
        variant: "destructive",
      });
    }
  }

  const isPending = isPendingCreate || isPendingEdit;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto py-10"
      >
        {!defaultBancoId && (
          <FormField
            control={form.control}
            name="bancoId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Banco</FormLabel>
                <BancoSelector
                  value={data?.banco}
                  onChange={(banco: Banco) => field.onChange(banco.id)}
                />
                <FormDescription>
                  Seleccione el banco para el cual registrar el saldo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <InputMoney {...field} />
              </FormControl>
              <FormDescription>
                Monto del saldo en pesos argentinos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DatePicker
          label="Fecha del Saldo"
          form={form}
          name="fecha"
          fromYear={2020}
        />

        <div className="flex gap-2">
          <LoadingButton loading={isPending} type="submit">
            Guardar
          </LoadingButton>
          <Button type="button" onClick={() => router.back()} variant={"link"}>
            Volver
          </Button>
        </div>
      </form>
    </Form>
  );
}
