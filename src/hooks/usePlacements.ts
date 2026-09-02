import { useQueries} from "@tanstack/react-query";
import { mockEntities } from "../services/mockEntities";
import { useColumns } from "./useColumns";
import { useMemo } from "react";
import { getPlacement } from "../services/placementApi";

export function usePlacements() {
    const columnsQuery = useColumns();

    const columnIds = useMemo(
      () => (columnsQuery.data ? columnsQuery.data.map((c) => c.id) : []),
      [columnsQuery], 
    );

    const placementsQueries = useQueries({
    queries: mockEntities.map((entity) => {
        return {
          queryKey: ["placement", entity.id],
          queryFn: () => getPlacement(entity.id, columnIds),
        };
      }),
    });

    return placementsQueries;
}
  
  
  