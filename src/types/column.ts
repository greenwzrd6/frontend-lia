export type ColumnId = {
  id: string;
};

export type BoardId = {
  id: string;
};

export type ColumnType = {
  id: ColumnId;
  title: string;
  position: number;
  boardId: BoardId
};