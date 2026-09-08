import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMissingPlacements,
  getPlacements,
} from "../services/placementApi";
import type { PlacementType } from "../types/placement";
import { placementKeys } from "../utils/queryKeys";
import type { EntityType } from "../types/entity";

export function usePlacements(entities: EntityType[], boardId: string) {
  console.log("usePlacements:", boardId);

  const entityIds = entities.map((entity) => entity.id);

  const qc = useQueryClient();
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.all,
    queryFn: async () => {
      const res = await getPlacements(entityIds, boardId);
      console.log("GET placements result:", res);
      console.log("Number of placements:", res.length);

      console.log("entityIds:", entityIds);
      console.log("existing placements:", res);

      await createMissingPlacements(entities, res, boardId);
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
