import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMissingPlacements,
  getPlacements,
} from "../services/placementApi";

import { placementKeys } from "../utils/queryKeys";
import type { EntityType } from "../types/entity";
import type { ColumnType } from "../types/column";

export function usePlacements(
  entities: EntityType[],
  boardId: string,
  columns: ColumnType[],
) {
  const queryClient = useQueryClient();

  const entityIds = entities.map((entity) => entity.Id);

  const inboxColumn = columns.find(
    (column) => column.position === 0,
  );

  return useQuery({
    queryKey: placementKeys.byBoard(boardId, entityIds),

    queryFn: async () => {
      const placements = await getPlacements(
        entityIds,
        boardId,
      );

      await createMissingPlacements(
        entities,
        placements,
        boardId,
        columns,
      );

      if (inboxColumn) {
        await queryClient.invalidateQueries({
          queryKey: placementKeys.byColumnId(inboxColumn.id),
          exact: true,
        });
      }

      return placements;
    },

    enabled:
      !!boardId &&
      entities.length > 0 &&
      columns.length > 0 &&
      !!inboxColumn,

    staleTime: Infinity,
  });
}