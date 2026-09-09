import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getBoard } from "../services/boardApi";

export function useBoard() {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id!),
    enabled: !!id,
  });
}
