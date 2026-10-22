import { useQuery } from "@tanstack/react-query";

import { getTasksByProjectId } from "../services/taskApi";
import { entityKeys } from "../utils/queryKeys";

const PROJECT_ID = "3e034485-2d34-f111-ae9c-3cecef9b8585";

/**
 * Query for the TOJ tasks of the hard-coded project
 * (POST /toj-api/api/nodeitemservice/getnodeitems) under the
 * {@link entityKeys.byProjectId} key.
 */
export function useTasks() {
  return useQuery({
    queryKey: entityKeys.byProjectId(PROJECT_ID),
    queryFn: () => getTasksByProjectId(PROJECT_ID),
  });
}
