import { type QueryClient, useQuery } from "@tanstack/react-query";
import type { PlacementType } from "../types/placement";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";
import type { ColumnId } from "../types/column";
import type { BoardId } from "../types/board"

export function usePlacement(columnId: ColumnId, boardId: BoardId) {
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.byColumnId(columnId),
    queryFn: () => getPlacementsByColumn(columnId, boardId),

    enabled: !!columnId && !!boardId,
    staleTime: Infinity,
  });
}

export const invalidateColumnPlacements = (
  queryClient: QueryClient,
  columnIds: ColumnId[],
) => {
  columnIds.forEach((id) =>
    queryClient.invalidateQueries({
      queryKey: placementKeys.byColumnId(id),
    }),
  );
};
