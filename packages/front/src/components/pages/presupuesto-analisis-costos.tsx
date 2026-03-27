"use client";

import { PresupuestoMaterialesTable } from "@/components/tables/presupuesto-materiales-table";
import { PresupuestoSuministrosTable } from "@/components/tables/presupuesto-suministros-table";
import { PresupuestoManoDeObraTable } from "@/components/tables/presupuesto-mano-de-obra-table";
import { PresupuestoProductosExtrasTable } from "@/components/tables/presupuesto-productos-extras-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, Users, Plus } from "lucide-react";
import { hasPermission } from "@/hooks/use-access";

import { PERMISOS } from "@/constants/permisos";

interface PresupuestoAnalisisCostosProps {
  presupuestoId: number;
}

export const PresupuestoAnalisisCostos = ({
  presupuestoId,
}: PresupuestoAnalisisCostosProps) => {
  const isAdmin = hasPermission(
    PERMISOS.PRESUPUESTOS_VER_MANO_DE_OBRA_ANALISIS
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Materiales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PresupuestoMaterialesTable presupuestoId={presupuestoId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            Suministros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PresupuestoSuministrosTable presupuestoId={presupuestoId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Productos Extras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PresupuestoProductosExtrasTable presupuestoId={presupuestoId} />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Mano de Obra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PresupuestoManoDeObraTable presupuestoId={presupuestoId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
