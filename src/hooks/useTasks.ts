import { useQuery } from "@tanstack/react-query";

import { getTasksByProjectId } from "../services/taskApi";
import { entityKeys } from "../utils/queryKeys";

const PROJECT_ID = "3e034485-2d34-f111-ae9c-3cecef9b8585";

export function useTasks() {
  return useQuery({
    queryKey: entityKeys.byProjectId(PROJECT_ID),
    queryFn: () => getTasksByProjectId(PROJECT_ID),
  });
}
