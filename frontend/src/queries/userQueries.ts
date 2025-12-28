import type { User } from "@/models/UserInterface";
import { getCurrentUser } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";


export const useUserQuery = () => {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};