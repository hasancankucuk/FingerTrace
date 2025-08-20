/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAnalysis(days: number, workspaceId?: string, apiKey?: string) {
  const params = new URLSearchParams();
  params.set("days", String(Math.max(1, Math.min(days, 365))));
  if (workspaceId) params.set("workspace_id", String(workspaceId));

  const url = `/analysis?${params.toString()}`;
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err: any = new Error(json?.message || text || `Status ${res.status}`);
      err.status = res.status;
      err.body = json ?? text;
      throw err;
    }
    return json;
  } catch (e: any) {
    if (!res.ok) {
      const err: any = new Error(text || `Status ${res.status}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    // if parsing failed but status ok, return raw text
    return text;
  }
}
