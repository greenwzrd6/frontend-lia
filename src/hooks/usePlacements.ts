import { QueryClient, useQuery } from "@tanstack/react-query";
import { getPlacements } from "../services/placementApi";
import type { PlacementType } from "../types/placement";

export function usePlacements(boardId: string) {
  console.log("usePlacements:", boardId);

  return useQuery<PlacementType[]>({
    queryKey: ["placements", boardId],
    queryFn: () => getPlacements(boardId),
    enabled: !!boardId,
  });
}

export const invalidateAllPlacements = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: ["placements"],
  });
};