import { getInvitations } from "@/services/invitations";
import { useQuery } from "@tanstack/react-query";

export const useInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: () => getInvitations(),
    staleTime: 1000 * 60
  });
}