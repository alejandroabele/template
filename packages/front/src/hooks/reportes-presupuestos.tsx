import { useQuery } from "@tanstack/react-query";
import {
  fetchVentasSemanales,
  fetchVentasPorCliente,
  fetchPresupuestosPorCliente,
  fetchAuditablesSemanales,
  fetchAuditablesSemanalesCantidad,
  fetchAuditablesPorCliente,
  fetchPresupuestosAuditablesCliente,
  fetchCantidadPresupuestosPorCambioFecha,
} from "@/services/reportes-presupuestos";

export const useGetVentasSemanalesQuery = (
  anio: number,
  mes: number,
  procesosGenerales?: number[],
  campoFecha?: string
) => {
  return useQuery({
    queryKey: ["ventas-semanales", anio, mes, procesosGenerales, campoFecha],
    queryFn: () =>
      fetchVentasSemanales(anio, mes, procesosGenerales, campoFecha),
  });
};

export const useGetVentasPorClienteQuery = (
  anio: number,
  mes: number,
  semana: number,
  procesosGenerales?: number[],
  campoFecha?: string
) => {
  return useQuery({
    queryKey: [
      "ventas-por-cliente",
      anio,
      mes,
      semana,
      procesosGenerales,
      campoFecha,
    ],
    queryFn: () =>
      fetchVentasPorCliente(anio, mes, semana, procesosGenerales, campoFecha),
    enabled: !!(anio && mes && semana),
  });
};

export const useGetPresupuestosPorClienteQuery = (
  anio: number,
  mes: number,
  semana: number,
  clienteId: number,
  procesosGenerales?: number[],
  campoFecha?: string
) => {
  return useQuery({
    queryKey: [
      "presupuestos-por-cliente",
      anio,
      mes,
      semana,
      clienteId,
      procesosGenerales,
      campoFecha,
    ],
    queryFn: () =>
      fetchPresupuestosPorCliente(
        anio,
        mes,
        semana,
        clienteId,
        procesosGenerales,
        campoFecha
      ),
    enabled: !!(anio && mes && semana && clienteId),
  });
};

export const useGetAuditablesSemanalesQuery = (options: {
  anio?: number;
  mes?: number;
  procesosGenerales?: number[];
  modo?: "semanal" | "mensual";
  from?: string;
  to?: string;
  variante?: string;
}) => {
  return useQuery({
    queryKey: [
      "facturacion-semanales",
      options.anio,
      options.mes,
      options.procesosGenerales,
      options.modo,
      options.from,
      options.to,
    ],
    queryFn: () => fetchAuditablesSemanales(options),
  });
};

export const useGetAuditablesSemanalesCantidadQuery = (options: {
  anio?: number;
  mes?: number;
  procesosGenerales?: number[];
  modo?: "semanal" | "mensual";
  from?: string;
  to?: string;
  variante?: string;
}) => {
  return useQuery({
    queryKey: [
      "facturacion-semanales-cantidad",
      options.anio,
      options.mes,
      options.procesosGenerales,
      options.modo,
      options.from,
      options.to,
    ],
    queryFn: () => fetchAuditablesSemanalesCantidad(options),
  });
};

export const useGetAuditablesPorClienteQuery = (
  anio: number,
  mes: number,
  semana: number,
  procesosGenerales?: number[],
  variante?: string
) => {
  return useQuery({
    queryKey: ["facturacion-por-cliente", anio, mes, semana, procesosGenerales],
    queryFn: () =>
      fetchAuditablesPorCliente(anio, mes, semana, procesosGenerales, variante),
    enabled: !!(anio && mes && semana),
  });
};

export const useGetPresupuestosAuditablesClienteQuery = (
  anio: number,
  mes: number,
  semana: number,
  clienteId: number,
  procesosGenerales?: number[],
  variante?: string
) => {
  return useQuery({
    queryKey: [
      "presupuestos-facturacion-cliente",
      anio,
      mes,
      semana,
      clienteId,
      procesosGenerales,
    ],
    queryFn: () =>
      fetchPresupuestosAuditablesCliente(
        anio,
        mes,
        semana,
        clienteId,
        procesosGenerales,
        variante
      ),
    enabled: !!(anio && mes && semana && clienteId),
  });
};

export const useGetCantidadPresupuestosPorCambioFechaQuery = (options: {
  anio?: number;
  mes?: number;
  procesosGenerales?: number[];
  modo?: "semanal" | "mensual";
  from?: string;
  to?: string;
  variante?: string;
}) => {
  return useQuery({
    queryKey: [
      "cantidad-semanales",
      options.anio,
      options.mes,
      options.procesosGenerales,
      options.modo,
      options.from,
      options.to,
    ],
    queryFn: () => fetchCantidadPresupuestosPorCambioFecha(options),
  });
};
