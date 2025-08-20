import { useEffect, useState, useCallback } from "react";
import type { WorkspacesType } from "@/models/Workspaces";

export function useWorkspace() {
  const [workspace, setWorkspaceState] = useState<WorkspacesType | null>(() => {
    try {
      const raw = localStorage.getItem("selectedWorkspace");
      return raw ? (JSON.parse(raw) as WorkspacesType) : null;
    } catch {
      return null;
    }
  });

  const setWorkspace = useCallback((ws: WorkspacesType | null) => {
    try {
      if (ws) localStorage.setItem("selectedWorkspace", JSON.stringify(ws));
      else localStorage.removeItem("selectedWorkspace");
      window.dispatchEvent(new CustomEvent("workspaceChanged", { detail: ws }));
    } catch {
      console.error("Error setting workspace:", ws);
    }
    setWorkspaceState(ws);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as WorkspacesType | null;
      setWorkspaceState(detail ?? null);
    };
    window.addEventListener("workspaceChanged", handler as EventListener);
    return () =>
      window.removeEventListener("workspaceChanged", handler as EventListener);
  }, []);

  return { workspace, setWorkspace };
}
