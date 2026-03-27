import fetchClient from '@/lib/api-client';

export interface VentaSemanal {
    semana?: number; // Opcional para retrocompatibilidad
    periodo?: string; // Nuevo campo para modo mensual 
    totalVentas: number;
    cantidadPresupuestos: number;
}

export interface CantidadSemanal {
    semana?: number; // Opcional para retrocompatibilidad
    periodo?: string; // Nuevo campo para modo mensual 
    totalVentas: number;
    cantidadPresupuestos: number;
}

export interface VentaCliente {
    clienteId: string | number;
    clienteNombre: string;
    totalVentas: number;
    cantidadPresupuestos: number;
}

export interface PresupuestoCliente {
    id: number;
    ventaTotal: number;
    fecha: string;
    fechaDesdeProceso: string;
    cliente: {
        id: number;
        nombre: string;
    };
}

const basePath = 'presupuesto'

const fetchVentasSemanales = async (anio: number, mes: number, procesosGenerales?: number[], campoFecha?: string): Promise<VentaSemanal[]> => {
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const campo = campoFecha ? `&campoFecha=${campoFecha}` : '';
    return fetchClient<VentaSemanal[]>(`${basePath}/ventas-semanales?anio=${anio}&mes=${mes}${procesos}${campo}`, 'GET');
};

const fetchVentasPorCliente = async (anio: number, mes: number, semana: number, procesosGenerales?: number[], campoFecha?: string): Promise<VentaCliente[]> => {
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const campo = campoFecha ? `&campoFecha=${campoFecha}` : '';
    return fetchClient<VentaCliente[]>(`${basePath}/ventas-por-cliente?anio=${anio}&mes=${mes}&semana=${semana}${procesos}${campo}`, 'GET');
};

const fetchPresupuestosPorCliente = async (anio: number, mes: number, semana: number, clienteId: number, procesosGenerales?: number[], campoFecha?: string): Promise<PresupuestoCliente[]> => {
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const campo = campoFecha ? `&campoFecha=${campoFecha}` : '';
    return fetchClient<PresupuestoCliente[]>(`${basePath}/presupuestos-por-cliente?anio=${anio}&mes=${mes}&semana=${semana}&clienteId=${clienteId}${procesos}${campo}`, 'GET');
};

const fetchAuditablesSemanales = async (options: { anio?: number; mes?: number; procesosGenerales?: number[]; modo?: 'semanal' | 'mensual'; from?: string; to?: string; variante?: boolean }): Promise<VentaSemanal[]> => {
    const { anio, mes, procesosGenerales, modo, from, to, variante } = options;
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const modoParam = modo ? `&modo=${modo}` : '';
    const anioParam = anio ? `&anio=${anio}` : '';
    const mesParam = mes ? `&mes=${mes}` : '';
    const varianteParam = variante ? `&variante=${variante}` : '';
    const rango = from && to ? `&from=${from}&to=${to}` : '';
    return fetchClient<VentaSemanal[]>(`${basePath}/auditoria-semanales?${anioParam}${mesParam}${procesos}${modoParam}${rango}${varianteParam}`, 'GET');
};

const fetchAuditablesSemanalesCantidad = async (options: { anio?: number; mes?: number; procesosGenerales?: number[]; modo?: 'semanal' | 'mensual'; from?: string; to?: string; variante?: boolean }): Promise<CantidadSemanal[]> => {
    const { anio, mes, procesosGenerales, modo, from, to, variante } = options;
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const modoParam = modo ? `&modo=${modo}` : '';
    const anioParam = anio ? `&anio=${anio}` : '';
    const mesParam = mes ? `&mes=${mes}` : '';
    const varianteParam = variante ? `&variante=${variante}` : '';
    const rango = from && to ? `&from=${from}&to=${to}` : '';
    return fetchClient<CantidadSemanal[]>(`${basePath}/auditoria-semanales-cantidad?${anioParam}${mesParam}${procesos}${modoParam}${rango}${varianteParam}`, 'GET');
};

const fetchAuditablesPorCliente = async (anio: number, mes: number, semana: number, procesosGenerales?: number[], variante?: string): Promise<VentaCliente[]> => {
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const varianteParam = variante ? `&variante=${variante}` : '';

    return fetchClient<VentaCliente[]>(`${basePath}/auditoria-por-cliente?anio=${anio}&mes=${mes}&semana=${semana}${procesos}${varianteParam}`, 'GET');
};

const fetchPresupuestosAuditablesCliente = async (anio: number, mes: number, semana: number, clienteId: number, procesosGenerales?: number[], variante?: string): Promise<PresupuestoCliente[]> => {
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const varianteParam = variante ? `&variante=${variante}` : '';

    return fetchClient<PresupuestoCliente[]>(`${basePath}/presupuestos-auditoria-cliente?anio=${anio}&mes=${mes}&semana=${semana}&clienteId=${clienteId}${procesos}${varianteParam}`, 'GET');
};

const fetchCantidadPresupuestosPorCambioFecha = async (options: { anio?: number; mes?: number; procesosGenerales?: number[]; modo?: 'semanal' | 'mensual'; from?: string; to?: string; variante?: string }): Promise<VentaSemanal[]> => {
    const { anio, mes, procesosGenerales, modo, from, to, variante } = options;
    const procesos = procesosGenerales ? `&procesos=${procesosGenerales.join(',')}` : '';
    const modoParam = modo ? `&modo=${modo}` : '';
    const anioParam = anio ? `&anio=${anio}` : '';
    const mesParam = mes ? `&mes=${mes}` : '';
    const rango = from && to ? `&from=${from}&to=${to}` : '';
    const varianteParam = variante ? `&variante=${variante}` : '';
    return fetchClient<VentaSemanal[]>(`${basePath}/cantidad-semanales?${anioParam}${mesParam}${procesos}${modoParam}${rango}${varianteParam}`, 'GET');
};

export {
    fetchVentasSemanales,
    fetchVentasPorCliente,
    fetchPresupuestosPorCliente,
    fetchAuditablesSemanales,
    fetchAuditablesSemanalesCantidad,
    fetchAuditablesPorCliente,
    fetchPresupuestosAuditablesCliente,
    fetchCantidadPresupuestosPorCambioFecha
};
