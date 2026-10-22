/** A Kanban board as returned by GET /api/boards/{id}. */
export type BoardType = {
  id: string;
  title: string;
  /** Ids of the board's root entities; the board page expands them into visible cards. */
  roots: string[];
};
