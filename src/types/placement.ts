import type { BoardId } from "./board";
import type { ColumnId } from "./column";
import type { EntityId } from "./entity";

export type PlacementType = {
  entityId: EntityId;
  boardId: BoardId;
  columnId: ColumnId;
  timeStamp: string;
  sortKey: string;
};
