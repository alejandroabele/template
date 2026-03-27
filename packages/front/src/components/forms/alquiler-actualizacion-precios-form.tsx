"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IndicesSelectorMultiple } from "@/components/selectors/indice-selector-multiple";
import { useEditPrecioAlquilerMutation } from "@/hooks/alquiler";
import { ToastAction } from "@/components/ui/toast";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Alquiler } from "@/types";
import type { useToast } from "@/hooks/use-toast";

type ActualizacionResult = {
  id: string;
  precioAnterior: number;
  precioNuevo: number;
  success: boolean;
  error?: string;
  clienteInfo?: string;
};

type AlquilerActualizacionPreciosFormProps = {
  selectedRows: Alquiler[];
  setOpen: (open: boolean) => void;
  toast: ReturnType<typeof useToast>["toast"];
};

const AlquilerActualizacionPreciosForm = ({
  selectedRows,
  setOpen,
  toast,
}: AlquilerActualizacionPreciosFormProps) => {
  const [selectedIndices, setSelectedIndices] = React.useState<string[]>([]);
  const [selectedPorcentajes, setSelectedPorcentajes] = React.useState<
    number[]
  >([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [actualizacionResults, setActualizacionResults] = React.useState<
    ActualizacionResult[]
  >([]);
  const { mutateAsync: updatePrecios, isPending } =
    useEditPrecioAlquilerMutation();

  const calcularNuevoPrecio = React.useCallback(
    (precioActual: number, porcentaje: number): number => {
      return precioActual * (1 + porcentaje / 100);
    },
    []
  );

  const calcularVistaPrevia = React.useMemo(() => {
    if (selectedPorcentajes.length === 0) return [];

    return selectedRows.map((row) => {
      let nuevoPrecio = row.original?.precio;
      selectedPorcentajes.forEach((porcentaje) => {
        nuevoPrecio = calcularNuevoPrecio(nuevoPrecio, Number(porcentaje));
      });

      return {
        id: row.original.id,
        clienteInfo: `${row.original.clienteId} - ${row.original.localidad}`,
        precioAnterior: row.original?.precio,
        precioNuevo: Number(nuevoPrecio),
        diferencia: Number(nuevoPrecio) - row.original?.precio,
        porcentajeAumento:
          ((Number(nuevoPrecio) - row.original?.precio) /
            row.original?.precio) *
          100,
      };
    });
  }, [selectedRows, selectedPorcentajes, calcularNuevoPrecio]);

  const handleSubmit = async () => {
    if (selectedIndices.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un índice",
        variant: "destructive",
      });
      return;
    }

    if (!showPreview) {
      setShowPreview(true);
      return;
    }

    const results: ActualizacionResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const row of selectedRows) {
        let nuevoPrecio = row.original?.precio;

        selectedPorcentajes.forEach((porcentaje) => {
          nuevoPrecio = calcularNuevoPrecio(nuevoPrecio, Number(porcentaje));
        });

        try {
          await updatePrecios({
            id: row.original.id,
            data: {
              clienteId: row.original.clienteId,
              localidad: row.original.localidad,
              zona: row.original.zona,
              alquilerRecursoId: row.original.alquilerRecursoId,
              precio: Number(nuevoPrecio).toFixed(2),
            },
          });

          results.push({
            id: row.original.id,
            precioAnterior: row.original?.precio,
            precioNuevo: Number(nuevoPrecio),
            success: true,
            clienteInfo: `${row.original.clienteId} - ${row.original.localidad}`,
          });
          successCount++;
        } catch (error) {
          console.error(
            `Error actualizando alquiler ${row.original.id}:`,
            error
          );
          results.push({
            id: row.original.id,
            precioAnterior: row.original?.precio,
            precioNuevo: Number(nuevoPrecio),
            success: false,
            error: error instanceof Error ? error.message : "Error desconocido",
            clienteInfo: `${row.original.clienteId} - ${row.original.localidad}`,
          });
          errorCount++;
        }
      }

      setActualizacionResults(results);
      setShowResults(true);

      if (errorCount === 0) {
        toast({
          title: "✅ Actualización completada",
          description: `Se actualizaron ${successCount} precios exitosamente`,
        });
      } else {
        toast({
          title: "⚠️ Actualización parcial",
          description: `${successCount} exitosos, ${errorCount} con errores`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error durante la actualización",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIndices([]);
    setSelectedPorcentajes([]);
    setShowPreview(false);
    setShowResults(false);
    setActualizacionResults([]);
  };

  const totalPorcentaje = selectedPorcentajes.reduce(
    (acc, curr) => acc + Number(curr),
    0
  );

  return (
    <div className="space-y-4">
      {!showPreview && !showResults && (
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Índices de actualización</p>
            <IndicesSelectorMultiple
              value={selectedIndices}
              onChange={(newValues, porcentajes) => {
                setSelectedPorcentajes(porcentajes);
                setSelectedIndices(newValues);
              }}
            />
            {selectedPorcentajes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedPorcentajes.map((porcentaje, index) => (
                  <Badge key={index} variant="secondary">
                    +{Number(porcentaje).toFixed(2)}%
                  </Badge>
                ))}
                <Badge variant="default">
                  Total: +{totalPorcentaje.toFixed(2)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {showPreview && !showResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Vista previa de cambios</span>
          </div>
          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-3">
              {calcularVistaPrevia.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.clienteInfo}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Antes: ${item.precioAnterior.toFixed(2)}</span>
                      <span>→</span>
                      <span className="text-green-600 font-medium">
                        Después: ${item.precioNuevo.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      +${item.diferencia.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +{item.porcentajeAumento.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {showResults && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              {actualizacionResults.filter((r) => r.success).length} Exitosos
            </Badge>
            {actualizacionResults.filter((r) => !r.success).length > 0 && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                {actualizacionResults.filter((r) => !r.success).length} Con
                errores
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-3">
              {actualizacionResults.map((result) => (
                <div
                  key={result.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    result.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <p className="text-sm font-medium">
                        {result.clienteInfo}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-6">
                      <span>${result.precioAnterior.toFixed(2)}</span>
                      <span>→</span>
                      <span
                        className={
                          result.success ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${result.precioNuevo.toFixed(2)}
                      </span>
                    </div>
                    {!result.success && result.error && (
                      <p className="text-xs text-red-600 ml-6 mt-1">
                        {result.error}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${result.success ? "text-green-600" : "text-red-600"}`}
                    >
                      {result.success ? "+" : ""}$
                      {(result.precioNuevo - result.precioAnterior).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose} disabled={isPending}>
          {showResults ? "Cerrar" : "Cancelar"}
        </Button>

        {showPreview && !showResults && (
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            disabled={isPending}
          >
            Volver
          </Button>
        )}

        {!showResults && (
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedIndices.length === 0}
          >
            {isPending
              ? "Actualizando..."
              : showPreview
                ? "Confirmar Actualización"
                : "Vista Previa"}
          </Button>
        )}
      </div>
    </div>
  );
};
export default AlquilerActualizacionPreciosForm;
