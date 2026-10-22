import { useQuery } from "@tanstack/react-query";

import { getColumnsByBoardId } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

/**
 * Query for a board's columns (GET /api/columns/boardid/{boardId}) under the
 * {@link columnKeys.byBoardId} key; disabled until `boardId` is set.
 */
export function useColumns(boardId: string) {
  return useQuery({
    queryKey: columnKeys.byBoardId(boardId),
    queryFn: () => getColumnsByBoardId(boardId),
    enabled: !!boardId,
  });
}
