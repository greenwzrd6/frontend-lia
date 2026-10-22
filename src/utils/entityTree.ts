import type { TaskType } from "../types/task";

/**
 * Collects every entity reachable by following `parentId` from `rootIds`,
 * depth-first and excluding the roots themselves.
 *
 * @param entities Flat list of tasks to search.
 * @param rootIds  Ids to start the traversal from.
 * @returns The descendants in discovery order.
 */
export function getDescendants(
  entities: TaskType[],
  rootIds: string[],
): TaskType[] {
  const result: TaskType[] = [];

  function collectChildren(parentId: string) {
    const children = entities.filter((entity) => entity.parentId === parentId);

    for (const child of children) {
      result.push(child);
      collectChildren(child.id);
    }
  }

  for (const rootId of rootIds) {
    collectChildren(rootId);
  }
  return result;
}
