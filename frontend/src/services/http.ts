import { logout } from "./auth";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

export const httpRequest = async <T>(url: string, options: HttpOptions = {}): Promise<T> => {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const errorData = data as Record<string, unknown> | null;
    const errMsg = (errorData?.error as string) || (errorData?.message as string) || `${res.status} ${res.statusText}`;
    throw new Error(errMsg);
  }

  return data as T;
};