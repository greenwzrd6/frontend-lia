/** A board column (lane) holding placed cards. */
export type ColumnType = {
  id: string;
  boardId: string;
  title: string;
  /** Sort order within the board; position 0 is treated as the inbox column. */
  position: number;
  /** Whether cards may be dropped into this column; read-only columns reject drops. */
  requestWritable: boolean;
};
