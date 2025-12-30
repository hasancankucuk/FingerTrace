import type { AnomalyRules } from "@/models/AnomalyRules";
import { getAnomalyRules } from "@/services/anomalies";
import { useQuery } from "@tanstack/react-query";

export const useAnomalyRulesQuery = (workspaceId: string) => {
    return useQuery<AnomalyRules[], Error>({
        queryKey: ['anomaly-rules', workspaceId],
        queryFn: () => getAnomalyRules(workspaceId),
        staleTime: 10 * 60 * 1000,
        retry: false,
        enabled: !!workspaceId,
    });
};