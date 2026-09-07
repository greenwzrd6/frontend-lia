export type BoardId = string & {
  readonly __brand: "BoardId";
};

export type BoardType = {
    id: BoardId;
    title: string[];
    roots: string[];
}