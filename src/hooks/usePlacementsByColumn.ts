import { useQuery } from "@tanstack/react-query";

import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";
import { bySortKey } from "../utils/sortPlacements";

/**
 * Subscribes a single column to its own placement cache. Each column has an
 * independent query, so optimistic drag updates and SignalR invalidations can
 * target one column without re-rendering the rest of the board.
 */
export function usePlacementsByColumn(
  columnId: string,
  boardId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: placementKeys.byColumnId(columnId),
    queryFn: async () => {
      const result = await getPlacementsByColumn(columnId, boardId);
      return [...result].sort(bySortKey);
    },
    enabled: enabled && !!boardId,
    staleTime: Infinity,
    gcTime: 0,
  });
}
