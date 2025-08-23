/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./auth";
import { httpRequest } from "./http";

export type FingerprintType = any;

export const getAllFingerprints = async (): Promise<FingerprintType[]> => {
  return httpRequest<FingerprintType[]>("http://localhost:5000/fingerprints", {
    method: "GET",
    token: getToken()
  });
};

export const getFingerprintById = async (id: string): Promise<FingerprintType> => {
  return httpRequest<FingerprintType>(`http://localhost:5000/fingerprints/${id}`, {
    method: "GET",
    token: getToken(),
  });
};

export const getMergedFingerprints = async (workspaceId?: string): Promise<FingerprintType[]> => {
  const base = "http://localhost:5000/fingerprints/merged";
  const url = workspaceId ? `${base}?workspace_id=${encodeURIComponent(workspaceId)}` : base;

  return httpRequest<FingerprintType[]>(url, {
    method: "GET",
    token: getToken()
  });
};

export const createFingerprint = async (data: any): Promise<{ message: string; id: string }> => {
  return httpRequest<{ message: string; id: string }>("http://localhost:5000/fingerprints", {
    method: "POST",
    body: data,
    token: getToken()
  });
};

export const updateFingerprint = async (id: string, data: any): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`http://localhost:5000/fingerprints/${id}`, {
    method: "PUT",
    body: data,
    token: getToken()
  });
};

export const deleteFingerprint = async (id: string): Promise<{ message: string }> => {
  return httpRequest<{ message: string }>(`http://localhost:5000/fingerprints/${id}`, {
    method: "DELETE",
    token: getToken()
  });
};