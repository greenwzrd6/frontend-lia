import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlacements } from "../services/placementApi";
import type { PlacementType } from "../types/placement";
import { placementKeys } from "../utils/queryKeys";

export function usePlacements(boardId: string) {
  console.log("usePlacements:", boardId);

  const qc = useQueryClient();
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.all,
    queryFn: async () => {
      const res = await getPlacements(boardId);
      res.forEach((placement) => {
        qc.setQueryData<PlacementType[]>(
          placementKeys.byColumnId(placement.columnId),
          (foundPlacements) =>
            foundPlacements ? [...foundPlacements, placement] : [placement],
        );
      });
      return res;
    },
    enabled: !!boardId,
    staleTime: Infinity,
  });
}
