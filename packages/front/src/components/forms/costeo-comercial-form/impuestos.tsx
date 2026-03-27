import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/number";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { es } from "date-fns/locale";

type ImpuestosProps = {
  form: any;
};

export const Impuestos = ({ form }: ImpuestosProps) => {
  // Estado para controlar la visibilidad
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Card>
      <CardHeader className="py-3 px-4 bg-muted/50">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setIsVisible(!isVisible)}
        >
          <h2 className="font-medium ">Impuestos</h2>
          <span className="text-sm font-semibold text-right -foreground">
            $ {formatCurrency(form.watch("taxTotal") || 0)}
          </span>
        </div>
      </CardHeader>
      <CardContent className={`${isVisible ? "" : "hidden"} p-4 space-y-2`}>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">Ingresos brutos</div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxIngresosComision"
                render={({ field }) => (
                  <Input
                    className="h-8 text-right "
                    {...field}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/[^0-9.,]/g, "")
                        .replace(",", ".");
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxIngresosCosto"
                render={({ field }) => {
                  const comision = form.watch("taxIngresosComision") || 0;
                  const ventaTotal = form.watch("ventaTotal") || 0;
                  const valorCalculado = (ventaTotal * comision) / 100;

                  React.useEffect(() => {
                    form.setValue("taxIngresosCosto", valorCalculado);
                  }, [valorCalculado, form.setValue]);

                  return (
                    <Input
                      className="w-full text-right bg-muted h-8"
                      readOnly
                      {...field}
                      value={formatCurrency(valorCalculado)}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">Transferencias bancarias</div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxTransfComision"
                render={({ field }) => (
                  <Input
                    className="h-8 text-right"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/[^0-9.,]/g, "")
                        .replace(",", ".");
                    }}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxTransfCosto"
                render={({ field }) => {
                  const comision = form.watch("taxTransfComision") || 0;
                  const ventaTotal = form.watch("ventaTotal") || 0;
                  const valorCalculado = (ventaTotal * comision) / 100;

                  React.useEffect(() => {
                    form.setValue("taxTransfCosto", valorCalculado);
                  }, [valorCalculado, form.setValue]);

                  return (
                    <Input
                      className="w-full text-right bg-muted h-8"
                      readOnly
                      {...field}
                      value={formatCurrency(valorCalculado)}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">Impuestos a las ganancias</div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxGananciasComision"
                render={({ field }) => (
                  <Input
                    className="h-8 text-right"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/[^0-9.,]/g, "")
                        .replace(",", ".");
                    }}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxGananciasCosto"
                render={({ field }) => {
                  const comision = form.watch("taxGananciasComision") || 0;
                  const ventaTotal = form.watch("ventaTotal") || 0;
                  const costoTotal = form.watch("costoTotal") || 0;
                  const costoAdminTotal = form.watch("costoAdminTotal") || 0;
                  const valorCalculado =
                    ((ventaTotal - costoTotal - costoAdminTotal) * comision) /
                    100;

                  React.useEffect(() => {
                    form.setValue("taxGananciasCosto", valorCalculado);
                  }, [valorCalculado, form.setValue]);

                  return (
                    <Input
                      className="w-full text-right bg-muted h-8"
                      readOnly
                      {...field}
                      value={formatCurrency(valorCalculado)}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t mt-2">
          <div className="col-span-1 font-medium">Total de impuestos</div>
          <div className="flex justify-end"></div>
          <div className="col-span-1">
            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="taxTotal"
                render={({ field }) => {
                  const ingresos = form.watch("taxIngresosCosto") || 0;
                  const transf = form.watch("taxTransfCosto") || 0;
                  const ganancias = form.watch("taxGananciasCosto") || 0;
                  const total = ingresos + transf + ganancias;

                  React.useEffect(() => {
                    form.setValue("taxTotal", total);
                  }, [total, form.setValue]);

                  return (
                    <Input
                      className="w-full text-right bg-muted h-8"
                      readOnly
                      {...field}
                      value={formatCurrency(total)}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
