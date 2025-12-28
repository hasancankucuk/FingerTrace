import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/services/workspaces";
import type { WorkspacesType } from "@/models/Workspaces";

export const useWorkspacesQuery = () => {
  return useQuery<WorkspacesType[], Error>({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    staleTime: 5 * 60 * 1000,
  });
};