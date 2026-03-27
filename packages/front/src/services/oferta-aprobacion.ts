import { OfertaAprobacion } from '@/types';
import fetchClient from '@/lib/api-client';

const basePath = 'oferta-aprobacion'

const fetchByOferta = async (ofertaId: number): Promise<OfertaAprobacion[]> => {
    return fetchClient<OfertaAprobacion[]>(`${basePath}/oferta/${ofertaId}`, 'GET');
};

const aprobar = async (id: number, motivo?: string): Promise<OfertaAprobacion> => {
    return fetchClient<OfertaAprobacion>(`${basePath}/${id}/aprobar`, 'POST', { motivo });
};

const rechazar = async (id: number, motivo: string): Promise<OfertaAprobacion> => {
    return fetchClient<OfertaAprobacion>(`${basePath}/${id}/rechazar`, 'POST', { motivo });
};

export {
    fetchByOferta,
    aprobar,
    rechazar
};
