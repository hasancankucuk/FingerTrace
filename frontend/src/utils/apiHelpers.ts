// src/utils/apiHelpers.ts

export type ApiKey = {
  name: string;
  key: string;
  created_at: string;
  environment: string;
  status: string;
  workspace_id?: string;
};

export const isObject = (o: unknown): o is Record<string, unknown> => typeof o === "object" && o !== null;
export const isApiKey = (o: unknown): o is ApiKey => isObject(o) && typeof (o as Record<string, unknown>).key === "string";
export const isApiKeyArray = (o: unknown): o is ApiKey[] => Array.isArray(o) && o.every(isApiKey);

export const getErrorMessage = (err: unknown): string => {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return String(err); }
};
