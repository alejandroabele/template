import { ContactoProximo, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper';

const basePath = 'contacto-proximo';

const fetch = async (query: Query): Promise<ContactoProximo[]> => {
  return fetchClient<ContactoProximo[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<ContactoProximo> => {
  return fetchClient<ContactoProximo>(`${basePath}/${id}`, 'GET');
};

const create = async (body: ContactoProximo): Promise<ContactoProximo> => {
  return fetchClient<ContactoProximo>(basePath, 'POST', body);
};

const edit = async (id: number, body: ContactoProximo): Promise<ContactoProximo> => {
  return fetchClient<ContactoProximo>(`${basePath}/${id}`, 'PATCH', body);
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
