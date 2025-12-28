import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export function useWorkspace() {
  const workspace = useWorkspaceStore((state) => state.workspace);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  return { workspace, setWorkspace };
}
