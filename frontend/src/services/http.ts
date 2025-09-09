/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout } from "./auth";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpOptions {
    method?: HttpMethod;
    body?: any;
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

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // error mesajını backend’den alabiliyorsak al, yoksa status + statusText kullan
    const errMsg = data?.error || data?.message || `${res.status} ${res.statusText}`;
    throw new Error(errMsg);
  }

  return data as T;
};