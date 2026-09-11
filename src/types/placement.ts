export type PlacementType = {
  entityId: string;
  boardId: string;
  columnId: string;
  timeStamp: string;
  sortKey: string;
  sourceColumnId: string;
  targetColumnId: string;
};

export type PlacementCreatedEvent = {
  entityIds: string[];
  sourceColumnId: string | null;
  targetColumnId: string;
};
