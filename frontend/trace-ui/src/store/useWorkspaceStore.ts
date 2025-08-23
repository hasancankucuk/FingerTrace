import { create } from "zustand";
import type { WorkspacesType } from "@/models/Workspaces";

interface WorkspaceState {
  workspace: WorkspacesType | null;
  setWorkspace: (ws: WorkspacesType | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: null,
  setWorkspace: (ws) => set({ workspace: ws }),
}));
