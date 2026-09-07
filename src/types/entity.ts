export type EntityId = string & {
  readonly __brand: "EntityId";
};

export type EntityType = {
  id: EntityId;
  title: string;
};

export function toEntityId(value: string): EntityId {
  return value as EntityId;
}
