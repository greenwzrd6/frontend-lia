import type { TaskType } from "../types/task";

export function getDescendants(
  entities: TaskType[],
  rootIds: string[],
): TaskType[] {
  const result: TaskType[] = [];

  function collectChildren(parentId: string) {
    const children = entities.filter((entity) => entity.ParentId === parentId);

    for (const child of children) {
      result.push(child);
      collectChildren(child.Id);
    }
  }

  for (const rootId of rootIds) {
    collectChildren(rootId);
  }
  return result;
}
