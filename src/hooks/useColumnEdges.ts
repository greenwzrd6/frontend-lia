import { useQuery } from "@tanstack/react-query";

import { getColumnEdgesByBoardId } from "../services/columnEdgeApi";
import { columnEdgeKeys } from "../utils/queryKeys";

export function useColumnEdges(boardId: string) {
  return useQuery({
    queryKey: columnEdgeKeys.byBoardId(boardId),
    queryFn: () => getColumnEdgesByBoardId(boardId),
    enabled: !!boardId,
  });
}
