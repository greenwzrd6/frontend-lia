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
    queryKey: ["placements", boardId, ...entityIds],
    queryFn: async () => {
      const res = await getPlacements(entityIds, boardId);

      await createMissingPlacements(entities, res, boardId);

      const updatedPlacements = await getPlacements(
        entityIds,
        boardId
      );
      updatedPlacements.forEach((placement) => {
        qc.setQueryData<PlacementType[]>(
          placementKeys.byColumnId(placement.columnId),
          (foundPlacements) =>
            foundPlacements ? [...foundPlacements, placement] : [placement],
        );
      });
      return updatedPlacements;
    },
    enabled: !!boardId && entities.length > 0,
    staleTime: Infinity,
  });
}
