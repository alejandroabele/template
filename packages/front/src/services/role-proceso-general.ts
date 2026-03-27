import { RoleProcesoGeneral, Query } from '@/types';
import fetchClient from '@/lib/api-client';
import { generateQueryParams } from '@/utils/query-helper'

const basePath = 'role-proceso-general'

const fetch = async (query: Query): Promise<RoleProcesoGeneral[]> => {
    return fetchClient<RoleProcesoGeneral[]>(`${basePath}?${generateQueryParams(query)}`, 'GET');
};

const fetchById = async (id: number): Promise<RoleProcesoGeneral> => {
    return fetchClient<RoleProcesoGeneral>(`${basePath}/${id}`, 'GET');
};

const fetchByRoleId = async (roleId: number): Promise<number[]> => {
    return fetchClient<number[]>(`${basePath}/by-role/${roleId}`, 'GET');
};

const create = async (body: Partial<RoleProcesoGeneral>): Promise<RoleProcesoGeneral> => {
    return fetchClient<RoleProcesoGeneral>(basePath, 'POST', body);
};

const edit = async (id: number, body: Partial<RoleProcesoGeneral>): Promise<RoleProcesoGeneral> => {
    return fetchClient<RoleProcesoGeneral>(`${basePath}/${id}`, 'PATCH', body);
};

const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, 'DELETE');
};

const removeByRoleAndProceso = async (roleId: number, procesoGeneralId: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/by-role-proceso/${roleId}/${procesoGeneralId}`, 'DELETE');
};

export {
    fetch,
    fetchById,
    fetchByRoleId,
    create,
    edit,
    remove,
    removeByRoleAndProceso
};
