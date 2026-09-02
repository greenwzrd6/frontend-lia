import type { BoardType } from "../../types/board";

type Props = {
  board: BoardType;
};

export default function BoardHeader({ board }: Readonly<Props>) {
  return (
    <header className="flex flex-row justify-center mb-2">
      <h1 className="text-xl font-bold">{board.title}</h1>
    </header>
  );
}
