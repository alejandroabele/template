"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./presupuesto-form";
import { formatMoney } from "@/utils/number";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  CreditCard,
  CircleDollarSign,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacturaTable } from "@/components/tables/factura-table";
import { FacturaDialog } from "@/components/dialogs/factura-dialog";
import { CobroTable } from "@/components/tables/cobro-table";
import { CobroDialog } from "@/components/dialogs/cobro-dialog";

interface PresupuestoFacturacionFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PresupuestoFacturacionForm = ({
  form,
}: PresupuestoFacturacionFormProps) => {
  const values = form.watch();
  const [openFacturacion, setOpenFacturacion] = React.useState(false);
  const [openCobro, setOpenCobro] = React.useState(false);

  return (
    <>
      {openFacturacion && (
        <FacturaDialog
          open={openFacturacion}
          setOpen={setOpenFacturacion}
          modelo="presupuesto"
          modeloId={values.id}
          monto={String(
            Math.max(
              0,
              Number(
                (
                  Number(values.ventaTotal || 0) -
                  Number(values.montoFacturado || 0)
                ).toFixed(2)
              )
            )
          )}
          clienteId={values?.clienteId}
          cliente={values?.cliente}
        />
      )}

      {openCobro && (
        <CobroDialog
          open={openCobro}
          setOpen={setOpenCobro}
          modelo="presupuesto"
          modeloId={values.id}
          monto={String(
            Math.max(
              0,
              Number(
                (
                  Number(values.ventaTotal || 0) -
                  Number(values.montoCobrado || 0)
                ).toFixed(2)
              )
            )
          )}
        />
      )}
      <Card>
        {/* Header con gradiente */}
        <CardHeader className="rounded-t-lg border-b bg-muted">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div></div>
              <CardTitle>Administracion</CardTitle>
              <CardDescription>
                <CardDescription>
                  Gestión de facturación y cobranza
                </CardDescription>
              </CardDescription>
            </div>
            <Badge variant="default" className="px-4 py-2">
              {values.procesoGeneral?.nombre}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Resumen principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta de información del cliente */}
            <Card>
              <CardHeader className="rounded-t-lg border-b bg-muted">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-5 h-5" />
                  <span className="font-medium">Información del Cliente</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-full">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium text-gray-900">
                      {values.cliente?.nombre || "No especificado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-full">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CUIT</p>
                    <p className="font-medium text-gray-900">
                      {values.cliente?.cuit || "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha Entregado</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(values.fechaEntregado || "")}
                    </p>
                  </div>
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-12  space-y-2">
                                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                                        <Label className="font-bold text-primary flex items-center gap-2 pb-2">
                                            <AlertCircle className="h-4 w-4 text-primary" />
                                            Proceso General <span className="text-destructive">*</span>
                                        </Label>

                                        <ProcesoGeneralSelector
                                            proceso={() => form.getValues("procesoGeneral")}
                                            onChange={(v: Cliente) => {
                                                form.setValue("procesoGeneralId", v.id)
                                                form.setValue("procesoGeneral", v)
                                                // Trigger validation after setting the value
                                                form.trigger("procesoGeneralId")
                                            }}

                                        />
                                        {form.formState.errors.procesoGeneralId && (
                                            <p className="text-sm font-medium text-destructive mt-1">
                                                {form.formState.errors.procesoGeneralId.message as string}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div> */}
              </CardContent>
            </Card>

            {/* Tarjeta de información financiera */}
            <Card>
              <CardHeader className="rounded-t-lg border-b bg-muted">
                <div className="flex items-center gap-2 text-gray-600">
                  <CircleDollarSign className="w-5 h-5" />
                  <span className="font-medium">Resumen Financiero</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Monto Total</p>
                  <p className="text-xl font-bold text-primary">
                    {formatMoney(values.ventaTotal)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Facturado</p>
                  <p
                    className={`text-xl font-bold ${
                      Number(values.montoFacturado) >= Number(values.ventaTotal)
                        ? "text-green-600"
                        : values.montoFacturado > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {formatMoney(values.montoFacturado)} /{" "}
                    {formatMoney(values.ventaTotal)}
                  </p>
                </div>

                <div className="flex space-x-8">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Cobrado</p>
                    <p
                      className={`text-xl font-bold ${
                        Number(values.montoCobrado) >= Number(values.ventaTotal)
                          ? "text-green-600"
                          : values.montoCobrado > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {formatMoney(values.montoCobrado)} /{" "}
                      {formatMoney(values.ventaTotal)}
                    </p>
                  </div>

                  {Number(values.montoRetenciones) > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Retenciones</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatMoney(values.montoRetenciones)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de acciones rápidas */}
            <Card>
              <CardHeader className="rounded-t-lg border-b bg-muted">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Estado</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Estado Facturación
                  </p>
                  {values.facturacionEstatus === "total" && (
                    <Badge variant="success">TOTAL</Badge>
                  )}
                  {values.facturacionEstatus === "parcial" && (
                    <Badge variant="destructive">PARCIAL</Badge>
                  )}
                  {(values.facturacionEstatus === "pendiente" ||
                    !values.facturacionEstatus) && (
                    <Badge variant="warning">PENDIENTE</Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Estado Cobranza
                  </p>
                  {values.cobranzaEstatus === "total" && (
                    <Badge variant="success">TOTAL</Badge>
                  )}
                  {values.cobranzaEstatus === "parcial" && (
                    <Badge variant="destructive">PARCIAL</Badge>
                  )}
                  {(values.cobranzaEstatus === "pendiente" ||
                    !values.cobranzaEstatus) && (
                    <Badge variant="warning">PENDIENTE</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setOpenFacturacion(true)}
                    className="w-full"
                  >
                    Facturar
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setOpenCobro(true)}
                    className="w-full"
                  >
                    Cobrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de estados */}
          <div>
            <Tabs defaultValue="facturas" className="w-full">
              <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="facturas">Facturas</TabsTrigger>
                <TabsTrigger value="cobros">Cobros</TabsTrigger>
              </TabsList>
              <TabsContent value="facturas" className="mt-6 w-full">
                <FacturaTable id={values.id} modelo="presupuesto" />
              </TabsContent>
              <TabsContent value="cobros" className="mt-6">
                <CobroTable id={values.id} modelo="presupuesto" />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
