import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMissingPlacements,
  getPlacements,
} from "../services/placementApi";
import type { PlacementType } from "../types/placement";
import { placementKeys } from "../utils/queryKeys";
import type { EntityType } from "../types/entity";
import type { ColumnType } from "../types/column";

export function usePlacements(entities: EntityType[], boardId: string, column: ColumnType[]) {

  const entityIds = entities.map((entity) => entity.Id);
  const qc = useQueryClient();

  return useQuery<PlacementType[]>({
    queryKey: placementKeys.byBoard(boardId, entityIds),
    queryFn: async () => {
      const res = await getPlacements(entityIds, boardId);

      await createMissingPlacements(entities, res, boardId, column);

      const updatedPlacements = await getPlacements(entityIds, boardId);

      updatedPlacements.forEach((placement) => {
        qc.setQueryData<PlacementType[]>(
          placementKeys.byColumnId(placement.columnId),
          (currentCachedPlacements) => {
            if (!currentCachedPlacements) {
              return [placement];
            }
            const withoutOldPlacements = currentCachedPlacements.filter(
              (found) => found.entityId !== placement.entityId,
            );

            return [...withoutOldPlacements, placement]
          }
        );
      });
      return updatedPlacements;
    },
    enabled: !!boardId && entities.length > 0,
    staleTime: Infinity,
  });
}
