import type { WorkspacesType } from "@/models/Workspaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkspaceState {
  workspace: WorkspacesType | null;
  setWorkspace: (ws: WorkspacesType | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspace: null,
      setWorkspace: (ws) => set({ workspace: ws }),
    }),
    {
      name: 'workspace-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
