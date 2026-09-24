import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";
import { boardKeys } from "../utils/queryKeys";

export function useBoard(boardId?: string) {
  const { id } = useParams<{ id: string }>();

  const idForFlow = boardId ?? id;

  return useQuery({
    queryKey: boardKeys.byId(idForFlow),
    queryFn: () => getBoard(idForFlow!),
    enabled: !!id,
  });
}
