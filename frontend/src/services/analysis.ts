import type { AnalysisStats, UsageDetails } from "@/models/AnalysisStats";
import { getToken } from "./auth";
import { httpRequest } from "./http";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const getAnalysis = async (days: number, workspaceId?: string): Promise<AnalysisStats> => {
  const params = new URLSearchParams();
  params.set("days", String(Math.max(1, Math.min(days, 365))));
  if (workspaceId) params.set("workspace_id", String(workspaceId));

  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE_URL}/analysis?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(json?.message || text || `Status ${res.status}`) as Error & { status?: number; body?: unknown };
      err.status = res.status;
      err.body = json ?? text;
      throw err;
    }
    return json as AnalysisStats;
  } catch (e: unknown) {
    if (e instanceof Error && "status" in e) {
      throw e;
    }
    if (!res.ok) {
      const err = new Error(text || `Status ${res.status}`) as Error & { status?: number; body?: unknown };
      err.status = res.status;
      err.body = text;
      throw err;
    }
    throw e;
  }
}

export const getUsageDetails = async (): Promise<UsageDetails> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  return httpRequest<UsageDetails>(`${API_BASE_URL}/analysis/usage`, {
    method: 'GET',
    token,
  });
}