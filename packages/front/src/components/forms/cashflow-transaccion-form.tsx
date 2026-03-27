"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateCashflowTransaccionMutation,
  useEditCashflowTransaccionMutation,
  useDeleteCashflowTransaccionMutation,
  useConciliarCashflowMutation,
} from "@/hooks/cashflow-transaccion";
import {
  useCreateTransaccionSimulacion,
  useEditTransaccionSimulacion,
  useRemoveTransaccionSimulacion,
} from "@/hooks/cashflow-simulacion";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { Banco, CashflowCategoria, CashflowTransaccion } from "@/types";
import { InputMoney } from "@/components/input-money";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { today } from "@/utils/date";
import { CashflowCategoriaSelector } from "@/components/selectors/cashflow-categoria-selector";
import { BancoSelector } from "@/components/selectors/banco-selector";
import { addMonths, format, parseISO } from "date-fns";
import { useState } from "react";
import { InputNumber } from "@/components/ui/input-number";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const formSchema = z.object({
  id: z.number().optional(),
  fecha: z.string().min(1, "La fecha es requerida"),
  monto: z.string().min(1, "El monto es requerido"),
  descripcion: z.string().optional(),
  categoriaId: z.coerce.number().min(1, "La categoría es requerida"),
  bancoId: z.unknown().optional(),
});

interface CashflowTransaccionFormProps {
  data?: CashflowTransaccion | null;
  categoria?: CashflowCategoria | null;
  fecha?: string;
  setOpen: (open: boolean) => void;
  simulacionId?: number;
}

export default function CashflowTransaccionForm({
  data,
  categoria,
  fecha,
  setOpen,
  simulacionId,
}: CashflowTransaccionFormProps) {
  const { toast } = useToast();
  const [cuotasHabilitado, setCuotasHabilitado] = useState(false);
  const [cantidadCuotas, setCantidadCuotas] = useState("2");
  const [conciliarConfirmOpen, setConciliarConfirmOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      categoriaId: data?.categoriaId || categoria?.id || 0,
      fecha: data?.fecha || fecha || today(),
      monto: data?.monto || "",
      descripcion: data?.descripcion || "",
      bancoId: data?.bancoId,
    },
  });

  // Hooks reales
  const { mutateAsync: createReal, isPending: isCreatingReal } =
    useCreateCashflowTransaccionMutation();
  const { mutateAsync: editReal, isPending: isEditingReal } =
    useEditCashflowTransaccionMutation();
  const { mutateAsync: deleteReal, isPending: isDeletingReal } =
    useDeleteCashflowTransaccionMutation();

  // Hooks de simulación (siempre se llaman para respetar las reglas de hooks)
  const { mutateAsync: createSim, isPending: isCreatingSim } =
    useCreateTransaccionSimulacion(simulacionId ?? 0);
  const { mutateAsync: editSim, isPending: isEditingSim } =
    useEditTransaccionSimulacion(simulacionId ?? 0);
  const { mutateAsync: deleteSim, isPending: isDeletingSim } =
    useRemoveTransaccionSimulacion(simulacionId ?? 0);

  // Selección según modo
  const createTransaccion = simulacionId ? createSim : createReal;
  const editTransaccion = simulacionId ? editSim : editReal;
  const deleteTransaccion = simulacionId ? deleteSim : deleteReal;
  const isCreating = simulacionId ? isCreatingSim : isCreatingReal;
  const isEditing = simulacionId ? isEditingSim : isEditingReal;
  const isDeleting = simulacionId ? isDeletingSim : isDeletingReal;

  const { mutateAsync: conciliarTransaccion, isPending: isConciliando } =
    useConciliarCashflowMutation();

  const handleConciliar = async () => {
    if (!data?.id) return;
    try {
      await conciliarTransaccion(data.id);
      toast({
        title: "Conciliada",
        description: "La transacción se concilió correctamente con el banco",
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al conciliar la transacción",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.id) {
        await editTransaccion({ id: values.id, data: values });
        toast({
          title: "Actualizada",
          description: "La transacción se actualizó correctamente",
        });
      } else if (!simulacionId && cuotasHabilitado && Number(cantidadCuotas) > 1) {
        const fechaBase = parseISO(values.fecha);
        for (let i = 0; i < Number(cantidadCuotas); i++) {
          const fechaCuota = format(addMonths(fechaBase, i), "yyyy-MM-dd");
          await createTransaccion({
            ...values,
            fecha: fechaCuota,
            descripcion: values.descripcion
              ? `${values.descripcion} (Cuota ${i + 1}/${cantidadCuotas})`
              : `Cuota ${i + 1}/${cantidadCuotas}`,
          });
        }
        toast({
          title: "Creadas",
          description: `Se crearon ${cantidadCuotas} transacciones por cuotas correctamente`,
        });
      } else {
        await createTransaccion(values);
        toast({
          title: "Creada",
          description: "La transacción se creó correctamente",
        });
      }
      //TODO: refactor para no recargar la pagina
      window.location.reload();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al procesar la transacción",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!data?.id) return;
    try {
      await deleteTransaccion(data.id);
      toast({
        title: "Eliminada",
        description: "La transacción se eliminó correctamente",
      });
      setOpen(false);
      //TODO: refactor para no recargar la pagina
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la transacción",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="monto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto *</FormLabel>
                <InputMoney {...field} placeholder="0.00" />
                <FormMessage />
              </FormItem>
            )}
          />
          <DatePicker label="Fecha" form={form} name="fecha" fromYear={2025} />

          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <CashflowCategoriaSelector
                  value={field.value?.toString() || ""}
                  onChange={(value) => field.onChange(parseInt(value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bancoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banco</FormLabel>
                <BancoSelector
                  value={data?.banco}
                  onChange={(banco: Banco) =>
                    field.onChange(banco.id || undefined)
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  placeholder="Descripción detallada..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {!data && !simulacionId && (
            <div className="flex flex-row items-center space-x-3 rounded-md border p-3">
              <FormControl>
                <Checkbox
                  checked={cuotasHabilitado}
                  onCheckedChange={setCuotasHabilitado}
                />
              </FormControl>
              <span className="text-sm text-muted-foreground">
                Crear por cuotas mensuales
              </span>
              {cuotasHabilitado && (
                <>
                  <InputNumber
                    value={cantidadCuotas}
                    onChange={(value) => setCantidadCuotas(value)}
                    placeholder="2"
                    className="w-16 h-8 text-sm px-2"
                  />
                  <span className="text-xs text-muted-foreground">cuotas</span>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {data && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
                {!simulacionId && hasPermission(PERMISOS.CASHFLOW_CONCILIAR) && (
                  <LoadingButton
                    type="button"
                    variant="secondary"
                    loading={isConciliando}
                    disabled={!!data.conciliado || !data.bancoId}
                    onClick={() => setConciliarConfirmOpen(true)}
                  >
                    {data.conciliado ? "Conciliado" : "Conciliar"}
                  </LoadingButton>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <LoadingButton type="submit" loading={isCreating || isEditing}>
                {data ? "Actualizar" : "Crear"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>

      <DeleteDialog
        open={conciliarConfirmOpen}
        onClose={() => setConciliarConfirmOpen(false)}
        onDelete={handleConciliar}
        message="¿Está seguro que desea conciliar esta transacción con el banco asociado?"
      />
    </>
  );
}
