import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPlacement,
  type CreatePlacementRequest,
} from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";
import type { PlacementType } from "../types/placement";

export type MovePlacementVars = {
  request: CreatePlacementRequest;
  /**
   * Final entityId order for *only* the columns the drop actually changed.
   * Usually one column (reorder) or two (cross-column move).
   */
  order: Record<string, string[]>;
};

/**
 * Persists a single card move and owns the optimistic update + rollback.
 *
 * The live drag is handled elsewhere with ephemeral local state — the query
 * cache is only written here, once, on drop. That keeps server state (this
 * cache) and interaction state (the drag) cleanly separated instead of writing
 * to the cache on every pointer-move frame.
 */
export function useMovePlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ request }: MovePlacementVars) => createPlacement(request),

    onMutate: ({ order }) => {
      const columnIds = Object.keys(order);

      // Snapshot the touched columns for rollback, and index every placement
      // in them so we can resolve a card that moved *between* two columns.
      const snapshot = new Map<string, PlacementType[]>();
      const byEntityId = new Map<string, PlacementType>();
      for (const columnId of columnIds) {
        const current =
          queryClient.getQueryData<PlacementType[]>(
            placementKeys.byColumnId(columnId),
          ) ?? [];
        snapshot.set(columnId, current);
        for (const placement of current) {
          byEntityId.set(placement.entityId, placement);
        }
      }

      // Write the final order into each changed column. Do this synchronously
      // (before any awaits) so there's never a frame where the card snaps back.
      for (const columnId of columnIds) {
        const next = order[columnId]
          .map((entityId) => byEntityId.get(entityId))
          .filter((placement): placement is PlacementType => placement != null)
          // reflect the new column on a card that crossed over
          .map((placement) =>
            placement.columnId === columnId
              ? placement
              : { ...placement, columnId },
          );

        queryClient.setQueryData(placementKeys.byColumnId(columnId), next);
        void queryClient.cancelQueries({
          queryKey: placementKeys.byColumnId(columnId),
          exact: true,
        });
      }

      return { snapshot };
    },

    onError: (_error, _vars, context) => {
      if (!context) return;
      for (const [columnId, placements] of context.snapshot) {
        queryClient.setQueryData(
          placementKeys.byColumnId(columnId),
          placements,
        );
      }
    },

    // No onSettled invalidation: the optimistic order is authoritative. The
    // server only assigns the card's sortKey, which we don't need back to keep
    // ordering correct (order is held by array position until the next fetch).
    // If a column can't hold thousands and you want the exact sortKey sooner,
    // enrich the SignalR echo with the moved placement and setQueryData it in.
  });
}
