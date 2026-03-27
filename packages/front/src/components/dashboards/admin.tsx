// import { GlobalState } from "@/components/global-state";
import { AlquilerCobrosFacturacionMensualChart } from "@/components/charts/alquiler/alquiler-cobros-facturacion-mensual-chart";
import { AlquilerCantidadTiposChart } from "@/components/charts/alquiler/alquiler-cantidad-tipos.chart";
import { AlquilerEstadosChart } from "@/components/charts/alquiler/alquiler-estados-chart";
import { PageTitle } from "@/components/ui/page-title";
export default function Dashboard() {
  return (
    <>
      <PageTitle title="Indicadores de Alquileres" />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-4">
        {/* <AlquilerCobrosFacturacionMensualChart /> */}

        <AlquilerCantidadTiposChart />

        <AlquilerEstadosChart />

        {/* <GlobalState /> */}
      </div>
    </>
  );
}
