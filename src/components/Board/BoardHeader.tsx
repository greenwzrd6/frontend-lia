import type { Board } from "../../types/board";

type Props = {
  board: Board;
};

export default function BoardHeader({ board }: Readonly<Props>) {
  return (
    <header>
      <h1>{board.title}</h1>
    </header>
  );
}
