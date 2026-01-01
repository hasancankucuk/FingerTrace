import type { FingerPaginationInterface } from "@/models/FingerPaginationInterface"
import { getMergedFingerprints } from "@/services/fingerprint"
import { useQuery } from "@tanstack/react-query"

export const useFingerprintQuery = (workspaceId: string, params: FingerPaginationInterface) => {
    return useQuery({
        queryKey: ["fingerprint", workspaceId, params],
        queryFn: () => getMergedFingerprints(workspaceId, params),
        staleTime: 60000,
        retry: false,
    })
}