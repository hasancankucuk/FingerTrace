/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export function useWorkspace() {
  const workspace = useWorkspaceStore((state: { workspace: any; }) => state.workspace);
  const setWorkspace = useWorkspaceStore((state: { setWorkspace: any; }) => state.setWorkspace);
  return { workspace, setWorkspace };
}
