import { CentroCosto, Query } from "@/types";
import fetchClient from "@/lib/api-client";
import { generateQueryParams } from "@/utils/query-helper";

const basePath = "centro-costo";

export const fetch = async (query: Query): Promise<CentroCosto[]> => {
    return fetchClient<CentroCosto[]>(`${basePath}?${generateQueryParams(query)}`, "GET");
};

export const fetchById = async (id: number): Promise<CentroCosto> => {
    return fetchClient<CentroCosto>(`${basePath}/${id}`, "GET");
};

export const create = async (data: CentroCosto): Promise<CentroCosto> => {
    return fetchClient<CentroCosto>(`${basePath}`, "POST", data);
};

export const edit = async (id: number, data: CentroCosto): Promise<CentroCosto> => {
    return fetchClient<CentroCosto>(`${basePath}/${id}`, "PATCH", data);
};

export const remove = async (id: number): Promise<void> => {
    return fetchClient<void>(`${basePath}/${id}`, "DELETE");
};
