import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";
import { boardKeys } from "../utils/queryKeys";

export function useBoard() {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: boardKeys.byId(id),
    queryFn: () => getBoard(id!),
    enabled: !!id,
  });
}
