import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/utils/number";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigStore } from "@/stores/config-store";
import { EditableInput } from "@/components/form-helpers/editable-input";
import { RefreshCcw } from "lucide-react";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

type ResumenProps = {
  form: any;
  handleReset: () => void;
  handleVentaTotal: () => void;
};

export const Resumen = ({
  form,
  handleReset,
  handleVentaTotal,
}: ResumenProps) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const { accessibilityMode } = useConfigStore();

  // Esta función maneja solo el colapso al hacer clic en el encabezado
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const puedeHacerCosteoComercial = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_COMERCIAL_CREAR
  );

  return (
    <Card
      className={`${accessibilityMode && isVisible ? "sticky top-0 opacity-90" : ""}`}
    >
      <CardHeader className="py-3 px-4 bg-muted/50 cursor-pointer">
        <div
          className="flex justify-between items-center"
          onClick={toggleVisibility}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Previene el colapso al hacer clic en el botón de reset
                handleReset();
              }}
              className="text-muted-foreground hover:text-primary"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>

            <h2 className="font-medium">Resumen</h2>
          </div>
          <span className="text-sm font-semibold text-right">
            $ {formatCurrency(form.watch("ventaTotal") || 0)}
          </span>
        </div>
      </CardHeader>

      <CardContent className={`${isVisible ? "" : "hidden"} p-4 space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ganancia">Rentabilidad Estimada</Label>
            <FormField
              control={form.control}
              name="bab"
              render={({ field }) => {
                const bab =
                  (form.watch("margenTotal") || 0) -
                  (form.watch("taxTotal") || 0);
                React.useEffect(() => {
                  form.setValue("bab", bab);
                }, [bab, form.setValue]);

                return (
                  <Input
                    className={`w-full text-right bg-muted h-8 ${field.value < 0 ? "text-red-600" : ""}`}
                    readOnly
                    {...field}
                    value={formatCurrency(bab)}
                  />
                );
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margen">%</Label>

            <Input
              className={`w-full text-right bg-muted h-8 font-bold ${((form.watch("bab") || 0) / (form.watch("ventaTotal") || 0)) * 100 < 20 ? "text-red-500" : ""}`}
              readOnly
              value={formatCurrency(
                ((form.watch("bab") || 0) / (form.watch("ventaTotal") || 0)) *
                  100
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costoTotal">Costo total</Label>
            <FormField
              control={form.control}
              name="costoTotal"
              render={({ field }) => (
                <Input
                  className="h-8 text-right bg-muted"
                  readOnly
                  {...field}
                  value={formatCurrency(field.value || 0)}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ventaTotal">Valor total</Label>
            <FormField
              control={form.control}
              name="ventaTotal"
              render={({ field }) => (
                <EditableInput
                  field={field}
                  label="Valor total"
                  disabled={!puedeHacerCosteoComercial}
                  onChange={handleVentaTotal}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
