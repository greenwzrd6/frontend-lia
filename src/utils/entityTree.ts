import type { TaskType } from "../types/task";

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
