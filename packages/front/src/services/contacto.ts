import { Contacto, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'contacto';

const fetch = async (query: Query): Promise<Contacto[]> => {
  return fetchClient<Contacto[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<Contacto> => {
  return fetchClient<Contacto>(`${basePath}/${id}`, 'GET');
};

const create = async (body: Contacto): Promise<Contacto> => {
  return fetchClient<Contacto>(basePath, 'POST', body);
};

const edit = async (id: number, body: Contacto): Promise<Contacto> => {
  return fetchClient<Contacto>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
  return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

export {
  fetch,
  fetchById,
  create,
  edit,
  remove
};
