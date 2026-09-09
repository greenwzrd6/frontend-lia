import { apiRequest, TOJ_API_URL } from "./api";
import type { EntityType } from "../types/entity";
import type { taskIds } from "../../data/taskIds.json"

export async function getTasksByEntityId(
  projectIds: string,
  taskIds: string,
): Promise<EntityType[]> {
  return apiRequest<EntityType[]>(
    `/api/nodeitemservice/getnodeitems/${projectIds}?taskIds=${taskIds}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectIds,
        taskIds,
      }),
    },
    TOJ_API_URL,
  );
}
