import type { HealthResponse } from "@/models/HealthResponse";
import { httpRequest } from "./http";
import { getToken } from "./auth";

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const token = getToken();
    const response = await httpRequest<HealthResponse>("http://localhost:5000/health", {
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