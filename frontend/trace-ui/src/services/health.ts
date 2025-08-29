import type { HealthResponse } from "@/models/HealthResponse";
import { httpRequest } from "./http";
import { getToken } from "./auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const token = getToken();
    const response = await httpRequest<HealthResponse>(`${API_BASE_URL}/health`, {
      method: "GET",
      token,
    });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Health check failed";
    console.error("Health check error:", message);
    throw new Error(message);
  }
};