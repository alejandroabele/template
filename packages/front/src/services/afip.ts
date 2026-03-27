import fetchClient from '@/lib/api-client';
import { PadronData } from '@/types';

const getPadron = async (cuit: string): Promise<PadronData> => {
  return fetchClient<PadronData>(`afip/padron?cuit=${cuit}`, 'GET');
};

export {
  getPadron
};
