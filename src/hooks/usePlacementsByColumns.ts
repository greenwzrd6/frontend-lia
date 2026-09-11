import { useQueries } from "@tanstack/react-query";
import type { PlacementType } from "../types/placement";
import type { ColumnType } from "../types/column";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";

export function usePlacementsByColumns(columns: ColumnType[], boardId: string) {
  const queries = useQueries({
    queries: columns.map((column) => ({
      queryKey: placementKeys.byColumnId(column.id),
      queryFn: () => getPlacementsByColumn(column.id, boardId),
      enabled: !!column.id && !!boardId,
      staleTime: Infinity,
    })),
  });

  const placements: PlacementType[] = queries.flatMap(
    (query) => query.data ?? [],
  );

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return {
    placements,
    isLoading,
    isError,
  };
}
