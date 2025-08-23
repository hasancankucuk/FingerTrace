/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./auth";
import { httpRequest } from "./http";

export const getApiKeys = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  return httpRequest<{workspace_id: string}>(
    'http://localhost:5000/api-keys', {
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

  const res = await fetch("http://localhost:5000/api-keys", {
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

export const deleteApiKey = async (key: string) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:5000/api-keys/${encodeURIComponent(key)}`, {
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