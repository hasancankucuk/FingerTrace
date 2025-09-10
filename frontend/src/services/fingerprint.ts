/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./auth";
import { httpRequest } from "./http";
import type { MergedFingerprint } from "@/models/IdentificationData";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  search?: {
    query: string;
    filtered_items: number;
    total_items: number;
  };
}

export interface FingerprintParams {
  workspace_id?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
  search?: string;
}

export const getMergedFingerprints = async (
  workspaceId: string,
  params: Omit<FingerprintParams, "workspace_id"> = {}
): Promise<PaginatedResponse<MergedFingerprint>> => {
  const token = getToken();

  const queryParams = new URLSearchParams({
    workspace_id: workspaceId,
    page: (params.page || 1).toString(),
    page_size: (params.page_size || 10).toString(),
    sort_field: params.sort_field || "created_at",
    sort_direction: params.sort_direction || "desc",
    ...(params.search && { search: params.search }),
  });

  return httpRequest(`${API_BASE_URL}/fingerprints/merged?${queryParams}`, {
    method: "GET",
    token,
  });
};

// Legacy function for backward compatibility
export const getMergedFingerprintsLegacy = async (
  workspaceId: string
): Promise<MergedFingerprint[]> => {
  const response = await getMergedFingerprints(workspaceId, { page_size: 1000 });
  return response.data;
};

export type FingerprintType = any;

export const getAllFingerprints = async (): Promise<FingerprintType[]> => {
  return httpRequest<FingerprintType[]>(`${API_BASE_URL}/fingerprints`, {
    method: "GET",
    token: getToken(),
  });
};

export const getFingerprintById = async (id: string): Promise<FingerprintType> => {
  return httpRequest<FingerprintType>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "GET",
    token: getToken(),
  });
};

export const createFingerprint = async (
  data: any
): Promise<{ message: string; id: string }> => {
  return httpRequest<{ message: string; id: string }>(`${API_BASE_URL}/fingerprints`, {
    method: "POST",
    body: data,
    token: getToken(),
  });
};

export const updateFingerprint = async (
  id: string,
  data: any
): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "PUT",
    body: data,
    token: getToken(),
  });
};

export const deleteFingerprint = async (id: string): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "DELETE",
    token: getToken(),
  });
};