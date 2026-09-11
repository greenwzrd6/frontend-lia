import { useQuery } from "@tanstack/react-query";

import { getTasksByEntityId } from "../services/taskApi";

const PROJECT_ID = "3e034485-2d34-f111-ae9c-3cecef9b8585";

export function useEntities() {

  return useQuery({
    queryKey: ["entities", PROJECT_ID],
    queryFn: () => getTasksByEntityId(PROJECT_ID),
  });
}