import { apiRequestToj } from "./api";
import { taskIds } from "../../data/taskIds.json";
import type { NodeType } from "../types/node";
import type { TaskType } from "../types/task";

/**
 * Fetches tasks for a project from the external TOJ API
 * (POST /toj-api/api/nodeitemservice/getnodeitems) and maps the raw
 * {@link NodeType} responses to plain {@link TaskType}s.
 *
 * @param projectIds The project whose node items should be returned.
 */
export async function getTasksByProjectId(
  projectIds: string,
): Promise<TaskType[]> {
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
    id: node.Id,
    parentId: node.ParentId,
    title: node.Title,
  }));
}
