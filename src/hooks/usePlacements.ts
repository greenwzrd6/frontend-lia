import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMissingPlacements,
  getPlacements,
} from "../services/placementApi";

import { placementKeys } from "../utils/queryKeys";
import type { TaskType } from "../types/task";
import type { ColumnType } from "../types/column";

/**
 * Bootstrap query for the placements of `entities` on a board
 * (key {@link placementKeys.byBoard}).
 *
 * On each fetch it also creates placements for entities that are not placed
 * yet (into the inbox column at position 0) and then invalidates the inbox
 * column's `placementKeys.byColumnId` query. Runs only when there is a board,
 * entities and columns including an inbox column, and never refetches once
 * fresh (`staleTime: Infinity`).
 */
export function usePlacements(
  entities: TaskType[],
  boardId: string,
  columns: ColumnType[],
) {
  const queryClient = useQueryClient();

  const entityIds = entities.map((entity) => entity.id);

  const inboxColumn = columns.find((column) => column.position === 0);

  return useQuery({
    queryKey: placementKeys.byBoard(boardId, entityIds),

    queryFn: async () => {
      const placements = await getPlacements(entityIds, boardId);

      await createMissingPlacements(entities, placements, boardId, columns);

      if (inboxColumn) {
        await queryClient.invalidateQueries({
          queryKey: placementKeys.byColumnId(inboxColumn.id),
          exact: true,
        });
      }

      return placements;
    },

    enabled:
      !!boardId && entities.length > 0 && columns.length > 0 && !!inboxColumn,

    staleTime: Infinity,
  });
}
