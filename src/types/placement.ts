/** Records that an entity sits in a column on a board, with its order within that column. */
export type PlacementType = {
  entityId: string;
  boardId: string;
  columnId: string;
  /** When the placement was written. */
  timeStamp: string;
  /** Order within the column; compared lexicographically (see utils/sortPlacements). */
  sortKey: string;
  sourceColumnId: string;
  targetColumnId: string;
};

/** One column transition inside a {@link PlacementCreatedEvent}. */
export type PlacementChange = {
  /** Column the entities moved from, or null when they were placed for the first time. */
  sourceColumnId: string | null;
  targetColumnId: string;
};

/** Payload of the SignalR `PlacementCreated` event from the /hubs/board hub. */
export type PlacementCreatedEvent = {
  /** Ids of the entities whose placements changed. */
  entityIds: string[];
  /** Column transitions to refresh; consumers invalidate these columns' placement queries. */
  changes: PlacementChange[];
};
