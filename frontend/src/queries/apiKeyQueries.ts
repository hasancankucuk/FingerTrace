import { getApiKeys } from "@/services/api_keys";
import { useQuery } from "@tanstack/react-query";
import type { ApiKey } from "@/utils/apiHelpers";

export const useGetApiKeysQuery = (workspaceId: string) => {
   return useQuery<ApiKey[], Error>({
    queryKey: ['api-keys', workspaceId],
    queryFn: () => getApiKeys(workspaceId),
    staleTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!workspaceId,
   });
};