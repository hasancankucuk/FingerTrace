/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./auth";
import { httpRequest } from "./http";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export const getApiKeys = async (workspaceId: string) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  return httpRequest<{workspaceId: string}>(
    `${API_BASE_URL}/api-keys?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    token,
  });
};


export const createApiKey = async (
  data: {
    name: string;
    environment?: string;
    status?: string;
    workspace_id?: string;
    workspace_name?: string;
  },
  workspaceId?: string
) => {
  const payload = { ...data };
  if (workspaceId) payload.workspace_id = String(workspaceId)

  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE_URL}/api-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return body;
};

export const deleteApiKey = async (key: string, workspaceId?: string) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const url = workspaceId
    ? `${API_BASE_URL}/api-keys/${encodeURIComponent(key)}?workspace_id=${encodeURIComponent(workspaceId)}`
    : `${API_BASE_URL}/api-keys/${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return body;
};