"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { InputMoney } from "@/components/input-money";
import { format } from "date-fns";
import { useCreateCobroMasivoMutation } from "@/hooks/cobro";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/form-helpers/date-picker";
import React from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import type { Dispatch, SetStateAction } from "react";
import { MetodoPagoSelector } from "@/components/selectors/metodo-pago-selector";
import { BancoSelector } from "@/components/selectors/banco-selector";
import { DollarSign, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Factura } from "@/types";
import { Currency } from "@/components/ui/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  fecha: z.string().optional(),
  metodoPagoId: z.number().optional(),
  bancoId: z.number().optional(),
  retenciones: z.string().optional(),
  facturas: z
    .array(
      z.object({
        facturaId: z.number(),
        monto: z.string().min(1, "Monto requerido"),
      })
    )
    .min(1, "Debe haber al menos una factura"),
});

type CobroMasivoDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  facturas: Factura[];
};

export const CobroMasivoDialog = ({
  open,
  setOpen,
  facturas,
}: CobroMasivoDialogProps) => {
  const { toast } = useToast();
  const [banco, setBanco] = React.useState<any>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: format(new Date(), "yyyy-MM-dd"),
      metodoPagoId: undefined,
      bancoId: undefined,
      retenciones: "",
      facturas: facturas.map((f) => ({
        facturaId: f.id!,
        monto: String(
          Number(f.monto || 0) - Number(f.montoCobrado || 0) > 0
            ? Number(f.monto || 0) - Number(f.montoCobrado || 0)
            : Number(f.monto || 0)
        ),
      })),
    },
  });

  const { mutateAsync: createMasivo, isPending } =
    useCreateCobroMasivoMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        facturas: values.facturas.map((f) => ({
          facturaId: f.facturaId,
          monto: Number(f.monto),
        })),
      };

      await createMasivo(payload);

      toast({
        title: "Cobro masivo creado",
        description: "Se han procesado todas las facturas correctamente",
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el cobro masivo",
        variant: "destructive",
      });
    }
  };

  const montoTotal = form
    .watch("facturas")
    .reduce((sum, f) => sum + Number(f.monto || 0), 0);

  const montoTotalFacturas = facturas.reduce(
    (sum, f) => sum + Number(f.monto || 0),
    0
  );
  const montoYaCobrado = facturas.reduce(
    (sum, f) => sum + Number(f.montoCobrado || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 space-y-2">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6" />
            Cobro Masivo
          </DialogTitle>
          <DialogDescription className="text-base">
            Procesar cobro de {facturas.length} factura{facturas.length !== 1 ? "s" : ""} seleccionada{facturas.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Facturas</p>
                <p className="text-xl font-bold">
                  <Currency>{montoTotalFacturas}</Currency>
                </p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ya Cobrado</p>
                <p className="text-xl font-bold">
                  <Currency>{montoYaCobrado}</Currency>
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">A Cobrar Ahora</p>
                <p className="text-xl font-bold text-primary">
                  <Currency>{montoTotal}</Currency>
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            {/* Tabla con scroll */}
            <div className="px-8 py-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detalle de Facturas
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[320px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10 border-b">
                        <TableRow>
                          <TableHead className="w-[110px] font-semibold">Folio</TableHead>
                          <TableHead className="min-w-[200px] font-semibold">Cliente</TableHead>
                          <TableHead className="w-[130px] font-semibold">Modelo</TableHead>
                          <TableHead className="text-right w-[120px] font-semibold">Total</TableHead>
                          <TableHead className="text-right w-[120px] font-semibold">Cobrado</TableHead>
                          <TableHead className="text-right w-[120px] font-semibold">Pendiente</TableHead>
                          <TableHead className="text-right w-[160px] font-semibold">Cobrar Ahora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facturas.map((factura, index) => {
                          const tipoModelo =
                            factura.modelo === "presupuesto" ? "Pres." : "Alq.";
                          const pendiente =
                            Number(factura.monto || 0) -
                            Number(factura.montoCobrado || 0);
                          const esParcial = Number(factura.montoCobrado || 0) > 0;

                          return (
                            <TableRow key={factura.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium py-4">
                                {factura.folio || "S/N"}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="max-w-[200px] truncate">
                                  {factura.cliente?.nombre || "-"}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant={
                                    factura.modelo === "presupuesto"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {tipoModelo} #{factura.modeloId}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium py-4">
                                <Currency>{Number(factura.monto || 0)}</Currency>
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {esParcial && (
                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                  )}
                                  <Currency>
                                    {Number(factura.montoCobrado || 0)}
                                  </Currency>
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <Currency>{pendiente}</Currency>
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <FormField
                                  control={form.control}
                                  name={`facturas.${index}.monto`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <InputMoney
                                          {...field}
                                          className="w-36 h-9"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detalles del Cobro */}
            <div className="px-8 py-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detalles del Cobro
                </h3>
                <div className="grid gap-5 grid-cols-3">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={() => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Fecha *</FormLabel>
                        <DatePicker form={form} name="fecha" fromYear={2020} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPagoId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Método de Pago</FormLabel>
                        <FormControl>
                          <MetodoPagoSelector
                            value={field.value}
                            onChange={(val) => field.onChange(Number(val))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bancoId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <BancoSelector
                            value={banco}
                            onChange={(val) => {
                              setBanco(val);
                              field.onChange(val?.id);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-8 py-5 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Total a cobrar:</span>
                <span className="text-2xl font-bold text-primary">
                  <Currency>{montoTotal}</Currency>
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  size="lg"
                >
                  Cancelar
                </Button>
                <LoadingButton
                  onClick={form.handleSubmit(onSubmit)}
                  loading={isPending}
                  size="lg"
                  className="min-w-[160px]"
                >
                  Confirmar Cobro
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
