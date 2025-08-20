/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllFingerprints = async () => {
  try {
    const res = await fetch("http://localhost:5000/fingerprints", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Failed to retrieve fingerprints");

    return result;
  } catch (error: any) {
    console.error("Fingerprint retrieval error:", error);
    throw new Error(error?.message || "Failed to retrieve fingerprints");
  }
}

export const getFingerprintById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5000/fingerprints/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Failed to retrieve fingerprint");

    return result;
  } catch (error: any) {
    console.error("Fingerprint retrieval error:", error);
    throw new Error(error?.message || "Failed to retrieve fingerprint");
  }
}

export const getMergedFingerprints = async (workspaceId?: string) => {
  try {
    const base = "http://localhost:5000/fingerprints/merged";
    const url = workspaceId ? `${base}?workspace_id=${encodeURIComponent(workspaceId)}` : base;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Failed to retrieve merged fingerprints");
    return result;
  } catch (error: any) {
    console.error("Merged fingerprint retrieval error:", error);
    throw new Error(error?.message || "Failed to retrieve merged fingerprints");
  }
}
