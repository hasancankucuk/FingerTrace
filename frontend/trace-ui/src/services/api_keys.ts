/* eslint-disable @typescript-eslint/no-explicit-any */
export const getApiKeys = async (workspaceId?: string) => {
  const params = new URLSearchParams();
  if (workspaceId) params.set("workspace_id", String(workspaceId));
  const url = `http://localhost:5000/api-keys${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const err: any = new Error(body?.message || `Status ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
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
  if (workspaceId) payload.workspace_id = String(workspaceId);

  const res = await fetch("http://localhost:5000/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const err: any = new Error(body?.message || `Status ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
};

export const deleteApiKey = async (key: string, workspaceId?: string) => {
  const params = new URLSearchParams();
  if (workspaceId) params.set("workspace_id", String(workspaceId));
  const url = `http://localhost:5000/api-keys/${encodeURIComponent(key)}${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const err: any = new Error(body?.message || `Status ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
};