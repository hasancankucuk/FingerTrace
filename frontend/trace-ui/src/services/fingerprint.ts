/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./auth";
import { httpRequest } from "./http";
  
const API_BASE_URL = import.meta.env.VITE_API_URL;
export type FingerprintType = any;

export const getAllFingerprints = async (): Promise<FingerprintType[]> => {
  return httpRequest<FingerprintType[]>(`${API_BASE_URL}/fingerprints`, {
    method: "GET",
    token: getToken()
  });
};

export const getFingerprintById = async (id: string): Promise<FingerprintType> => {
  return httpRequest<FingerprintType>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "GET",
    token: getToken(),
  });
};

export const getMergedFingerprints = async (workspaceId?: string): Promise<FingerprintType[]> => {
  const base = `${API_BASE_URL}/fingerprints/merged`;
  const url = workspaceId ? `${base}?workspace_id=${encodeURIComponent(workspaceId)}` : base;

  return httpRequest<FingerprintType[]>(url, {
    method: "GET",
    token: getToken()
  });
};

export const createFingerprint = async (data: any): Promise<{ message: string; id: string }> => {
  return httpRequest<{ message: string; id: string }>(`${API_BASE_URL}/fingerprints`, {
    method: "POST",
    body: data,
    token: getToken()
  });
};

export const updateFingerprint = async (id: string, data: any): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "PUT",
    body: data,
    token: getToken()
  });
};

export const deleteFingerprint = async (id: string): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`${API_BASE_URL}/fingerprints/${id}`, {
    method: "DELETE",
    token: getToken()
  });
};