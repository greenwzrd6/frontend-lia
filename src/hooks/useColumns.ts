import { useQuery } from "@tanstack/react-query";

import { getColumnsByBoardId } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

export function useColumns(boardId: string) {
  return useQuery({
    queryKey: ["columns", boardId],
    queryFn: () => getColumnsByBoardId(boardId),
    enabled: !!boardId,
  });
}
