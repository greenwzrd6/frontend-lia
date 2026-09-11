import { apiRequestToj } from "./api";
import { taskIds } from "../../data/taskIds.json";
import type { NodeType } from "../types/node";
import type { EntityType } from "../types/entity";

export async function getTasksByEntityId(
  projectIds: string,
): Promise<EntityType[]> {
  const nodes = await apiRequestToj<NodeType[]>(
    "/toj-api/api/nodeitemservice/getnodeitems",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectIds: [projectIds],
        taskIds,
      }),
    },
  );

  return nodes.map((node) => ({
    Id: node.Id,
    ParentId: node.ParentId,
    Title: node.Title,
  }));
}