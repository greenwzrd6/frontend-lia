export type BoardId = {
  id: string;
};

export type ColumnId = {
  id: string;
};

export type EntityId = {
  id: string;
};

export type PlacementType = {
  entityId: EntityId;
  boardId: BoardId;
  columnId: ColumnId;
  timeStamp: string;
  sortKey: string;
};
