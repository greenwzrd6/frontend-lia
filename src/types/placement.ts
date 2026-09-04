type BoardId = {
  id: string;
};

type ColumnId = {
  id: string;
};

type EntityId = {
    id: string;
}

export type PlacementType = {
    entityId: EntityId;
    boardId: BoardId;
    columnId: ColumnId;
    timeStamp: string;
    sortKey: string;
}