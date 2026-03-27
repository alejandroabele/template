import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPadron } from "@/hooks/afip";
import { formatMoney } from "@/utils/number";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  XCircle,
  Mail,
  Edit,
} from "lucide-react";
import { CONDICION_IVA } from "@/constants/condicion-iva";
import type { Oferta, OrdenCompra, OrdenCompraItem } from "@/types";
import { useDownloadOrdenCompraPdf } from "@/hooks/orden-compra";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";
import { CancelarOrdenCompraDialog } from "@/components/dialogs/cancelar-orden-compra-dialog";
import { EditarObservacionesOrdenCompraDialog } from "@/components/dialogs/editar-observaciones-orden-compra-dialog";
import { EditarDescripcionOrdenCompraItemDialog } from "@/components/dialogs/editar-descripcion-orden-compra-item-dialog";
import { ESTADO_ORDEN_COMPRA_CODIGOS } from "@/constants/compras";
import { OrdenCompraItemsTable } from "@/components/tables/orden-compra-items-table";
import React from "react";

type OrdenCompraFormProps = {
  data: Oferta | OrdenCompra;
  mode?: "oferta" | "orden";
};

export const OrdenCompraForm = ({
  data,
  mode = "oferta",
}: OrdenCompraFormProps) => {
  const router = useRouter();
  const { mutate: downloadPdf, isPending: isDownloadingPdf } =
    useDownloadOrdenCompraPdf();
  const [openCancelarDialog, setOpenCancelarDialog] = React.useState(false);
  const [openEditarObsDialog, setOpenEditarObsDialog] = React.useState(false);
  const [editingItemId, setEditingItemId] = React.useState<number | null>(null);
  const [editingItemDescription, setEditingItemDescription] =
    React.useState("");

  // Extraer datos según el modo
  const isOferta = mode === "oferta";
  const oferta = isOferta ? (data as Oferta) : (data as OrdenCompra).oferta;
  const ordenCompra = !isOferta ? (data as OrdenCompra) : null;

  // Verificar si la orden está cancelada
  const estaCancelada =
    ordenCompra?.estado?.codigo === ESTADO_ORDEN_COMPRA_CODIGOS.OC_CANCELADA;

  // Verificar si la orden está emitida (solo se puede cancelar si está emitida)
  const estaEmitida =
    ordenCompra?.estado?.codigo === ESTADO_ORDEN_COMPRA_CODIGOS.OC_EMITIDA;

  const cuit = oferta?.proveedor?.cuit || "";
  const {
    data: padronData,
    isLoading: loadingPadron,
    isError: errorPadron,
    error: errorPadronObj,
  } = useGetPadron(cuit, !!cuit);

  const handleGeneratePDF = () => {
    if (!isOferta && ordenCompra?.id) {
      downloadPdf(String(ordenCompra.id));
    }
  };

  if (!data) return null;

  // Verificar si el proveedor es Responsable Inscripto (código 30)
  const esResponsableInscripto = padronData?.condicionFrenteIva === "30";

  // Usar items de oferta o de orden según el modo
  const items = isOferta ? (data as Oferta).items : (data as OrdenCompra).items;

  // Calcular totales
  const subtotal =
    items?.reduce((acc, item) => {
      const cantidad = parseFloat(item.cantidad || "0");
      const precioUnitario = parseFloat(item.precio || "0");
      return acc + cantidad * precioUnitario;
    }, 0) || 0;

  // Obtener bonificacion
  const bonificacion = isOferta
    ? (data as Oferta).bonificacion
    : (data as OrdenCompra).bonificacion;

  // Calcular descuento de bonificacion
  const descuentoBonificacion = (() => {
    if (!bonificacion || bonificacion.trim() === "") return 0;

    // Si es porcentaje (ej: "10%")
    if (bonificacion.includes("%")) {
      const porcentaje = parseFloat(bonificacion.replace("%", "").trim());
      return (subtotal * porcentaje) / 100;
    }

    // Si es monto fijo
    return parseFloat(bonificacion);
  })();

  const subtotalConDescuento = subtotal - descuentoBonificacion;

  const itemsConIva =
    items?.map((item) => {
      const cantidad = parseFloat(item.cantidad || "0");
      const precioUnitario = parseFloat(item.precio || "0");
      const alicuota = item.alicuota || 21;
      const subtotalItem = cantidad * precioUnitario;
      const ivaItem = subtotalItem * (alicuota / 100);

      return {
        ...item,
        alicuota,
        subtotalItem,
        ivaItem,
      };
    }) || [];

  const totalIva = itemsConIva.reduce((acc, item) => acc + item.ivaItem, 0);

  // Calcular IVA sobre el subtotal con descuento
  const ivaConDescuento =
    descuentoBonificacion > 0
      ? (subtotalConDescuento * totalIva) / subtotal
      : totalIva;

  // Si no es responsable inscripto, el total no incluye IVA
  const total = esResponsableInscripto
    ? subtotalConDescuento + ivaConDescuento
    : subtotalConDescuento;

  // Determinar estado fiscal
  const getEstadoFiscalBadge = () => {
    if (loadingPadron) {
      return (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Verificando...
        </Badge>
      );
    }

    if (errorPadron || !padronData) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          No verificado
        </Badge>
      );
    }

    if (padronData.condicionFrenteIva) {
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Verificado
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        No Verificado
      </Badge>
    );
  };

  // Obtener método de pago y plazo según el modo
  const metodoPago = isOferta
    ? (data as Oferta).metodoPago
    : (data as OrdenCompra).metodoPago;
  const plazoPago = isOferta
    ? (data as Oferta).plazoPago
    : (data as OrdenCompra).plazoPago;
  const observaciones = isOferta
    ? (data as Oferta).observaciones
    : (data as OrdenCompra).obs;
  const fechaDisponibilidad = isOferta
    ? (data as Oferta).fechaDisponibilidad
    : undefined;
  const validez = isOferta ? (data as Oferta).validez : undefined;
  const fechaEmision = !isOferta
    ? (data as OrdenCompra).fechaEmision
    : undefined;
  const estado = !isOferta ? (data as OrdenCompra).estado : undefined;

  return (
    <div className="space-y-4">
      {/* Card de información general de la Orden */}
      {!isOferta && ordenCompra && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Orden de Compra</p>
                <p className="font-semibold text-base">#{ordenCompra.id}</p>
              </div>
              {oferta?.id && (
                <div>
                  <p className="text-muted-foreground">Presupuesto</p>
                  <Link href={`/ofertas/${oferta.id}`} className="font-semibold text-base hover:underline">
                    #{oferta.id}
                  </Link>
                </div>
              )}
              {estado && (
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <Badge className="mt-1">{estado.nombre}</Badge>
                </div>
              )}
              {fechaEmision && (
                <div>
                  <p className="text-muted-foreground">Fecha emisión</p>
                  <p className="font-medium">{fechaEmision}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Información del Proveedor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Datos del Proveedor</span>
            <div className="flex items-center gap-2">
              {oferta?.solcom?.id && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() =>
                    router.push(`/solcom/${oferta?.solcom?.id}/mensajes`)
                  }
                  type="button"
                  title="Ver mensajes de la solicitud de compra"
                >
                  <Mail />
                </Button>
              )}
              {getEstadoFiscalBadge()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Razón Social</p>
              <p className="font-medium">{oferta?.proveedor?.razonSocial}</p>
            </div>
            <div>
              <p className="text-muted-foreground">CUIT</p>
              <p className="font-medium">{oferta?.proveedor?.cuit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Domicilio</p>
              <p className="font-medium">{oferta?.proveedor?.domicilio}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Localidad</p>
              <p className="font-medium">{oferta?.proveedor?.localidad}</p>
            </div>
          </div>

          {padronData && !errorPadron && (
            <>
              <Separator />
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-semibold">Condición frente a IVA:</span>{" "}
                  {padronData.condicionFrenteIva
                    ? CONDICION_IVA[
                        padronData.condicionFrenteIva as keyof typeof CONDICION_IVA
                      ] || padronData.condicionFrenteIva
                    : "No disponible"}
                </AlertDescription>
              </Alert>
            </>
          )}

          {errorPadron && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {(errorPadronObj as Error)?.message ||
                  "Error al verificar el CUIT"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Condiciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Condiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Método de Pago</p>
              <p className="font-medium">{metodoPago?.nombre || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Plazo de Pago</p>
              <p className="font-medium">{plazoPago?.descripcion || "N/A"}</p>
            </div>
            {fechaDisponibilidad && (
              <div>
                <p className="text-muted-foreground">Fecha Disponibilidad</p>
                <p className="font-medium">{fechaDisponibilidad}</p>
              </div>
            )}
            {validez && (
              <div>
                <p className="text-muted-foreground">Validez</p>
                <p className="font-medium">{validez}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdenCompraItemsTable
            items={items}
            onEditItem={(item) => {
              setEditingItemId(item.id || null);
              setEditingItemDescription(item.descripcion || "");
            }}
            showEditButton={
              !isOferta &&
              estaEmitida &&
              hasPermission(PERMISOS.ORDEN_COMPRA_EDITAR)
            }
          />

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="">Subtotal:</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm ">
              <span>Bonificación:</span>
              <span className="font-medium">
                -{formatMoney(descuentoBonificacion)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="">IVA:</span>
              <span className="font-medium">
                {esResponsableInscripto
                  ? formatMoney(
                      descuentoBonificacion > 0 ? ivaConDescuento : totalIva
                    )
                  : "NO APLICA"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">{formatMoney(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Observaciones</CardTitle>
          {!isOferta &&
            estaEmitida &&
            hasPermission(PERMISOS.ORDEN_COMPRA_EDITAR) && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setOpenEditarObsDialog(true)}
              >
                <Edit />
              </Button>
            )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {observaciones || "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Botones de acción - Solo para modo orden */}
      {!isOferta && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mt-6">
            <Button
              onClick={handleGeneratePDF}
              disabled={isDownloadingPdf || estaCancelada}
              className="w-full sm:w-auto"
            >
              {isDownloadingPdf ? "Generando..." : "Descargar PDF"}
            </Button>
            {hasPermission(PERMISOS.INVENTARIO_INGRESO_MERCADERIA) && (
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    `/productos/ingreso?ordenCompraId=${ordenCompra?.id}`
                  )
                }
                variant="default"
                disabled={estaCancelada}
                className="w-full sm:w-auto"
              >
                Realizar Ingreso
              </Button>
            )}
            {hasPermission(PERMISOS.ORDEN_COMPRA_CANCELAR) && estaEmitida && (
              <Button
                type="button"
                onClick={() => setOpenCancelarDialog(true)}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Cancelar Orden
              </Button>
            )}
            <Button
              type="button"
              onClick={() => router.back()}
              variant="link"
              className="w-full sm:w-auto"
            >
              Volver
            </Button>
          </div>
          {ordenCompra?.id && (
            <CancelarOrdenCompraDialog
              open={openCancelarDialog}
              setOpen={setOpenCancelarDialog}
              ordenCompraId={ordenCompra.id}
              onSuccess={() => {
                router.refresh();
              }}
            />
          )}
          {ordenCompra?.id && (
            <EditarObservacionesOrdenCompraDialog
              open={openEditarObsDialog}
              setOpen={setOpenEditarObsDialog}
              ordenCompraId={ordenCompra.id}
              observacionesActuales={observaciones}
            />
          )}
        </>
      )}
      {editingItemId && (
        <EditarDescripcionOrdenCompraItemDialog
          open={editingItemId !== null}
          setOpen={(open) => {
            if (!open) setEditingItemId(null);
          }}
          itemId={editingItemId}
          descripcionActual={editingItemDescription}
          nombreProducto={
            itemsConIva.find((item) => item.id === editingItemId)?.inventario
              ?.nombre
          }
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
};
