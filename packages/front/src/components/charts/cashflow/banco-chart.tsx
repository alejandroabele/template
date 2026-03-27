"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { InputMoney } from "@/components/input-money";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatMoney } from "@/utils/number";
import { useGetBancosQuery } from "@/hooks/banco";
import {
  useGetBancoSaldosQuery,
  useGetUltimosSaldosQuery,
  useActualizarSaldosHoyMutation,
} from "@/hooks/banco-saldo";
import { useGetCashflowResumenSemanaQuery } from "@/hooks/cashflow-transaccion";
import { useDownloadArchivoByIdQuery } from "@/hooks/archivo";
import { TransferenciaBancoModal } from "@/components/forms/transferencia-banco-modal";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import type { Banco } from "@/types";
import { today as getToday } from "@/utils/date";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Calculator,
  ArrowRightLeft,
} from "lucide-react";

interface BancoConSaldos extends Banco {
  saldoActual: number;
  ultimoSaldo: number;
  saldoActualId?: number;
  descubiertoMonto?: number;
  descubiertoUso?: number;
}

const BancoLogo = ({ logo, bancoName }: { logo?: any; bancoName: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: blob } = useDownloadArchivoByIdQuery(logo?.id, {
    enabled: !!logo?.id,
  });

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [blob]);

  if (imageUrl) {
    return (
      <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-white border-2 border-gray-300 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Logo de ${bancoName}`}
          width={80}
          height={80}
          className="object-contain p-2"
          onError={() => setImageUrl(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-md">
      <Building2 className="w-10 h-10 text-primary" />
    </div>
  );
};

interface BancoSaldo {
  id?: number;
  monto: number;
  fecha: string;
  bancoId: number;
  descubiertoMonto?: number;
  descubiertoUso?: number;
}

interface BancoCardProps {
  banco: Banco;
  today: string;
  saldoHoy: BancoSaldo | null;
  ultimoSaldo: number;
  ultimoSaldoCompleto: BancoSaldo | null;
  onSaldoChange: (
    bancoId: number,
    saldoActual: number,
    ultimoSaldo: number,
    saldoActualId?: number,
    descubiertoMonto?: number,
    descubiertoUso?: number
  ) => void;
  onTransferirClick: () => void;
}

function BancoCard({
  banco,
  today,
  saldoHoy,
  ultimoSaldo,
  ultimoSaldoCompleto,
  onSaldoChange,
  onTransferirClick,
}: BancoCardProps) {
  const { toast } = useToast();
  const canTransferir = hasPermission(PERMISOS.BANCOS_TRANSFERIR);

  // Estados locales para los valores editados
  const [localSaldoActual, setLocalSaldoActual] = useState<number | null>(null);
  const [localDescubiertoMonto, setLocalDescubiertoMonto] = useState<
    number | null
  >(null);
  const [localDescubiertoUso, setLocalDescubiertoUso] = useState<number | null>(
    null
  );

  const saldoActual =
    localSaldoActual ?? (saldoHoy ? saldoHoy.monto : ultimoSaldo);
  const saldoActualId = saldoHoy?.id;

  // Estados de descubierto - usar saldoHoy si existe, sino el último saldo completo
  const descubiertoMonto =
    localDescubiertoMonto ??
    saldoHoy?.descubiertoMonto ??
    ultimoSaldoCompleto?.descubiertoMonto ??
    0;
  const descubiertoUso =
    localDescubiertoUso ??
    saldoHoy?.descubiertoUso ??
    ultimoSaldoCompleto?.descubiertoUso ??
    0;
  const porcentajeDescubiertoUsado =
    descubiertoMonto > 0
      ? ((descubiertoUso / descubiertoMonto) * 100).toFixed(0)
      : "0";

  // Notificar cambios al padre solo cuando cambien los datos
  useEffect(() => {
    onSaldoChange(
      banco.id!,
      saldoActual,
      ultimoSaldo,
      saldoActualId,
      descubiertoMonto,
      descubiertoUso
    );
  }, [
    banco.id,
    saldoActual,
    ultimoSaldo,
    saldoActualId,
    descubiertoMonto,
    descubiertoUso,
    onSaldoChange,
  ]);

  const handleSaldoActualChange = (nuevoMonto: string) => {
    const monto = Number.parseFloat(nuevoMonto) || 0;
    setLocalSaldoActual(monto);

    // Si el saldo es negativo, automáticamente inferir el uso del descubierto
    if (monto < 0) {
      setLocalDescubiertoUso(Math.abs(monto));
    } else {
      // Si el saldo es positivo, resetear el uso del descubierto
      setLocalDescubiertoUso(0);
    }
  };

  const handleDescubiertoChange = (nuevoMonto: string) => {
    const monto = Number.parseFloat(nuevoMonto) || 0;
    setLocalDescubiertoMonto(monto);
  };

  const diferencia = saldoActual - ultimoSaldo;
  const porcentajeCambio =
    ultimoSaldo !== 0
      ? ((diferencia / Math.abs(ultimoSaldo)) * 100).toFixed(1)
      : "0";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <BancoLogo logo={banco.logo} bancoName={banco.nombre} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`font-semibold text-lg ${
                    banco.incluirEnTotal === false
                      ? "italic text-muted-foreground"
                      : ""
                  }`}
                >
                  {banco.nombre}
                </h3>
                {canTransferir && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTransferirClick();
                    }}
                    className="h-8 px-2"
                    title="Transferir a otra cuenta"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 mt-1">
                {banco.alias && (
                  <div
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator.clipboard.writeText(banco.alias!);
                      toast({
                        title: "Copiado",
                        description: "Alias copiado al portapapeles",
                      });
                    }}
                    title="Click para copiar"
                  >
                    <span className="font-medium">Alias:</span>
                    <span>{banco.alias}</span>
                  </div>
                )}
                {banco.cbu && (
                  <div
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator.clipboard.writeText(banco.cbu!);
                      toast({
                        title: "Copiado",
                        description: "CBU copiado al portapapeles",
                      });
                    }}
                    title="Click para copiar"
                  >
                    <span className="font-medium">CBU:</span>
                    <span>{banco.cbu}</span>
                  </div>
                )}
                {banco.nroCuenta && (
                  <div
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator.clipboard.writeText(banco.nroCuenta!);
                      toast({
                        title: "Copiado",
                        description: "Número de cuenta copiado al portapapeles",
                      });
                    }}
                    title="Click para copiar"
                  >
                    <span className="font-medium">Cuenta:</span>
                    <span>{banco.nroCuenta}</span>
                  </div>
                )}
                {banco.tna && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-medium">TNA:</span>
                    <span className="text-primary font-semibold">{banco.tna}%</span>
                  </div>
                )}
                {!banco.alias && !banco.cbu && !banco.nroCuenta && !banco.tna && (
                  <p className="text-xs text-muted-foreground">
                    Cuenta bancaria
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Saldo Actual */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Saldo Actual
            </label>
            <InputMoney
              value={saldoActual}
              onChange={handleSaldoActualChange}
              className={`text-2xl font-bold h-12 ${saldoActual >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            />
          </div>

          {/* Sección de Descubierto */}
          <div className="pt-2">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Descubierto
            </label>
            <div className="relative">
              <InputMoney
                value={descubiertoMonto}
                onChange={handleDescubiertoChange}
                className="text-base font-semibold h-10 text-slate-700 pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-baseline gap-0.5 pointer-events-none">
                <span className="text-lg font-bold text-blue-600">
                  {porcentajeDescubiertoUsado}
                </span>
                <span className="text-xs font-medium text-blue-600">%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BancoChart() {
  const { toast } = useToast();
  const [bancosConSaldos, setBancosConSaldos] = useState<BancoConSaldos[]>([]);
  const [isClosingDay, setIsClosingDay] = useState(false);
  const [modalTransferenciaOpen, setModalTransferenciaOpen] = useState(false);
  const [bancoOrigenSeleccionado, setBancoOrigenSeleccionado] = useState<
    Banco | undefined
  >(undefined);

  const today = getToday();

  const { data: bancos, isLoading: loadingBancos } = useGetBancosQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [],
  });

  // Obtener últimos saldos del backend
  const { data: ultimosSaldosData, isLoading: loadingUltimosSaldos } =
    useGetUltimosSaldosQuery();

  // Obtener TODOS los saldos de una sola vez (para los cards individuales)
  const { data: todosSaldos = [], isLoading: loadingSaldos } =
    useGetBancoSaldosQuery({
      pagination: { pageIndex: 0, pageSize: 10000 },
      columnFilters: [],
      sorting: [{ id: "fecha", desc: true }],
    });

  // Obtener cashflow CON proyecciones
  const {
    data: cashflowConProyeccion,
    isLoading: loadingCashflowConProyeccion,
  } = useGetCashflowResumenSemanaQuery(today, today, true);

  // Obtener cashflow SIN proyecciones
  const {
    data: cashflowSinProyeccion,
    isLoading: loadingCashflowSinProyeccion,
  } = useGetCashflowResumenSemanaQuery(today, today, false);

  const { mutateAsync: actualizarSaldos } = useActualizarSaldosHoyMutation();

  const bancosConLogo = bancos;

  // Función helper para obtener saldos de un banco específico
  const getSaldosPorBanco = (bancoId: number) => {
    const saldosBanco = todosSaldos.filter((s) => s.bancoId === bancoId);
    const saldoHoy = saldosBanco.find((s) => s.fecha === today) || null;
    const saldosAnteriores = saldosBanco
      .filter((s) => s.fecha !== today)
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
    const ultimoSaldo =
      saldosAnteriores[0]?.monto ?? saldosBanco[0]?.monto ?? 0;
    const ultimoSaldoCompleto = saldosAnteriores[0] || saldosBanco[0] || null;

    return { saldoHoy, ultimoSaldo, ultimoSaldoCompleto };
  };
  const handleSaldoChange = useCallback(
    (
      bancoId: number,
      saldoActual: number,
      ultimoSaldo: number,
      saldoActualId?: number,
      descubiertoMonto?: number,
      descubiertoUso?: number
    ) => {
      setBancosConSaldos((prev) => {
        const existing = prev.find((b) => b.id === bancoId);
        if (existing) {
          return prev.map((b) =>
            b.id === bancoId
              ? {
                  ...b,
                  saldoActual,
                  ultimoSaldo,
                  saldoActualId,
                  descubiertoMonto,
                  descubiertoUso,
                }
              : b
          );
        } else {
          const banco = bancosConLogo?.find((b) => b.id === bancoId);
          if (banco) {
            return [
              ...prev,
              {
                ...banco,
                saldoActual,
                ultimoSaldo,
                saldoActualId,
                descubiertoMonto,
                descubiertoUso,
              },
            ];
          }
          return prev;
        }
      });
    },
    [bancosConLogo]
  );

  const handleCerrarDia = async () => {
    setIsClosingDay(true);
    try {
      // Preparar el array de saldos a actualizar
      const saldos = Object.values(bancosConSaldos).map((banco) => ({
        bancoId: banco.id!,
        monto: banco.saldoActual,
        descubiertoMonto: banco.descubiertoMonto,
      }));

      // Usar el nuevo endpoint unificado
      await actualizarSaldos(saldos);

      toast({
        title: "Saldos actualizados correctamente",
        description: `Se guardaron ${saldos.length} saldos exitosamente`,
      });
    } catch (error) {
      console.error("Error actualizando saldos:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los saldos",
        variant: "destructive",
      });
    } finally {
      setIsClosingDay(false);
    }
  };

  // Calcular totales desde el backend
  const totalSaldosActuales = ultimosSaldosData?.total || 0;
  const totalDisponible = ultimosSaldosData?.disponible || 0;

  // Calcular saldos acumulados desde el cashflow (frontend)
  const saldoAcumuladoCashflow =
    cashflowConProyeccion &&
    typeof cashflowConProyeccion === "object" &&
    "proyeccionPorFecha" in cashflowConProyeccion
      ? (
          cashflowConProyeccion as {
            proyeccionPorFecha: Record<string, number>;
          }
        ).proyeccionPorFecha[today] || 0
      : 0;
  const saldoAcumuladoSinProyeccion =
    cashflowSinProyeccion &&
    typeof cashflowSinProyeccion === "object" &&
    "proyeccionPorFecha" in cashflowSinProyeccion
      ? (
          cashflowSinProyeccion as {
            proyeccionPorFecha: Record<string, number>;
          }
        ).proyeccionPorFecha[today] || 0
      : 0;

  // Calcular diferencia (bancos - cashflow sin proyección)
  // Esta diferencia indica el grado de confiabilidad del cashflow
  const diferencia = totalSaldosActuales - saldoAcumuladoSinProyeccion;

  if (
    loadingBancos ||
    loadingUltimosSaldos ||
    loadingSaldos ||
    loadingCashflowConProyeccion ||
    loadingCashflowSinProyeccion
  ) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const handleAbrirModalTransferencia = (banco: Banco) => {
    setBancoOrigenSeleccionado(banco);
    setModalTransferenciaOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Modal de Transferencia */}
      <TransferenciaBancoModal
        open={modalTransferenciaOpen}
        onOpenChange={setModalTransferenciaOpen}
        bancoOrigen={bancoOrigenSeleccionado}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Saldos Bancarios
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona y monitorea tus cuentas bancarias
          </p>
        </div>
        <LoadingButton
          onClick={handleCerrarDia}
          loading={isClosingDay}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Actualizar Saldos
        </LoadingButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Total Bancos</p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p
              className={`text-3xl font-bold ${totalSaldosActuales >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatMoney(totalSaldosActuales)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Saldo real en bancos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-700">
                Crédito Disponible
              </p>
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <p
              className={`text-3xl font-bold ${totalDisponible >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatMoney(totalDisponible)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Descubierto total - Descubierto usado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Acumulado.</p>
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
            <p
              className={`text-3xl font-bold ${saldoAcumuladoSinProyeccion >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatMoney(saldoAcumuladoSinProyeccion)}
            </p>
            <p className="text-xs text-slate-600 mt-1">Cashflow confirmado</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            diferencia >= 0
              ? "from-green-50 to-green-100/50 border-green-200"
              : "from-red-50 to-red-100/50 border-red-200"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm font-medium ${diferencia >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                Diferencia
              </p>
              {diferencia >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p
              className={`text-3xl font-bold ${diferencia >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {diferencia >= 0 ? "+" : ""}
              {formatMoney(diferencia)}
            </p>
            <p
              className={`text-xs mt-1 ${diferencia >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {diferencia >= 0
                ? "Bancos > Cashflow (faltan ingresos)"
                : "Cashflow > Bancos (faltan egresos)"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Cuentas Bancarias</h3>
        {bancos?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay bancos configurados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bancos?.map((banco) => {
              const { saldoHoy, ultimoSaldo, ultimoSaldoCompleto } =
                getSaldosPorBanco(banco.id!);
              return (
                <BancoCard
                  key={banco.id}
                  banco={banco}
                  today={today}
                  saldoHoy={saldoHoy}
                  ultimoSaldo={ultimoSaldo}
                  ultimoSaldoCompleto={ultimoSaldoCompleto}
                  onSaldoChange={handleSaldoChange}
                  onTransferirClick={() => handleAbrirModalTransferencia(banco)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
