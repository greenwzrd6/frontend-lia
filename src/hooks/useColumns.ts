import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getColumnsByBoardId } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

export function useColumns() {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: columnKeys.byBoardId(id),
    queryFn: () => getColumnsByBoardId(id!),
    enabled: !!id,
  });
}
