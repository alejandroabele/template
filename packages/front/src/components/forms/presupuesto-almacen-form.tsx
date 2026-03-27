"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Presupuesto } from "@/types";
import { useVerficarAlmacenMutation } from "@/hooks/presupuestos";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { DatePicker } from "@/components/form-helpers/date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, type Dispatch, type SetStateAction } from "react";
import { today } from "@/utils/date";
import { PROCESO_GENERAL } from "@/constants/presupuesto";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  id: z.number().optional(),
  fechaVerificacionAlmacen: z.string({ message: "Requerido" }),
  ignorarStock: z.boolean().optional(),
  procesoGeneralId: z.number(),
});

type PresupuestoAlmacenFormProps = {
  data?: Presupuesto;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type ProductoSinStock = {
  productoId: number;
  productoNombre: string;
  cantidadNecesaria: number;
  stockActual: number;
  stockReservado: number;
  stockDisponible: number;
  faltante: number;
};

export default function PresupuestoAlmacenForm({
  data,
  setOpen,
}: PresupuestoAlmacenFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [productosSinStock, setProductosSinStock] = useState<
    ProductoSinStock[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      fechaVerificacionAlmacen: data?.fechaVerificacionAlmacen || today(),
      ignorarStock: data?.ignorarStock ?? false,
      procesoGeneralId:
        data?.procesoGeneralId || PROCESO_GENERAL.ENVIADO_A_PRODUCCION,
    },
  });

  const { mutateAsync: edit, isPending: isPendingEdit } =
    useVerficarAlmacenMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setProductosSinStock([]);
      const resultado = await edit({ id: values.id, data: values });

      if (!resultado.success && resultado.productosSinStock.length > 0) {
        setProductosSinStock(resultado.productosSinStock);
        toast({
          title: "Stock insuficiente",
          description: `${resultado.productosSinStock.length} producto(s) sin stock disponible`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verificación exitosa",
          description: "El almacén se verificó correctamente",
        });
        setOpen(false);
      }
    } catch (error) {
      console.error("Form submission error", error);
      setError("Error al guardar. Intente nuevamente.");
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }

  const handleGenerarSolcom = () => {
    if (!data?.id || productosSinStock.length === 0) return;

    const items = productosSinStock.map((p) => [
      p.productoId,
      p.faltante.toFixed(2),
    ]);

    const params = new URLSearchParams({
      presupuestoId: data.id.toString(),
      items: JSON.stringify(items),
    });

    router.push(`/solcom/crear?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Fecha de verificación */}
        <FormItem>
          <FormLabel>Fecha de verificación</FormLabel>
          <DatePicker
            label=""
            form={form}
            name="fechaVerificacionAlmacen"
            fromYear={2025}
            className="w-full"
          />
        </FormItem>

        {/* Tipo de proceso */}
        <FormField
          control={form.control}
          name="procesoGeneralId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enviar a</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  className="grid grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="produccion"
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      field.value === PROCESO_GENERAL.ENVIADO_A_PRODUCCION
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      id="produccion"
                      value={PROCESO_GENERAL.ENVIADO_A_PRODUCCION.toString()}
                    />
                    <span className="font-medium">Producción</span>
                  </label>

                  <label
                    htmlFor="servicio"
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      field.value === PROCESO_GENERAL.ENVIADO_A_SERVICIO
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      id="servicio"
                      value={PROCESO_GENERAL.ENVIADO_A_SERVICIO.toString()}
                    />
                    <span className="font-medium">Servicio</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opción de ignorar stock */}
        <FormField
          control={form.control}
          name="ignorarStock"
          render={({ field }) => (
            <FormItem>
              <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <span className="font-medium text-sm">
                    Iniciar sin stock disponible
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Continuar aunque falte stock. Podrá generar solicitudes de
                    compra después.
                  </p>
                </div>
              </label>
            </FormItem>
          )}
        />

        {/* Productos sin stock */}
        {productosSinStock.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-destructive">
                {productosSinStock.length} producto(s) sin stock suficiente
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerarSolcom}
                className="h-8 text-xs bg-transparent"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                Generar Solcom
              </Button>
            </div>

            <TooltipProvider>
              <ScrollArea className="h-[180px] rounded-md border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/50 text-xs">
                    <tr className="text-left text-muted-foreground">
                      <th className="p-2 font-medium">Producto</th>
                      <th className="p-2 font-medium text-right">Fisico</th>
                      <th className="p-2 font-medium text-right">Reservado</th>
                      <th className="p-2 font-medium text-right">Necesario</th>
                      <th className="p-2 font-medium text-right">Faltante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {productosSinStock.map((producto) => (
                      <tr key={producto.productoId}>
                        <td className="p-2 pr-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate text-sm cursor-default max-w-[200px]">
                                {producto.productoNombre}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start">
                              <p className="max-w-xs">{producto.productoNombre}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-2 text-right tabular-nums text-muted-foreground">
                          {producto.stockActual.toFixed(2)}
                        </td>
                        <td className="p-2 text-right tabular-nums text-muted-foreground">
                          {producto.stockReservado.toFixed(2)}
                        </td>
                        <td className="p-2 text-right tabular-nums">
                          {producto.cantidadNecesaria.toFixed(2)}
                        </td>
                        <td className="p-2 text-right tabular-nums font-medium text-destructive">
                          {producto.faltante.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </TooltipProvider>
          </div>
        )}

        {/* Botones */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <LoadingButton loading={isPendingEdit} type="submit">
            Verificar Almacén
          </LoadingButton>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
            className="bg-transparent"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
