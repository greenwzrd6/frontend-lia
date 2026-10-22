import { useQuery } from "@tanstack/react-query";

import { getColumnEdgesByBoardId } from "../services/columnEdgeApi";
import { columnEdgeKeys } from "../utils/queryKeys";

/**
 * Query for a board's column edges (GET /api/columnedges/boardid/{boardId})
 * under the {@link columnEdgeKeys.byBoardId} key; disabled until `boardId`
 * is set.
 */
export function useColumnEdges(boardId: string) {
  return useQuery({
    queryKey: columnEdgeKeys.byBoardId(boardId),
    queryFn: () => getColumnEdgesByBoardId(boardId),
    enabled: !!boardId,
  });
}
