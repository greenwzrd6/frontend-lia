import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlacements } from "../services/placementApi";
import type { PlacementType } from "../types/placement";
import { placementKeys } from "../utils/queryKeys";
import type { BoardId } from "../types/board";

export function usePlacements(boardId: BoardId) {
  console.log("usePlacements:", boardId);

  const qc = useQueryClient();
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.all,
    queryFn: async () => {
      const res = await getPlacements(boardId);
      res.forEach((placement) => {
        qc.setQueryData<PlacementType[]>(placementKeys.byColumnId(placement.columnId), (foundPlacements) =>
          foundPlacements ? [...foundPlacements, placement] : [placement],
        );
      });
      return res;
    },
    enabled: !!boardId,
    staleTime: Infinity,
  });
}

export const invalidateAllPlacements = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: ["placements"],
  });
};
