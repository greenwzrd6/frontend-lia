export type PlacementType = {
  entityId: string;
  boardId: string;
  columnId: string;
  timeStamp: string;
  sortKey: string;
  sourceColumnId: string;
  targetColumnId: string;
};

export type PlacementChange = {
  sourceColumnId: string | null;
  targetColumnId: string;
};

export type PlacementCreatedEvent = {
  entityIds: string[];
  changes: PlacementChange[];
};
