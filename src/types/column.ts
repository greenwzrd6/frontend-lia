import type { BoardId } from "./board";

export type ColumnId = string & {
  readonly __brand: "ColumnId";
};

export type ColumnType = {
  id: ColumnId;
  title: string;
  position: number;
  boardId: BoardId;
};

export function toColumnId(value: string): ColumnId {
  return value as ColumnId;
}
