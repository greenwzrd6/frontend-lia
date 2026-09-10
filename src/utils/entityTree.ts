import type { EntityType } from "../types/entity";

export function getDescendants(
  entities: EntityType[],
  rootIds: string[],
): EntityType[] {
  const result: EntityType[] = [];

  function collectChildren(parentId: string) {
    const children = entities.filter(
        (entity) => entity.ParentId === parentId
    );

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
