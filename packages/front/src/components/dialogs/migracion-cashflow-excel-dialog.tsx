"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMigrarCashflowExcel } from "@/hooks/cashflow-transaccion";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MigracionCashflowExcelDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MigracionCashflowExcelDialog({
  open,
  onClose,
}: MigracionCashflowExcelDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const { mutateAsync, isPending } = useMigrarCashflowExcel();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResultado(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await mutateAsync(selectedFile);
      setResultado(result);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResultado(null);
    onClose();
  };

  const isValidExcelFile = (file: File) => {
    return (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Migrar Transacciones desde Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!resultado ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="cashflow-excel-file">Archivo Excel</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="cashflow-excel-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={isPending}
                  />
                </div>
                {selectedFile && !isValidExcelFile(selectedFile) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Por favor selecciona un archivo Excel válido (.xlsx o .xls)
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {selectedFile && isValidExcelFile(selectedFile) && (
                <div className="space-y-4">
                  <Alert>
                    <FileSpreadsheet className="h-4 w-4" />
                    <AlertDescription>
                      Archivo seleccionado: {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(1)} KB)
                    </AlertDescription>
                  </Alert>

                  <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Formato esperado del Excel:</strong> La primera fila
                      debe ser el encabezado con las columnas en este orden:
                      <span className="font-mono block mt-1">
                        fecha | monto | descripcion | categoria
                      </span>
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>
                          <strong>fecha:</strong> formato dd/mm/yyyy
                        </li>
                        <li>
                          <strong>monto:</strong> valor numérico
                        </li>
                        <li>
                          <strong>descripcion:</strong> texto (opcional)
                        </li>
                        <li>
                          <strong>categoria:</strong> nombre exacto de una
                          categoría de cashflow
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {isPending && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 animate-spin" />
                      Procesando migración...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={100} className="w-full animate-pulse" />
                      <p className="text-sm text-muted-foreground text-center">
                        Analizando archivo Excel y creando transacciones...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={
                    !selectedFile ||
                    !isValidExcelFile(selectedFile) ||
                    isPending
                  }
                >
                  {isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir y Procesar
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {resultado.mensaje || "Migración completada exitosamente"}
                </AlertDescription>
              </Alert>

              {resultado.resumen && (
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">
                            {resultado.resumen.totalFilas}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Exitosos
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {resultado.resumen.exitosos}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Errores
                          </p>
                          <p className="text-2xl font-bold text-red-600">
                            {resultado.resumen.errores}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {resultado.resultados && (
                <Tabs defaultValue="exitosos" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="exitosos">
                      Exitosos (
                      {
                        resultado.resultados.filter(
                          (r: any) => r.estado === "exitoso"
                        ).length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="errores">
                      Errores (
                      {
                        resultado.resultados.filter(
                          (r: any) => r.estado === "error"
                        ).length
                      }
                      )
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="exitosos" className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <div className="space-y-3">
                        {resultado.resultados
                          .filter((item: any) => item.estado === "exitoso")
                          .map((item: any, index: number) => (
                            <ResultadoFilaCard key={index} item={item} />
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="errores" className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <div className="space-y-3">
                        {resultado.resultados
                          .filter((item: any) => item.estado === "error")
                          .map((item: any, index: number) => (
                            <ResultadoFilaCard key={index} item={item} />
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              )}

              <div className="flex justify-end">
                <Button onClick={handleClose}>Cerrar</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultadoFilaCard({ item }: { item: any }) {
  const isExitoso = item.estado === "exitoso";

  return (
    <Card
      className={`${isExitoso ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} transition-colors`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {isExitoso ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">Fila {item.fila}</span>
          </div>
          <Badge
            variant={isExitoso ? "default" : "destructive"}
            className="text-xs"
          >
            {item.estado}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
          <div>
            <span className="font-medium">Fecha:</span>{" "}
            {item.datos.fecha || "-"}
          </div>
          <div>
            <span className="font-medium">Monto:</span>{" "}
            {item.datos.monto || "-"}
          </div>
          <div>
            <span className="font-medium">Categoría:</span>{" "}
            {item.datos.categoria || "-"}
          </div>
          <div>
            <span className="font-medium">Descripción:</span>{" "}
            {item.datos.descripcion || "-"}
          </div>
        </div>

        {item.acciones && item.acciones.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Acciones:
            </p>
            <div className="space-y-1">
              {item.acciones.map((accion: string, idx: number) => (
                <div
                  key={idx}
                  className="text-xs bg-white/50 rounded px-2 py-1"
                >
                  {accion}
                </div>
              ))}
            </div>
          </div>
        )}

        {item.errores && item.errores.length > 0 && (
          <div>
            <p className="text-xs font-medium text-red-600 mb-1">Errores:</p>
            <div className="space-y-1">
              {item.errores.map((error: string, idx: number) => (
                <div
                  key={idx}
                  className="text-xs bg-red-100 text-red-700 rounded px-2 py-1"
                >
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
