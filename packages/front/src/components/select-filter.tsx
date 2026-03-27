import React from "react";
import { AlquilerEstadoFacturacionSelector } from "@/components/selectors/alquiler-estado-facturacion-selector";
import { AlquilerEstadoCobranzasSelector } from "@/components/selectors/alquiler-estado-cobranzas-selector";
import { AlquilerEstadoSelector } from "@/components/selectors/alquiler-estado-selector";
import { PermisosSelector } from "@/components/selectors/permisos-selector";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { HookSelector } from "./selectors/hook-selector";
import { useGetAreasQuery } from "@/hooks/area";
import { useGetProcesoGeneralQuery } from "@/hooks/proceso-general";
import { StringSelector } from "./selectors/string-selector";
import { PeriodicidadActualizacion } from "./selectors/periodicidad-actualizacion-selector";
import { CondicionIVASelector } from "./selectors/condicion-iva-selector";
import { CentroCostoSelector } from "./selectors/centro-costo-simple-selector";
interface AlquilerEstadoFilterProps<T> {
  table: TableType<T>;
  columnId: string;
  type?: string;
}
function SelectFilter<T>({
  table,
  columnId,
  type,
}: AlquilerEstadoFilterProps<T>) {
  const [selected, setSelected] = React.useState<string>("");
  const defaultValue =
    (table.getState().columnFilters.find((element) => element.id === columnId)
      ?.value as string) || "";

  React.useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const handleSelectedCategoria = (value: string) => {
    setSelected(value);

    table.setColumnFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter(
        (filter) => filter.id !== columnId
      );
      if (value) {
        updatedFilters.push({ id: columnId, value: value });
      }
      return updatedFilters;
    });
  };

  const selectorMap: Record<string, JSX.Element> = {
    estadoFacturacion: (
      <AlquilerEstadoFacturacionSelector
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    estado: (
      <AlquilerEstadoSelector
        value={selected}
        type={type}
        onChange={handleSelectedCategoria}
      />
    ),
    permiso: (
      <PermisosSelector value={selected} onChange={handleSelectedCategoria} />
    ),
    ["procesoGeneral.nombre"]: (
      <HookSelector
        hook={useGetProcesoGeneralQuery}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    ["area.nombre"]: (
      <HookSelector
        hook={useGetAreasQuery}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    costeoEstatus: (
      <StringSelector
        options={["PENDIENTE", "COMPLETO"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    costeoComercialEstatus: (
      <StringSelector
        options={["PENDIENTE", "COMPLETO"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    facturacionEstatus: (
      <StringSelector
        options={["PENDIENTE", "PARCIAL", "TOTAL"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    cobranzaEstatus: (
      <StringSelector
        options={["PENDIENTE", "PARCIAL", "TOTAL"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    produccionEstatus: (
      <StringSelector
        options={["PENDIENTE", "COMPLETO"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    ["items.tipo"]: (
      <StringSelector
        options={["SERVICIO", "PRODUCCION", "MANTENIMIENTO"]}
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    periodicidadActualizacion: (
      <PeriodicidadActualizacion
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    condicionFrenteIva: (
      <CondicionIVASelector
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    ["solcomCentro.id"]: (
      <CentroCostoSelector
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
    default: (
      <AlquilerEstadoCobranzasSelector
        value={selected}
        onChange={handleSelectedCategoria}
      />
    ),
  };
  return (
    <div className="mt-2">{selectorMap[columnId] || selectorMap.default}</div>
  );
}
export { SelectFilter };
