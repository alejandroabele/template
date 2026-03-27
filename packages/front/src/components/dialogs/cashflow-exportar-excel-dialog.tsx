"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";
import { exportarExcel } from "@/services/cashflow-transaccion";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";

type Modo = "dia" | "semana" | "mes" | "trimestre";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MODOS: { value: Modo; label: string }[] = [
  { value: "dia", label: "Diario" },
  { value: "semana", label: "Semanal" },
  { value: "mes", label: "Mensual" },
  { value: "trimestre", label: "Trimestral" },
];

export function CashflowExportarExcelDialog({ open, onOpenChange }: Props) {
  const hoy = format(new Date(), "yyyy-MM-dd");
  const hace30Dias = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const [from, setFrom] = useState(hace30Dias);
  const [to, setTo] = useState(hoy);
  const [modo, setModo] = useState<Modo>("dia");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDescargar = async () => {
    if (!from || !to) {
      toast({ title: "Completá las fechas", variant: "destructive" });
      return;
    }
    if (from > to) {
      toast({ title: "La fecha desde no puede ser mayor que la fecha hasta", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const blob = await exportarExcel(from, to, modo);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cashflow_${from}_${to}_${modo}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      onOpenChange(false);
    } catch {
      toast({ title: "Error al generar el reporte", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Exportar Cashflow a Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Desde</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hasta</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Agrupación</Label>
            <Select value={modo} onValueChange={(v) => setModo(v as Modo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODOS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDescargar} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
