import { useQuery } from "@tanstack/react-query";

import { getColumnEdgesByBoardId } from "../services/columnEdgeApi";

export function useColumnEdges(boardId: string) {
  return useQuery({
    queryKey: ["columnEdges", boardId],
    queryFn: () => getColumnEdgesByBoardId(boardId),
    enabled: !!boardId,
  });
}
