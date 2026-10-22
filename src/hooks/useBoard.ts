import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";
import { boardKeys } from "../utils/queryKeys";

/**
 * Query for a single board (GET /api/boards/{id}) under the
 * {@link boardKeys.byId} key.
 *
 * @param boardId Board to fetch; when omitted the `:id` route param is used.
 *                The query stays disabled while no id is available.
 */
export function useBoard(boardId?: string) {
  const { id } = useParams<{ id: string }>();

  const idForFlow = boardId ?? id;

  return useQuery({
    queryKey: boardKeys.byId(idForFlow),
    queryFn: () => getBoard(idForFlow!),
    enabled: !!idForFlow,
  });
}
